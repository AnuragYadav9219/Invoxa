package com.invoice.tracker.service.payment;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.dto.common.PageResponse;
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.dto.payment.CreatePaymentRequest;
import com.invoice.tracker.dto.payment.PaymentFilterRequest;
import com.invoice.tracker.dto.payment.PaymentResponse;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.invoice.InvoiceStatus;
import com.invoice.tracker.entity.payment.Payment;
import com.invoice.tracker.entity.payment.PaymentMethod;
import com.invoice.tracker.event.invoice.InvoiceFullyPaidEvent;
import com.invoice.tracker.event.invoice.PartialPaymentEvent;
import com.invoice.tracker.helper.invoice.InvoiceHelper;
import com.invoice.tracker.helper.payment.PaymentHelper;
import com.invoice.tracker.mapper.InvoiceMapper;
import com.invoice.tracker.mapper.PaymentMapper;
import com.invoice.tracker.repository.invoice.InvoiceRepository;
import com.invoice.tracker.repository.payment.PaymentRepository;
import com.invoice.tracker.security.SecurityUtils;
import com.invoice.tracker.specification.PaymentSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceHelper invoiceHelper;
    private final PaymentHelper paymentHelper;
    private final PaymentMapper paymentMapper;
    private final InvoiceMapper invoiceMapper;
    private final ApplicationEventPublisher eventPublisher;

    // ====================== ADD PAYMENT ========================
    @Override
    @Transactional
    public PaymentResponse addPayment(CreatePaymentRequest request) {

        validateRequest(request);

        // Secure invoice fetch
        Invoice invoice = invoiceHelper.getInvoiceOrThrow(request.getInvoiceId());
        validateInvoice(invoice, request.getAmount());

        // Create payment
        Payment payment = Payment.builder()
                .amount(request.getAmount())
                .method(request.getMethod())
                .referenceNumber(request.getReferenceNumber())
                .invoice(invoice)
                .build();

        // Save and flush
        Payment savedPayment = paymentRepository.saveAndFlush(payment);

        // Update invoice
        applyPaymentToInvoice(savedPayment);

        return paymentMapper.toResponse(savedPayment);
    }

    // ======================== MARK AS PAID ===========================
    @Override
    @Transactional
    public InvoiceResponse markInvoiceAsPaid(UUID invoiceId) {

        Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId);

        // Already paid
        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new BadRequestException("Invoice already marked as PAID");
        }

        BigDecimal remaining = invoice.getRemainingAmount();

        if (remaining == null || remaining.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("No remaining amount to pay");
        }

        // Create CASH payment record
        Payment payment = Payment.builder()
                .amount(remaining)
                .method(PaymentMethod.CASH)
                .referenceNumber("CASH")
                .invoice(invoice)
                .build();

        paymentRepository.save(payment);

        // Update invoice
        applyPaymentToInvoice(payment);

        return invoiceMapper.toResponse(invoice);
    }

    // ====================== UPDATE PAYMENT ==========================
    @Override
    @Transactional
    public PaymentResponse updatePayment(UUID id, CreatePaymentRequest request) {

        Payment payment = paymentHelper.getPaymentOrThrow(id);
        Invoice invoice = invoiceHelper.getInvoiceOrThrow(request.getInvoiceId());

        // Calculate allowed amount
        BigDecimal allowedAmount = invoice.getRemainingAmount()
                .add(payment.getAmount()); // include old payment

        if (request.getAmount().compareTo(allowedAmount) > 0) {
            throw new IllegalArgumentException("Amount exceeds allowed limit");
        }

        // Revert old payment
        reverseInvoicePayment(payment);

        payment.setInvoice(invoice);
        payment.setAmount(request.getAmount());
        payment.setMethod(request.getMethod());
        payment.setReferenceNumber(request.getReferenceNumber());

        // Apply new payment
        applyPaymentToInvoice(payment);

        Payment updated = paymentRepository.save(payment);

        return paymentMapper.toResponse(updated);
    }

    // ================== GET PAYMENTS BY INVOICE ======================
    @Override
    public List<PaymentResponse> getPaymentsByInvoice(UUID invoiceId) {

        // Secure invoice access
        Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId);

        return paymentRepository
                .findByInvoiceIdAndDeletedFalseOrderByCreatedAtDesc(invoice.getId())
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    // ====================== DELETE (SOFT) =============================
    @Override
    @Transactional
    public void deletePayment(UUID paymentId) {

        Payment payment = paymentHelper.getPaymentOrThrow(paymentId);

        payment.setDeleted(true);
        payment.setDeletedAt(LocalDateTime.now());

        paymentRepository.save(payment);

        reverseInvoicePayment(payment); // Implemented below
    }

    // ====================== DELETE PAYMENTS BY INVOICE =====================
    @Override
    @Transactional
    public void deletePaymentsByInvoice(UUID invoiceId) {

        List<Payment> payments = paymentRepository.findByInvoiceIdAndDeletedFalse(invoiceId);

        for (Payment payment : payments) {
            deletePayment(payment.getId());
        }

        paymentRepository.saveAll(payments);
    }

    // ================= RESTORE PAYMENTS BY INVOICE ==================
    @Override
    @Transactional
    public void restorePaymentsByInvoice(UUID invoiceId) {

        List<Payment> payments = paymentRepository.findByInvoiceIdAndDeletedTrue(invoiceId);

        for (Payment payment : payments) {
            restorePayment(payment.getId());
        }
    }

    // ====================== RESTORE PAYMENT =============================
    @Override
    public void restorePayment(UUID id) {

        Payment payment = paymentHelper.getAnyPaymentOrThrow(id);

        payment.setDeleted(false);
        payment.setDeletedAt(null);

        paymentRepository.save(payment);

        applyPaymentToInvoice(payment);
    }

    // ====================== PERMANENT DELETE =============================
    @Override
    public void permanentDeletePayment(UUID id) {

        Payment payment = paymentHelper.getAnyPaymentOrThrow(id);

        paymentRepository.delete(payment);
    }

    // ======================= GET DELETED PAYMENTS ====================
    @Override
    public List<PaymentResponse> getDeletedPayments() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return paymentRepository
                .findByInvoiceShopIdAndDeletedTrue(shopId)
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    // ===================== GET ALL PAYMENTS ============================
    @Override
    public PageResponse<PaymentResponse> getAllPayments(int page, int size) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Payment> paymentPage = paymentRepository.findByInvoiceShopIdAndDeletedFalse(shopId, pageable);

        List<PaymentResponse> content = paymentPage
                .stream()
                .map(paymentMapper::toResponse)
                .toList();

        return new PageResponse<>(
                content,
                paymentPage.getNumber(),
                paymentPage.getSize(),
                paymentPage.getTotalElements(),
                paymentPage.getTotalPages(),
                paymentPage.isLast());
    }

    // ======================== PRIVATE METHODS ===========================

    private void publishPaymentEvent(Invoice invoice, InvoiceStatus oldStatus) {

        if (oldStatus == invoice.getStatus()) {
            return;
        }

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            eventPublisher.publishEvent(new InvoiceFullyPaidEvent(invoice.getId(), shopId));
        } else if (invoice.getStatus() == InvoiceStatus.PARTIALLY_PAID) {
            eventPublisher.publishEvent(new PartialPaymentEvent(invoice.getId(), shopId));
        }
    }

    @Override
    public PageResponse<PaymentResponse> filterPayments(PaymentFilterRequest filter, int page, int size) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        // Sorting
        Sort sort = switch (filter.getSort()) {
            case "amount_asc" -> Sort.by("amount").ascending();
            case "amount_desc" -> Sort.by("amount").descending();
            case "date_asc" -> Sort.by("createdAt").ascending();
            default -> Sort.by("createdAt").descending();
        };

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Payment> paymentPage = paymentRepository.findAll(
                PaymentSpecification.filterPayments(filter, shopId),
                pageable);

        return new PageResponse<>(
                paymentPage.map(paymentMapper::toResponse).getContent(),
                paymentPage.getNumber(),
                paymentPage.getSize(),
                paymentPage.getTotalElements(),
                paymentPage.getTotalPages(),
                paymentPage.isLast());
    }

    // ========================== HELPERS ===============================

    private void reverseInvoicePayment(Payment payment) {

        Invoice invoice = payment.getInvoice();

        InvoiceStatus oldStatus = invoice.getStatus();

        BigDecimal paid = invoice.getPaidAmount() == null
                ? BigDecimal.ZERO
                : invoice.getPaidAmount();

        BigDecimal newPaid = paid.subtract(payment.getAmount());

        if (newPaid.compareTo(BigDecimal.ZERO) < 0) {
            newPaid = BigDecimal.ZERO;
        }

        BigDecimal remaining = invoice.getTotalAmount().subtract(newPaid);

        invoice.setPaidAmount(newPaid);
        invoice.setRemainingAmount(remaining);

        updateInvoiceStatus(invoice);

        publishPaymentEvent(invoice, oldStatus);

        invoiceRepository.save(invoice);
    }

    private void applyPaymentToInvoice(Payment payment) {

        Invoice invoice = payment.getInvoice();

        InvoiceStatus oldStatus = invoice.getStatus();

        BigDecimal paid = invoice.getPaidAmount() == null
                ? BigDecimal.ZERO
                : invoice.getPaidAmount();

        BigDecimal newPaid = paid.add(payment.getAmount());
        BigDecimal remaining = invoice.getTotalAmount().subtract(newPaid);

        invoice.setPaidAmount(newPaid);
        invoice.setRemainingAmount(remaining);

        updateInvoiceStatus(invoice);

        publishPaymentEvent(invoice, oldStatus);
        invoiceRepository.save(invoice);
    }

    private void updateInvoiceStatus(Invoice invoice) {

        BigDecimal remaining = invoice.getRemainingAmount();

        if (remaining.compareTo(BigDecimal.ZERO) == 0) {
            invoice.setStatus(InvoiceStatus.PAID);

        } else if (invoice.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
            if (invoice.getDueDate().isBefore(LocalDate.now())) {
                invoice.setStatus(InvoiceStatus.OVERDUE);
            } else {
                invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
            }

        } else {
            if (invoice.getDueDate().isBefore(LocalDate.now())) {
                invoice.setStatus(InvoiceStatus.OVERDUE);
            } else {
                invoice.setStatus(InvoiceStatus.PENDING);
            }
        }
    }

    private void validateRequest(CreatePaymentRequest request) {

        if (request == null || request.getAmount() == null
                || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Invalid payment amount");
        }
    }

    private void validateInvoice(Invoice invoice, BigDecimal amount) {

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new BadRequestException("Invoice already paid");
        }

        if (invoice.getRemainingAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Invoice already fully paid");
        }

        Objects.requireNonNull(invoice.getTotalAmount(), "Invalid invoice total");

        if (amount.compareTo(invoice.getRemainingAmount()) > 0) {
            throw new BadRequestException("Payment exceeds. Remaining amount: " + invoice.getRemainingAmount());
        }
    }

    @Override
    public PaymentResponse getPaymentById(UUID id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return paymentMapper.toResponse(payment);
    }
}
