package com.invoice.tracker.service.payment.gateway;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.dto.payment.CreatePaymentRequest;
import com.invoice.tracker.entity.payment.PaymentMethod;
import com.invoice.tracker.repository.payment.PaymentRepository;
import com.invoice.tracker.service.payment.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RazorpayWebhookServiceImpl implements RazorpayWebhookService {

    private final RazorpayGatewayService gatewayService;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void processWebhook(String signature, String payload) {

        try {

            if (!gatewayService.verifyWebhook(payload, signature)) {
                throw new BadRequestException("Invalid webhook signature");
            }

            JsonNode root = objectMapper.readTree(payload);

            String event = root.path("event").asText();

            if (!"payment.captured".equals(event)) {
                log.debug("Ignoring Razorpay event: {}", event);
                return;
            }

            JsonNode entity = root
                    .path("payload")
                    .path("payment")
                    .path("entity");

            String paymentId = entity.path("id").asText();

            if (paymentRepository.existsByGatewayPaymentId(paymentId)) {
                log.info("Payment {} already processed.", paymentId);
                return;
            }

            String orderId = entity.path("order_id").asText();

            long amountInPaise = entity.path("amount").numberValue().longValue();

            BigDecimal amount = BigDecimal
                    .valueOf(amountInPaise)
                    .divide(BigDecimal.valueOf(100));

            JsonNode notes = entity.path("notes");

            String invoiceIdText = notes.path("invoiceId").asText();

            if (invoiceIdText == null || invoiceIdText.isBlank()) {
                throw new BadRequestException("Invoice ID missing in Razorpay notes.");
            }

            UUID invoiceId = UUID.fromString(invoiceIdText);

            CreatePaymentRequest request = new CreatePaymentRequest();

            request.setInvoiceId(invoiceId);
            request.setAmount(amount);
            request.setMethod(PaymentMethod.RAZORPAY);
            request.setReferenceNumber(paymentId);
            request.setGatewayOrderId(orderId);
            request.setGatewayPaymentId(paymentId);
            request.setGatewaySignature(signature);

            paymentService.addPayment(request);

            log.info("Invoice payment processed successfully. PaymentId={}", paymentId);

        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Failed to process Razorpay webhook", ex);
            throw new RuntimeException("Webhook processing failed", ex);
        }
    }
}