package com.invoice.tracker.service.subscription;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.invoice.tracker.dto.subscription.BillingInformationResponse;
import com.invoice.tracker.dto.subscription.CurrentSubscriptionResponse;
import com.invoice.tracker.dto.subscription.SubscriptionDashboardResponse;
import com.invoice.tracker.dto.subscription.SubscriptionPaymentResponse;
import com.invoice.tracker.dto.subscription.SubscriptionPlanResponse;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.subscription.ShopSubscription;
import com.invoice.tracker.entity.subscription.SubscriptionPlan;

public interface SubscriptionService {

        CurrentSubscriptionResponse getCurrentSubscription(UUID shopId);

        ShopSubscription activateSubscription(
                        UUID shopId,
                        SubscriptionPlan plan,
                        String paymentId);

        ShopSubscription renewSubscription(
                        UUID shopId,
                        String paymentId);

        void expireSubscriptions(LocalDate today);

        void initializeSubscription(Shop shop);

        List<SubscriptionPlanResponse> getAvailablePlans();

        List<SubscriptionPaymentResponse> getPaymentHistory(UUID shopId);

        SubscriptionDashboardResponse getDashboard(UUID shopId);

        BillingInformationResponse getBillingInformation(UUID shopId);
}