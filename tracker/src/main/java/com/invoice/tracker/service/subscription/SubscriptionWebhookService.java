package com.invoice.tracker.service.subscription;

public interface SubscriptionWebhookService {

    void processWebhook(
            String signature,
            String payload);

}