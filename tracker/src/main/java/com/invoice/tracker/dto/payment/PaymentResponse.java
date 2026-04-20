package com.invoice.tracker.dto.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.invoice.tracker.entity.payment.PaymentMethod;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentResponse {

    private UUID id;

    private String paymentNumber;

    private BigDecimal amount;
    private PaymentMethod method;

    private String referenceNumber;
    private BigDecimal remainingAmount;
    private LocalDateTime paymentDate;

    private UUID invoiceId;
    private String invoiceNumber;
    private String customerName;
}