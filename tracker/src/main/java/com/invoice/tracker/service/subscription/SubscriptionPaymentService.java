package com.invoice.tracker.service.subscription;

import com.invoice.tracker.dto.subscription.VerifySubscriptionPaymentRequest;

public interface SubscriptionPaymentService {

    void verifyPayment(VerifySubscriptionPaymentRequest request);

    void completePayment(
            String orderId,
            String paymentId);

    void markPaymentFailed(
            String orderId,
            String paymentId,
            String reason);
}