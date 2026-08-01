package com.invoice.tracker.service.payment.gateway;

import java.math.BigDecimal;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.config.gateway.RazorpayProperties;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RazorpayGatewayServiceImpl
        implements RazorpayGatewayService {

    private final RazorpayClient razorpayClient;
    private final RazorpayProperties properties;

    @Override
    public Order createOrder(
            BigDecimal amount,
            String currency,
            String receipt,
            JSONObject notes) {

        try {

            JSONObject options = new JSONObject();

            options.put(
                    "amount",
                    amount.multiply(BigDecimal.valueOf(100)).longValue());

            options.put("currency", currency);
            options.put("receipt", receipt);

            if (notes != null) {
                options.put("notes", notes);
            }

            return razorpayClient.orders.create(options);

        } catch (Exception ex) {

            log.error("Failed to create Razorpay order", ex);

            throw new RuntimeException(
                    "Unable to create Razorpay order",
                    ex);
        }
    }

    @Override
    public Payment fetchPayment(String paymentId) {

        try {

            return razorpayClient.payments.fetch(paymentId);

        } catch (Exception ex) {

            log.error("Unable to fetch payment {}", paymentId, ex);

            throw new RuntimeException(
                    "Unable to fetch payment",
                    ex);
        }
    }

    @Override
    public boolean verifyPayment(
            String orderId,
            String paymentId,
            String signature) {

        try {

            JSONObject attributes = new JSONObject();

            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);

            return Utils.verifyPaymentSignature(
                    attributes,
                    properties.getKeySecret());

        } catch (Exception ex) {

            throw new BadRequestException(
                    "Invalid payment signature");
        }
    }

    @Override
    public boolean verifyWebhook(
            String payload,
            String signature) {

        try {

            return Utils.verifyWebhookSignature(
                    payload,
                    signature,
                    properties.getWebhookSecret());

        } catch (Exception ex) {

            throw new BadRequestException(
                    "Invalid webhook signature");
        }
    }

    @Override
    public String getKeyId() {
        return properties.getKeyId();
    }
}