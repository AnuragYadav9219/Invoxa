package com.invoice.tracker.entity.subscription;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.invoice.tracker.entity.auth.Shop;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subscription_payments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan plan;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentGateway gateway;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionPaymentStatus status;

    @Column(nullable = false, unique = true)
    private String orderId;

    @Column(unique = true)
    private String paymentId;

    private String signature;

    private String transactionId;

    private String failureReason;

    private LocalDateTime paidAt;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}