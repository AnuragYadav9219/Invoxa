package com.invoice.tracker.dto.notification;

import java.time.LocalDateTime;
import java.util.UUID;

import com.invoice.tracker.entity.notification.NotificationStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotificationResponse {
    
     private UUID id;
    private String message;
    private String type;
    private NotificationStatus status;
    private boolean sent;
    private String recipient; 
    private String invoiceNumber; 
    private LocalDateTime sentAt;

}
