package com.invoice.tracker.dto.subscription;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateSubscriptionCheckoutResponse {

    private String orderId;

    private String key;

    private BigDecimal amount;

    private String currency;
}