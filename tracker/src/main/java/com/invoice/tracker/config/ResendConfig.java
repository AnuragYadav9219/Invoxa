package com.invoice.tracker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClient;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class ResendConfig {

    @Bean
    public RestClient resendRestClient(
            @Value("${resend.api.key}") String apiKey) {

        log.info("API Key starts with: {}", apiKey.substring(0, 5));
        log.info("API Key length: {}", apiKey.length());

        return RestClient.builder()
                .baseUrl("https://api.resend.com")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                .build();
    }
}