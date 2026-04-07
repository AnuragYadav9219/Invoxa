package com.invoice.tracker.helper.payment;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.entity.payment.Payment;
import com.invoice.tracker.repository.payment.PaymentRepository;
import com.invoice.tracker.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PaymentHelper {

    private final PaymentRepository paymentRepository;

    // =================== GET ACTIVE PAYMENT ====================
    public Payment getPaymentOrThrow(UUID paymentId) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return paymentRepository
                .findByIdAndInvoiceShopIdAndDeletedFalse(paymentId, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }

    // ================= GET ANY PAYMENT ================= 
    public Payment getAnyPaymentOrThrow(UUID paymentId) {

        Payment payment = paymentRepository
                .findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        if (!payment.getInvoice().getShopId().equals(shopId)) {
            throw new ResourceNotFoundException("Payment not found");
        }

        return payment;
    }

}
