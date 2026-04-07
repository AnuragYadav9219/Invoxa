package com.invoice.tracker.dto.payment;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.invoice.tracker.entity.payment.PaymentMethod;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentFilterRequest {
    
    private String search;

    private PaymentMethod method;

    private LocalDate fromDate;
    private LocalDate toDate;

    private BigDecimal minAmount;
    private BigDecimal maxAmount;

    private String sort;
}
