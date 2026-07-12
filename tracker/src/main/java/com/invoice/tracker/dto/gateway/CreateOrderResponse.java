package com.invoice.tracker.dto.gateway;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateOrderResponse {
    
    private String orderId;

    private String key;

    private BigDecimal amount;

    private String currency;

    private Long amountInPaise;
}
