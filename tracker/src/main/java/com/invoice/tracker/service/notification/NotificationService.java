package com.invoice.tracker.service.notification;

import java.util.List;
import java.util.UUID;

import com.invoice.tracker.dto.notification.NotificationResponse;
import com.invoice.tracker.entity.invoice.Invoice;

public interface NotificationService {

    // ================= EVENT METHODS =================
    void sendInvoiceCreatedNotification(Invoice invoice, UUID shopId);

    void sendPartialPaymentNotification(Invoice invoice, UUID shopId);

    void sendInvoiceFullyPaidNotification(Invoice invoice, UUID shopId);

    void sendDueReminder(Invoice invoice, UUID shopId);

    void sendOverdueAlert(Invoice invoice, UUID shopId);

    // ================= CORE SAVE =================
    void saveNotification(Invoice invoice, String message, String recipient, String type, boolean sent);

    // ================= FETCH METHODS =================
    List<NotificationResponse> getAllNotifications();

    List<NotificationResponse> getFailedNotifications();

    List<NotificationResponse> getRetryingNotifications();

    List<NotificationResponse> getSentNotifications();
}
