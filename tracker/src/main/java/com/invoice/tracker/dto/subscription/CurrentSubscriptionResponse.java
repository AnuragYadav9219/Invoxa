package com.invoice.tracker.dto.subscription;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.invoice.tracker.entity.subscription.SubscriptionStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CurrentSubscriptionResponse {

    private UUID planId;

    private String planName;

    private BigDecimal monthlyPrice;

    private LocalDate startDate;

    private LocalDate endDate;

    private SubscriptionStatus status;

    private Boolean autoRenew;

    private long daysRemaining;

    private Integer invoiceLimit;

    private Integer customerLimit;

    private Integer itemLimit;

    private Integer userLimit;
}