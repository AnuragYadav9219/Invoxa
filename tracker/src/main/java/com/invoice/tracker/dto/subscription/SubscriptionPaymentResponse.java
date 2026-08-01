package com.invoice.tracker.dto.subscription;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.invoice.tracker.entity.subscription.PaymentGateway;
import com.invoice.tracker.entity.subscription.SubscriptionPaymentStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SubscriptionPaymentResponse {

    private UUID id;

    private String planName;

    private BigDecimal amount;

    private String currency;

    private PaymentGateway gateway;

    private SubscriptionPaymentStatus status;

    private String transactionId;

    private LocalDateTime paidAt;
}