package com.invoice.tracker.controller.notification;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.notification.NotificationResponse;
import com.invoice.tracker.security.SecurityUtils;
import com.invoice.tracker.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // ================ GET ALL ===================
    @PreAuthorize("hasRole('OWNER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications() {
        return ResponseBuilder.success(
                notificationService.getAllNotifications(),
                "Notifications fetched successfully");
    }

    // ================ GET FAILED ===================
    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/failed")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getFailedNotifications() {
        return ResponseBuilder.success(
                notificationService.getFailedNotifications(),
                "Failed notifications fetched");
    }

    // ================ GET RETRYING ===================
    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/retrying")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getRetryingNotifications() {
        return ResponseBuilder.success(
                notificationService.getRetryingNotifications(),
                "Retrying notifications fetched");
    }

    // ================ GET SENT ===================
    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/sent")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getSentNotifications() {
        return ResponseBuilder.success(
                notificationService.getSentNotifications(),
                "Sent notifications fetched");
    }

    // ================ MARK AS READ =================
    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseBuilder.success(null, "Marked as read");
    }

    // ================ MARK ALL AS READ =================
    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        notificationService.markAllAsRead(SecurityUtils.getCurrentUserShopId());
        return ResponseBuilder.success(null, "All marked as read");
    }

    // ================ GET UNREAD COUNT =================
    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        return ResponseBuilder.success(notificationService.getUnreadCount(), "Unread count");
    }

    // ================ DELETE SINGLE ================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable UUID id) {

        notificationService.deleteNotification(id);

        return ResponseBuilder.success(null, "Notification deleted successfully");
    }

    // ================ DELETE ALL ================
    @DeleteMapping("/delete-all")
    public ResponseEntity<ApiResponse<Void>> deleteAllNotification() {

        notificationService.deleteAllNotifications();

        return ResponseBuilder.success(null, "All notifications deleted successfully");
    }
}