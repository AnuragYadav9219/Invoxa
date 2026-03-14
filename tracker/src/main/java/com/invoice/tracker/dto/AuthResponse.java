package com.invoice.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String message;
    
    private String accessToken;

    private String refreshToken;
}
