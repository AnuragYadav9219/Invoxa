package com.invoice.tracker.dto.subscription;

import com.invoice.tracker.entity.subscription.PlanType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TemplateResponse {
    
    private String code;
    private String name;
    private String description;
    private PlanType minimumPlan;
    private boolean accessible;
}
