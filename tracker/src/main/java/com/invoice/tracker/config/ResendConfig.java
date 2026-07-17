package com.invoice.tracker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class ResendConfig {

    @Bean
    RestClient resendRestClient(
            @Value("${resend.api.key") String apiKey) {

        return RestClient.builder()
                .baseUrl("https://api.resend.com")
                .defaultHeader("Authorization", "Bearer" + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
