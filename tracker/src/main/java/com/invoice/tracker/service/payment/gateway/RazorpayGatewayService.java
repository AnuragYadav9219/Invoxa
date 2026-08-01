package com.invoice.tracker.service.payment.gateway;

import java.math.BigDecimal;

import org.json.JSONObject;

import com.razorpay.Order;
import com.razorpay.Payment;

public interface RazorpayGatewayService {

        Order createOrder(
                        BigDecimal amount,
                        String currency,
                        String receipt,
                        JSONObject notes);

        Payment fetchPayment(String paymentId);

        boolean verifyPayment(
                        String orderId,
                        String paymentId,
                        String signature);

        boolean verifyWebhook(
                        String payload,
                        String signature);

        String getKeyId();
}