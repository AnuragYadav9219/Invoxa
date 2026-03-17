package com.invoice.tracker.dto.auth;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {
    
    private UUID id;
    private String email;
    private String role;
    private UUID shopId;
}
