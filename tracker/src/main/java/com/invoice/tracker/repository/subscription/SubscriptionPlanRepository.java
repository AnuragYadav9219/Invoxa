package com.invoice.tracker.repository.subscription;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.subscription.SubscriptionPlan;

public interface SubscriptionPlanRepository
        extends JpaRepository<SubscriptionPlan, UUID> {

    List<SubscriptionPlan> findByActiveTrue();

    Optional<SubscriptionPlan> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}