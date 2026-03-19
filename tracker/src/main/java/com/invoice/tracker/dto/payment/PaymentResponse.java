package com.invoice.tracker.dto.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.invoice.tracker.entity.payment.PaymentMethod;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentResponse {
    
    private BigDecimal amount;
    private PaymentMethod method;
    private String referenceNumber;
    private LocalDateTime paymentDate;
}
