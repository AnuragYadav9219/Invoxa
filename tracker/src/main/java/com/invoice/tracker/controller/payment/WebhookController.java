package com.invoice.tracker.controller.payment;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.service.payment.gateway.RazorpayWebhookService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {
    
    private final RazorpayWebhookService webhookService;

    @PostMapping("/webhook")
    public ResponseEntity<String> webhook(
        @RequestHeader("X-Razorpay-Signature") String signature,
        @RequestBody String payload
    ) {

        webhookService.processWebhook(signature, payload);

        return ResponseEntity.ok().build();
    }
}
