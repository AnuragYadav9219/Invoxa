package com.invoice.tracker.guard;

import java.util.UUID;

import com.invoice.tracker.entity.subscription.SubscriptionPlan;

public interface SubscriptionGuard {

    void checkInvoiceLimit(UUID shopId);

    void checkCustomerLimit(UUID shopId);

    void checkItemLimit(UUID shopId);

    void checkUserLimit(UUID shopId);

    void checkEmailAccess(UUID shopId);

    void checkApiAccess(UUID shopId);

    void checkAiAccess(UUID shopId);

    SubscriptionPlan getCurrentPlan(UUID shopId);
}
