package com.invoice.tracker.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.invoice.tracker.dto.notification.NotificationResponse;
import com.invoice.tracker.entity.notification.Notification;

@Component
public class NotificationMapper {

    public List<NotificationResponse> map(List<Notification> notifications) {
        return notifications.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public NotificationResponse mapToResponse(Notification notification) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .status(notification.getStatus())
                .sent(notification.isSent())
                .recipient(notification.getRecipient())
                .invoiceNumber(notification.getInvoice().getInvoiceNumber()) 
                .sentAt(notification.getSentAt())
                .build();
    }
}
