package com.invoice.tracker.controller.subscription;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.service.subscription.SubscriptionWebhookService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subscriptions/webhook")
@RequiredArgsConstructor
public class SubscriptionWebhookController {
    
    private final SubscriptionWebhookService subscriptionWebhookService;

    @PostMapping
    public ResponseEntity<Void> webhook(
        @RequestBody String payload,
        @RequestHeader("X-Razorpay-Signature") String signature
    ) {

        subscriptionWebhookService.processWebhook(signature, payload);

        return ResponseEntity.ok().build();
    }
}
