package com.invoice.tracker.controller.notification;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.dto.notification.NotificationResponse;
import com.invoice.tracker.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    
    private final NotificationService notificationService;

    // ================ GET ALL NOTIFICATIONS ===================
    @GetMapping
    public List<NotificationResponse> getNotifications() {
        return notificationService.getAllNotifications();
    }
}
