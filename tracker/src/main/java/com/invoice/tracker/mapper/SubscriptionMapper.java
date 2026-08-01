package com.invoice.tracker.mapper;

import org.springframework.stereotype.Component;

import com.invoice.tracker.dto.subscription.SubscriptionPlanResponse;
import com.invoice.tracker.entity.subscription.SubscriptionPlan;

@Component
public class SubscriptionMapper {

    public SubscriptionPlanResponse toResponse(SubscriptionPlan plan) {

        return SubscriptionPlanResponse.builder()
                .id(plan.getId())
                .description(plan.getDescription())
                .name(plan.getName())
                .monthlyPrice(plan.getMonthlyPrice())

                .invoiceLimit(plan.getInvoiceLimit())
                .customerLimit(plan.getCustomerLimit())
                .itemLimit(plan.getItemLimit())
                .userLimit(plan.getUserLimit())
                
                .emailEnabled(plan.getEmailEnabled())
                .apiEnabled(plan.getApiEnabled())
                .aiEnabled(plan.getAiEnabled())
                .build();
    }

}