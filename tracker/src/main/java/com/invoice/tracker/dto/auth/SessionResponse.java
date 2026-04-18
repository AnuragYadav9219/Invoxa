package com.invoice.tracker.dto.auth;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SessionResponse {
    private String id;
    private String deviceId;
    private String deviceName;
    private boolean current;
    private LocalDateTime lastActive;
}
