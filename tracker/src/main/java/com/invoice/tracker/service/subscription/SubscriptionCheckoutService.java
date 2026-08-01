package com.invoice.tracker.service.subscription;

import java.util.UUID;

import com.invoice.tracker.dto.subscription.CreateSubscriptionCheckoutResponse;

public interface SubscriptionCheckoutService {

    CreateSubscriptionCheckoutResponse createCheckout(
            UUID shopId,
            UUID planId);

}