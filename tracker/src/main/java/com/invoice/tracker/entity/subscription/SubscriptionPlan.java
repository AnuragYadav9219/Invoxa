package com.invoice.tracker.entity.subscription;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subscription_plans")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyPrice;

    @Column(nullable = false)
    private Integer invoiceLimit;

    @Column(nullable = false)
    private Integer customerLimit;

    @Column(nullable = false)
    private Integer itemLimit;

    @Column(nullable = false)
    private Integer userLimit;

    @Column(nullable = false)
    private Boolean emailEnabled;

    @Column(nullable = false)
    private Boolean apiEnabled;

    @Column(nullable = false)
    private Boolean aiEnabled;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private PlanType planType;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;
}