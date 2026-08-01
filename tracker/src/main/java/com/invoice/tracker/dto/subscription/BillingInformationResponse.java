package com.invoice.tracker.dto.subscription;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BillingInformationResponse {
    
    private String paymentProvider;
    private String paymentMethod;

    private String paymentDisplayName;

    private String razorpayCustomerId;
    private String razorpaySubscriptionId;
    private String razorpayPaymentId;

    private boolean autoRenew;
    private boolean freePlan;

    private LocalDate startDate;
    private LocalDate nextBillingDate;

    private String currency;
}
