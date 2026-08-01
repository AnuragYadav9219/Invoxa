package com.invoice.tracker.repository.subscription;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.subscription.ShopSubscription;
import com.invoice.tracker.entity.subscription.SubscriptionStatus;

public interface ShopSubscriptionRepository
        extends JpaRepository<ShopSubscription, UUID> {

    Optional<ShopSubscription> findByShopId(UUID shopId);

    List<ShopSubscription> findByStatus(SubscriptionStatus status);

    List<ShopSubscription> findByStatusAndEndDateLessThanEqual(
            SubscriptionStatus status,
            LocalDate endDate);
}