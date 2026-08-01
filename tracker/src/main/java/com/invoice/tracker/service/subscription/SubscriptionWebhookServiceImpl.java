package com.invoice.tracker.service.subscription;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.service.payment.gateway.RazorpayGatewayService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionWebhookServiceImpl
                implements SubscriptionWebhookService {

        private final RazorpayGatewayService gatewayService;
        private final SubscriptionPaymentService paymentService;
        private final ObjectMapper objectMapper;

        @Override
        @Transactional
        public void processWebhook(
                        String signature,
                        String payload) {

                try {

                        if (!gatewayService.verifyWebhook(payload, signature)) {
                                throw new BadRequestException(
                                                "Invalid webhook signature");
                        }

                        JsonNode root = objectMapper.readTree(payload);

                        String event = root.path("event").asText();

                        log.info("Webhook Event : {}", event);

                        switch (event) {
                                case "payment.captured" -> {

                                        JsonNode entity = root.path("payload")
                                                        .path("payment")
                                                        .path("entity");

                                        paymentService.completePayment(
                                                        entity.path("order_id").asText(),
                                                        entity.path("id").asText());
                                }

                                default -> log.debug(
                                                "Ignoring Razorpay event: {}",
                                                event);
                        }

                        JsonNode entity = root.path("payload")
                                        .path("payment")
                                        .path("entity");

                        String orderId = entity.path("order_id").asText();

                        String paymentId = entity.path("id").asText();

                        log.info("Webhook Order={}, Payment={}",
                                        orderId,
                                        paymentId);

                        paymentService.completePayment(
                                        orderId,
                                        paymentId);

                        log.info(
                                        "Subscription payment processed successfully. PaymentId={}",
                                        paymentId);

                } catch (BadRequestException ex) {
                        throw ex;
                } catch (Exception ex) {

                        log.error(
                                        "Failed to process subscription webhook",
                                        ex);

                        throw new RuntimeException(
                                        "Webhook processing failed",
                                        ex);
                }
        }
}