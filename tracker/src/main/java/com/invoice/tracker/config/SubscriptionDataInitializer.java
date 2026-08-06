package com.invoice.tracker.config;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.invoice.tracker.entity.subscription.PlanType;
import com.invoice.tracker.entity.subscription.SubscriptionPlan;
import com.invoice.tracker.repository.subscription.SubscriptionPlanRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubscriptionDataInitializer implements CommandLineRunner {

    private final SubscriptionPlanRepository repository;

    @Override
    public void run(String... args) {

        if (repository.count() > 0)
            return;

        repository.save(
                SubscriptionPlan.builder()
                        .name("FREE")
                        .planType(PlanType.FREE)
                        .description("Perfect for individuals and small businesses getting started with Invoxa.")
                        .monthlyPrice(BigDecimal.ZERO)
                        .invoiceLimit(20)
                        .customerLimit(30)
                        .itemLimit(30)
                        .userLimit(1)
                        .emailEnabled(false)
                        .apiEnabled(false)
                        .aiEnabled(false)
                        .active(true)
                        .build());

        repository.save(
                SubscriptionPlan.builder()
                        .name("PRO")
                        .planType(PlanType.PRO)
                        .description("Ideal for growing businesses with advanced automation, API access, AI features, and custom invoice templates.")
                        .monthlyPrice(new BigDecimal("199"))
                        .invoiceLimit(300)
                        .customerLimit(500)
                        .itemLimit(1000)
                        .userLimit(5)
                        .emailEnabled(true)
                        .apiEnabled(false)
                        .aiEnabled(true)
                        .active(true)
                        .build());

        repository.save(
                SubscriptionPlan.builder()
                        .name("BUSINESS")
                        .planType(PlanType.BUSINESS)
                        .description("Designed for large teams with higher limits, collaboration features, and premium business capabilities.")
                        .monthlyPrice(new BigDecimal("499"))
                        .invoiceLimit(1000)
                        .customerLimit(5000)
                        .itemLimit(3000)
                        .userLimit(20)
                        .emailEnabled(true)
                        .apiEnabled(true)
                        .aiEnabled(true)
                        .active(true)
                        .build());
    }
}