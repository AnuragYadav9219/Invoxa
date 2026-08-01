package com.invoice.tracker.guard;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.invoice.tracker.common.exception.SubscriptionLimitExceededException;
import com.invoice.tracker.entity.subscription.ShopSubscription;
import com.invoice.tracker.entity.subscription.SubscriptionPlan;
import com.invoice.tracker.entity.subscription.SubscriptionStatus;
import com.invoice.tracker.repository.auth.UserRepository;
import com.invoice.tracker.repository.invoice.InvoiceRepository;
import com.invoice.tracker.repository.item.ItemRepository;
import com.invoice.tracker.repository.subscription.ShopSubscriptionRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubscriptionGuardImpl implements SubscriptionGuard {

    private final ShopSubscriptionRepository subscriptionRepository;
    private final InvoiceRepository invoiceRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @Override
    public SubscriptionPlan getCurrentPlan(UUID shopId) {

        ShopSubscription subscription = subscriptionRepository
                .findByShopId(shopId)
                .orElseThrow(() -> new SubscriptionLimitExceededException("No active subscription found."));

        if (subscription.getStatus() != SubscriptionStatus.ACTIVE) {
            throw new SubscriptionLimitExceededException("Subscription is not active.");
        }

        return subscription.getPlan();
    }

    @Override
    public void checkInvoiceLimit(UUID shopId) {

        SubscriptionPlan plan = getCurrentPlan(shopId);

        long count = invoiceRepository.countByShopIdAndDeletedFalse(shopId);

        if (count >= plan.getInvoiceLimit()) {
            throw new SubscriptionLimitExceededException(
                    "Invoice limit reached for your current plan.");
        }
    }

    @Override
    public void checkCustomerLimit(UUID shopId) {

        SubscriptionPlan plan = getCurrentPlan(shopId);

        long count = invoiceRepository.countDistinctCustomersByPhone(shopId);

        if (count >= plan.getCustomerLimit()) {
            throw new SubscriptionLimitExceededException(
                    "Customer limit reached for your current plan.");
        }
    }

    @Override
    public void checkItemLimit(UUID shopId) {

        SubscriptionPlan plan = getCurrentPlan(shopId);

        long count = itemRepository.countByShopIdAndDeletedFalse(shopId);

        if (count >= plan.getItemLimit()) {
            throw new SubscriptionLimitExceededException(
                    "Item limit reached for your current plan.");
        }
    }

    @Override
    public void checkUserLimit(UUID shopId) {

        SubscriptionPlan plan = getCurrentPlan(shopId);

        long count = userRepository.countByShopIdAndDeletedFalse(shopId);

        if (count >= plan.getUserLimit()) {
            throw new SubscriptionLimitExceededException(
                    "User limit reached for your current plan.");
        }
    }

    @Override
    public void checkEmailAccess(UUID shopId) {

        if (!getCurrentPlan(shopId).getEmailEnabled()) {
            throw new SubscriptionLimitExceededException(
                    "Email feature is not available in your current plan.");
        }
    }

    @Override
    public void checkApiAccess(UUID shopId) {

        if (!getCurrentPlan(shopId).getApiEnabled()) {
            throw new SubscriptionLimitExceededException(
                    "API access is not available in your current plan.");
        }
    }

    @Override
    public void checkAiAccess(UUID shopId) {

        if (!getCurrentPlan(shopId).getAiEnabled()) {
            throw new SubscriptionLimitExceededException(
                    "AI feature is not available in your current plan.");
        }
    }
}