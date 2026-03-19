package com.invoice.tracker.dto.payment;

import java.math.BigDecimal;
import java.util.UUID;

import com.invoice.tracker.entity.payment.PaymentMethod;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePaymentRequest {
    
    private UUID invoiceId;
    private BigDecimal amount;
    private PaymentMethod method;
    private String referenceNumber;
}
