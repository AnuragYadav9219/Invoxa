package com.invoice.tracker.service.payment.gateway;

import java.util.UUID;

import com.invoice.tracker.dto.gateway.CreateOrderResponse;
import com.invoice.tracker.dto.gateway.VerifyPaymentRequest;

public interface RazorpayService {
    
    CreateOrderResponse createOrder(UUID invoiceId) throws Exception;

    void verifyPayment(VerifyPaymentRequest request);
}
