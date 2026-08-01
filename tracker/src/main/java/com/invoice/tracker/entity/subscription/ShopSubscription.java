package com.invoice.tracker.entity.subscription;

import java.time.LocalDate;
import java.util.UUID;

import com.invoice.tracker.entity.auth.Shop;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_subscriptions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shop_id", nullable = false, unique = true)
    private Shop shop;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan plan;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    @Builder.Default
    @Column(nullable = false)
    private Boolean autoRenew = false;

    private String razorpayCustomerId;

    private String razorpaySubscriptionId;

    private String razorpayPaymentId;
}