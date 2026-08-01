package com.invoice.tracker.service.subscription;

import java.util.UUID;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.dto.subscription.CreateSubscriptionCheckoutResponse;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.subscription.PaymentGateway;
import com.invoice.tracker.entity.subscription.SubscriptionPayment;
import com.invoice.tracker.entity.subscription.SubscriptionPaymentStatus;
import com.invoice.tracker.entity.subscription.SubscriptionPlan;
import com.invoice.tracker.repository.shop.ShopRepository;
import com.invoice.tracker.repository.subscription.SubscriptionPaymentRepository;
import com.invoice.tracker.repository.subscription.SubscriptionPlanRepository;
import com.invoice.tracker.service.payment.gateway.RazorpayGatewayService;
import com.razorpay.Order;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionCheckoutServiceImpl
        implements SubscriptionCheckoutService {

    private final ShopRepository shopRepository;
    private final SubscriptionPlanRepository planRepository;
    private final SubscriptionPaymentRepository paymentRepository;
    private final RazorpayGatewayService gatewayService;

    @Override
    public CreateSubscriptionCheckoutResponse createCheckout(
            UUID shopId,
            UUID planId) {

        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found"));

        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));

        if (!plan.getActive()) {
            throw new BadRequestException("Plan is inactive");
        }

        JSONObject notes = new JSONObject();

        notes.put("shopId", shopId.toString());
        notes.put("planId", planId.toString());

        Order order = gatewayService.createOrder(
                plan.getMonthlyPrice(),
                "INR",
                "SUB-" + shopId,
                notes);

        SubscriptionPayment payment = SubscriptionPayment.builder()
                .shop(shop)
                .plan(plan)
                .amount(plan.getMonthlyPrice())
                .currency("INR")
                .gateway(PaymentGateway.RAZORPAY)
                .status(SubscriptionPaymentStatus.CREATED)
                .orderId(order.get("id"))
                .build();

        paymentRepository.save(payment);

        return CreateSubscriptionCheckoutResponse.builder()
                .orderId(order.get("id"))
                .key(gatewayService.getKeyId())
                .amount(plan.getMonthlyPrice())
                .currency("INR")
                .build();
    }
}