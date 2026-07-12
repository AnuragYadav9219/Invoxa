package com.invoice.tracker.config.gateway;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "razorpay")
@Getter
@Setter
public class RazorpayProperties {
    
    private String keyId;

    private String keySecret;

    private String webhookSecret;
}
