package com.invoice.tracker.service.payment.gateway;

public interface RazorpayWebhookService {

    void processWebhook(String signature, String payload);
}
