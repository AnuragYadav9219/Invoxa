package com.invoice.tracker.controller.notification;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // ================ GET ALL ===================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<NotificationResponse> getNotifications() {
        return notificationService.getAllNotifications();
    }

    // ================ GET FAILED ===================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/failed")
    public ResponseEntity<List<NotificationResponse>> getFailedNotifications() {
        return ResponseEntity.ok(notificationService.getFailedNotifications());
    }

    // ================ GET RETRYING ===================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/retrying")
    public ResponseEntity<List<NotificationResponse>> getRetryingNotifications() {
        return ResponseEntity.ok(notificationService.getRetryingNotifications());
    }

    // ================ GET SENT ===================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/sent")
    public ResponseEntity<List<NotificationResponse>> getSentNotifications() {
        return ResponseEntity.ok(notificationService.getSentNotifications());
    }
}
