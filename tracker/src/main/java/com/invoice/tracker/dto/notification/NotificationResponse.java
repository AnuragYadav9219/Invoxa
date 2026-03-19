package com.invoice.tracker.dto.notification;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotificationResponse {
    
    private UUID id;
    private String message;
    private String type;
    private boolean sent;
    private LocalDateTime sentAt;
}
