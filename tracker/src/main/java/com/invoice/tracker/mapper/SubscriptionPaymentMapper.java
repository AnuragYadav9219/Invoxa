package com.invoice.tracker.mapper;

import org.springframework.stereotype.Component;

import com.invoice.tracker.dto.subscription.SubscriptionPaymentResponse;
import com.invoice.tracker.entity.subscription.SubscriptionPayment;

@Component
public class SubscriptionPaymentMapper {

    public SubscriptionPaymentResponse toResponse(
            SubscriptionPayment payment) {

        return SubscriptionPaymentResponse.builder()
                .id(payment.getId())
                .planName(payment.getPlan().getName())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .gateway(payment.getGateway())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .paidAt(payment.getPaidAt())
                .build();
    }
}