package com.invoice.tracker.repository.subscription;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.subscription.SubscriptionPayment;
import com.invoice.tracker.entity.subscription.SubscriptionPaymentStatus;

public interface SubscriptionPaymentRepository
                extends JpaRepository<SubscriptionPayment, UUID> {

        Optional<SubscriptionPayment> findByOrderId(String orderId);

        Optional<SubscriptionPayment> findByPaymentId(String paymentId);

        boolean existsByPaymentId(String paymentId);

        List<SubscriptionPayment> findByShopIdOrderByCreatedAtDesc(UUID shopId);

        List<SubscriptionPayment> findByShopId(UUID shopId);

        List<SubscriptionPayment> findByStatus(
                        SubscriptionPaymentStatus status);
}