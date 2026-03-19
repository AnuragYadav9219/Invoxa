package com.invoice.tracker.mapper;

import org.springframework.stereotype.Component;

import com.invoice.tracker.dto.payment.PaymentResponse;
import com.invoice.tracker.entity.payment.Payment;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .referenceNumber(payment.getReferenceNumber())
                .paymentDate(payment.getCreatedAt())
                .build();
    }
}
