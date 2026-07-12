package com.invoice.tracker.controller.payment;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.gateway.CreateOrderRequest;
import com.invoice.tracker.dto.gateway.CreateOrderResponse;
import com.invoice.tracker.dto.gateway.VerifyPaymentRequest;
import com.invoice.tracker.service.payment.gateway.RazorpayService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentGatewayController {

    private final RazorpayService razorpayService;

    @PostMapping("/order")
    public ResponseEntity<ApiResponse<CreateOrderResponse>> createOrder(
            @RequestBody CreateOrderRequest request) throws Exception {

        CreateOrderResponse response = razorpayService.createOrder(request.getInvoiceId());

        return ResponseBuilder.success(
                response,
                "Order created successfully");
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyPayment(
            @RequestBody VerifyPaymentRequest request) {

        razorpayService.verifyPayment(request);

        return ResponseBuilder.success(
                null,
                "Payment verified successfully");
    }
}
