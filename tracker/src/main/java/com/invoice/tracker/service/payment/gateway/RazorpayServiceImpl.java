package com.invoice.tracker.service.payment.gateway;

import com.invoice.tracker.repository.payment.PaymentRepository;
import java.math.BigDecimal;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.config.gateway.RazorpayProperties;
import com.invoice.tracker.dto.gateway.CreateOrderResponse;
import com.invoice.tracker.dto.gateway.VerifyPaymentRequest;
import com.invoice.tracker.dto.payment.CreatePaymentRequest;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.invoice.InvoiceStatus;
import com.invoice.tracker.entity.payment.PaymentMethod;
import com.invoice.tracker.helper.invoice.InvoiceHelper;
import com.invoice.tracker.service.payment.PaymentService;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RazorpayServiceImpl implements RazorpayService {

    private final PaymentRepository paymentRepository;
    private final RazorpayClient razorpayClient;
    private final RazorpayProperties properties;
    private final InvoiceHelper invoiceHelper;
    private final PaymentService paymentService;

    @Override
    public CreateOrderResponse createOrder(UUID invoiceId) throws Exception {

        Invoice invoice = invoiceHelper.getInvoiceOrThrow(invoiceId);

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new BadRequestException("Invoice already paid");
        }

        try {

            JSONObject options = new JSONObject();

            options.put("amount",
                    invoice.getRemainingAmount()
                            .multiply(BigDecimal.valueOf(100))
                            .intValue());

            options.put("currency", "INR");

            options.put("receipt", invoice.getInvoiceNumber());

            JSONObject notes = new JSONObject();

            notes.put("invoiceId", invoice.getId().toString());
            notes.put("invoiceNumber", invoice.getInvoiceNumber());
            notes.put("shopId", invoice.getShopId().toString());

            options.put("notes", notes);

            Order order = razorpayClient.orders.create(options);

            return CreateOrderResponse.builder()
                    .orderId(order.get("id"))
                    .amount(invoice.getRemainingAmount())
                    .currency("INR")
                    .key(properties.getKeyId())
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Unable to create Razorpay Order", e);
        }
    }

    @Override
    @Transactional
    public void verifyPayment(VerifyPaymentRequest request) {

        try {

            JSONObject attributes = new JSONObject();

            attributes.put("razorpay_order_id", request.getRazorpayOrderId());
            attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
            attributes.put("razorpay_signature", request.getRazorpaySignature());

            boolean valid = Utils.verifyPaymentSignature(attributes, properties.getKeySecret());

            if (!valid) {
                throw new BadRequestException("Invalid payment signature");
            }

            // Prevent duplicate payments
            if (paymentRepository.existsByGatewayPaymentId(request.getRazorpayPaymentId())) {
                return;
            }

            Payment razorpayPayment = razorpayClient.payments.fetch(request.getRazorpayPaymentId());

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

            Invoice invoice = invoiceHelper.getInvoiceOrThrow(request.getInvoiceId());

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

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Payment verification failed", e);
        }
    }

}
