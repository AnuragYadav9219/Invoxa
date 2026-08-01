package com.invoice.tracker.controller.subscription;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.subscription.BillingInformationResponse;
import com.invoice.tracker.dto.subscription.CreateSubscriptionCheckoutRequest;
import com.invoice.tracker.dto.subscription.CreateSubscriptionCheckoutResponse;
import com.invoice.tracker.dto.subscription.CurrentSubscriptionResponse;
import com.invoice.tracker.dto.subscription.SubscriptionDashboardResponse;
import com.invoice.tracker.dto.subscription.SubscriptionPaymentResponse;
import com.invoice.tracker.dto.subscription.SubscriptionPlanResponse;
import com.invoice.tracker.dto.subscription.VerifySubscriptionPaymentRequest;
import com.invoice.tracker.service.subscription.SubscriptionCheckoutService;
import com.invoice.tracker.service.subscription.SubscriptionPaymentService;
import com.invoice.tracker.service.subscription.SubscriptionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@Validated
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final SubscriptionCheckoutService checkoutService;
    private final SubscriptionPaymentService paymentService;

    @GetMapping("/plans")
    public List<SubscriptionPlanResponse> getPlans() {
        return subscriptionService.getAvailablePlans();
    }

    @GetMapping("/current")
    public CurrentSubscriptionResponse getCurrentSubscription(
            @RequestHeader("X-Shop-Id") UUID shopId) {

        return subscriptionService.getCurrentSubscription(shopId);
    }

    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    public CreateSubscriptionCheckoutResponse createCheckout(
            @RequestHeader("X-Shop-Id") UUID shopId,
            @Valid @RequestBody CreateSubscriptionCheckoutRequest request) {

        return checkoutService.createCheckout(
                shopId,
                request.getPlanId());
    }

    @PostMapping("/verify")
    @ResponseStatus(HttpStatus.OK)
    public void verifyPayment(
            @Valid @RequestBody VerifySubscriptionPaymentRequest request) {

        paymentService.verifyPayment(request);
    }

    @GetMapping("/payments")
    public List<SubscriptionPaymentResponse> getPaymentHistory(
            @RequestHeader("X-Shop-Id") UUID shopId) {

        return subscriptionService.getPaymentHistory(shopId);
    }

    @GetMapping("/dashboard")
    public SubscriptionDashboardResponse dashboard(
            @RequestHeader("X-Shop-Id") UUID shopId) {

        return subscriptionService.getDashboard(shopId);
    }

    @GetMapping("/billing")
    public ResponseEntity<ApiResponse<BillingInformationResponse>> getBillingInformation(
            @RequestHeader("X-Shop-Id") UUID shopId) {

        BillingInformationResponse response = subscriptionService.getBillingInformation(shopId);

        return ResponseBuilder.success(
                response,
                "Billing information fetched successfully");
    }
}