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

        System.out.println("==================================");
        System.out.println("KEY ID     : " + properties.getKeyId());
        System.out.println("KEY SECRET : " + properties.getKeySecret());
        System.out.println("==================================");

        return new RazorpayClient(
                properties.getKeyId(),
                properties.getKeySecret());
    }
}
