package com.invoice.tracker.dto.subscription;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.invoice.tracker.entity.subscription.SubscriptionStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SubscriptionDashboardResponse {

    // Plan
    private String planName;
    private BigDecimal monthlyPrice;

    // Subscription
    private SubscriptionStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private long daysRemaining;
    private boolean autoRenew;

    // Limits
    private Integer invoiceLimit;
    private Integer customerLimit;
    private Integer itemLimit;
    private Integer userLimit;

    // Usage
    private long invoiceUsage;
    private long customerUsage;
    private long itemUsage;
    private long userUsage;

    // Features
    private boolean emailEnabled;
    private boolean apiEnabled;
    private boolean aiEnabled;
    private List<TemplateResponse> templates;
}