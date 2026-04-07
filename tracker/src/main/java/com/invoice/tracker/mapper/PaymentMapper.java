package com.invoice.tracker.mapper;

import org.springframework.stereotype.Component;

import com.invoice.tracker.dto.payment.PaymentResponse;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.payment.Payment;

@Component
public class PaymentMapper {

        public PaymentResponse toResponse(Payment payment) {

                Invoice invoice = payment.getInvoice();

                return PaymentResponse.builder()
                                .id(payment.getId())
                                .amount(payment.getAmount())
                                .method(payment.getMethod())
                                .referenceNumber(payment.getReferenceNumber())
                                .paymentDate(payment.getCreatedAt())
                                .remainingAmount(
                                                invoice != null ? invoice.getRemainingAmount() : null)
                                .invoiceId(
                                                invoice != null ? invoice.getId() : null)
                                .invoiceNumber(
                                                invoice != null ? invoice.getInvoiceNumber() : null)
                                .customerName(
                                                invoice != null ? invoice.getCustomerName() : "Unknown")
                                .build();
        }
}
