package com.invoice.tracker.service.payment.gateway;

import java.math.BigDecimal;
import java.util.UUID;

import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.invoice.tracker.config.gateway.RazorpayProperties;
import com.invoice.tracker.dto.payment.CreatePaymentRequest;
import com.invoice.tracker.entity.payment.PaymentMethod;
import com.invoice.tracker.repository.payment.PaymentRepository;
import com.invoice.tracker.service.payment.PaymentService;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RazorpayWebhookServiceImpl implements RazorpayWebhookService {

    private final RazorpayProperties properties;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;

    @Override
    @Transactional
    public void processWebhook(String signature, String payload) {

        try {

            boolean valid = Utils.verifyWebhookSignature(payload, signature, properties.getWebhookSecret());

            if (!valid) {
                throw new BadRequestException("Invalid webhook signature");
            }

            JsonNode root = new ObjectMapper().readTree(payload);
            String event = root.get("event").asText();

            if (!"payment.captured".equals(event)) {
                return;
            }

            JsonNode entity = root
                    .path("payload")
                    .path("payment")
                    .path("entity");

            String paymentId = entity.get("id").asText();

            if (paymentRepository.existsByGatewayPaymentId(paymentId)) {
                return;
            }

            String orderId = entity.get("order_id").asText();

            BigDecimal amount = new BigDecimal(
                    entity.get("amount").asText()).divide(BigDecimal.valueOf(100));

            JsonNode notes = entity.get("notes");

            UUID invoiceId = UUID.fromString(notes.get("invoiceId").asText());

            CreatePaymentRequest request = new CreatePaymentRequest();
            request.setInvoiceId(invoiceId);
            request.setAmount(amount);
            request.setMethod(PaymentMethod.RAZORPAY);
            request.setReferenceNumber(paymentId);
            request.setGatewayOrderId(orderId);
            request.setGatewayPaymentId(paymentId);
            request.setGatewaySignature(signature);

            paymentService.addPayment(request);

        } catch (Exception e) {
            throw new RuntimeException("Webhook processing failed", e);
        }
    }

}
