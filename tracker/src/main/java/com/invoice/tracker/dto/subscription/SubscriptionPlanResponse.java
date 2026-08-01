package com.invoice.tracker.dto.subscription;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SubscriptionPlanResponse {

    private UUID id;

    private String name;

    private String description;

    private BigDecimal monthlyPrice;

    private Integer invoiceLimit;

    private Integer customerLimit;

    private Integer itemLimit;

    private Integer userLimit;

    private Boolean emailEnabled;

    private Boolean apiEnabled;

    private Boolean aiEnabled;
}