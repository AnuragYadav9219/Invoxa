package com.invoice.tracker.dto.gateway;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyPaymentRequest {
    
    private UUID invoiceId;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;
}
