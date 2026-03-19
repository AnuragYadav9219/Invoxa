package com.invoice.tracker.service.payment;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.dto.payment.CreatePaymentRequest;
import com.invoice.tracker.dto.payment.PaymentResponse;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.invoice.InvoiceStatus;
import com.invoice.tracker.entity.payment.Payment;
import com.invoice.tracker.entity.payment.PaymentMethod;
import com.invoice.tracker.event.invoice.InvoiceFullyPaidEvent;
import com.invoice.tracker.event.invoice.PartialPaymentEvent;
import com.invoice.tracker.helper.invoice.InvoiceHelper;
import com.invoice.tracker.mapper.InvoiceMapper;
import com.invoice.tracker.mapper.PaymentMapper;
import com.invoice.tracker.repository.invoice.InvoiceRepository;
import com.invoice.tracker.repository.payment.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceHelper invoiceHelper;
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
        updateInvoice(invoice, request.getAmount());

        return paymentMapper.toResponse(savedPayment);
    }

    // ======================== MARK AS PAID ===========================
    // Mark as PAID
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
        invoice.setPaidAmount(invoice.getTotalAmount());
        invoice.setRemainingAmount(BigDecimal.ZERO);
        invoice.setStatus(InvoiceStatus.PAID);

        invoiceRepository.save(invoice);

        return invoiceMapper.toResponse(invoice);
    }

    // ====================== PAYMENT HISTORY ========================
    @Override
    public List<PaymentResponse> getPaymentsByInvoice(UUID invoiceId) {

        // Secure invoice access
        Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId);

        return paymentRepository.findByInvoiceIdOrderByCreatedAtDesc(invoice.getId())
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    // ======================== PRIVATE METHODS ===========================

    private void validateRequest(CreatePaymentRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Payment amount must be greater than zero");
        }

        if (request.getMethod() == null) {
            throw new BadRequestException("Payment method is required");
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

        if (amount.compareTo(invoice.getTotalAmount()) > 0) {
            throw new BadRequestException("Payment exceeds. Remaining amount: " + invoice.getRemainingAmount());
        }
    }

    private void updateInvoice(Invoice invoice, BigDecimal paymentAmount) {

        BigDecimal paid = invoice.getPaidAmount() == null
                ? BigDecimal.ZERO
                : invoice.getPaidAmount();

        BigDecimal newPaid = paid.add(paymentAmount);
        BigDecimal remaining = invoice.getTotalAmount().subtract(newPaid);

        if (remaining.compareTo(BigDecimal.ZERO) < 0) {
            remaining = BigDecimal.ZERO;
        }

        invoice.setPaidAmount(newPaid);
        invoice.setRemainingAmount(remaining);

        InvoiceStatus oldStatus = invoice.getStatus();

        if (remaining.compareTo(BigDecimal.ZERO) == 0) {
            invoice.setStatus(InvoiceStatus.PAID);
        } else {
            invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
        }

        publishPaymentEvent(invoice, oldStatus);
    }

    private void publishPaymentEvent(Invoice invoice, InvoiceStatus oldStatus) {

        if (oldStatus == invoice.getStatus()) {
            return;
        }

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            eventPublisher.publishEvent(new InvoiceFullyPaidEvent(invoice));
        } else if (invoice.getStatus() == InvoiceStatus.PARTIALLY_PAID) {
            eventPublisher.publishEvent(new PartialPaymentEvent(invoice));
        }
    }
}
