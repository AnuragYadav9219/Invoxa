package com.invoice.tracker.service.payment.gateway;

import java.math.BigDecimal;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.dto.gateway.CreateOrderResponse;
import com.invoice.tracker.dto.gateway.VerifyPaymentRequest;
import com.invoice.tracker.dto.payment.CreatePaymentRequest;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.invoice.InvoiceStatus;
import com.invoice.tracker.entity.payment.PaymentMethod;
import com.invoice.tracker.helper.invoice.InvoiceHelper;
import com.invoice.tracker.repository.payment.PaymentRepository;
import com.invoice.tracker.service.payment.PaymentService;
import com.razorpay.Order;
import com.razorpay.Payment;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RazorpayServiceImpl implements RazorpayService {

    private final PaymentRepository paymentRepository;
    private final RazorpayGatewayService gatewayService;
    private final InvoiceHelper invoiceHelper;
    private final PaymentService paymentService;

    @Override
    public CreateOrderResponse createOrder(UUID invoiceId) {

        Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId);

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new BadRequestException("Invoice already paid");
        }

        try {

            JSONObject notes = new JSONObject();

            notes.put("invoiceId", invoice.getId().toString());
            notes.put("invoiceNumber", invoice.getInvoiceNumber());
            notes.put("shopId", invoice.getShopId().toString());

            Order order = gatewayService.createOrder(
                    invoice.getRemainingAmount(),
                    "INR",
                    invoice.getInvoiceNumber(),
                    notes);

            return CreateOrderResponse.builder()
                    .orderId(order.get("id"))
                    .amount(invoice.getRemainingAmount())
                    .currency("INR")
                    .key(order.get("key") == null ? null : order.get("key"))
                    .build();

        } catch (Exception ex) {
            throw new RuntimeException("Unable to create Razorpay order", ex);
        }
    }

    @Override
    @Transactional
    public void verifyPayment(UUID invoiceId, VerifyPaymentRequest request) {

        Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId);

        boolean valid = gatewayService.verifyPayment(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature());

        if (!valid) {
            throw new BadRequestException("Invalid payment signature");
        }

        if (paymentRepository.existsByGatewayPaymentId(
                request.getRazorpayPaymentId())) {
            return;
        }

        Payment razorpayPayment = gatewayService.fetchPayment(
                request.getRazorpayPaymentId());

        String status = razorpayPayment.get("status").toString();

        if (!"captured".equals(status)) {
            throw new BadRequestException("Payment not captured");
        }

        Object amountObj = razorpayPayment.get("amount");

        BigDecimal paidAmount;

        if (amountObj instanceof Number number) {

            paidAmount = BigDecimal.valueOf(number.longValue())
                    .divide(BigDecimal.valueOf(100));

        } else {

            paidAmount = new BigDecimal(amountObj.toString())
                    .divide(BigDecimal.valueOf(100));
        }

        if (paidAmount.compareTo(invoice.getRemainingAmount()) != 0) {
            throw new BadRequestException("Payment amount mismatch");
        }

        CreatePaymentRequest paymentRequest = new CreatePaymentRequest();

        paymentRequest.setInvoiceId(invoice.getId());
        paymentRequest.setAmount(paidAmount);
        paymentRequest.setMethod(PaymentMethod.RAZORPAY);
        paymentRequest.setReferenceNumber(request.getRazorpayPaymentId());

        paymentRequest.setGatewayOrderId(request.getRazorpayOrderId());
        paymentRequest.setGatewayPaymentId(request.getRazorpayPaymentId());
        paymentRequest.setGatewaySignature(request.getRazorpaySignature());

        paymentService.addPayment(paymentRequest);
    }
}