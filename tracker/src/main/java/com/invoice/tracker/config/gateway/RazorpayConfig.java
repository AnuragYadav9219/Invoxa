package com.invoice.tracker.config.gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class RazorpayConfig {

    private final RazorpayProperties properties;

    @Bean
    public RazorpayClient razorpayClient() throws RazorpayException {

        return new RazorpayClient(
                properties.getKeyId(),
                properties.getKeySecret());
    }
}
