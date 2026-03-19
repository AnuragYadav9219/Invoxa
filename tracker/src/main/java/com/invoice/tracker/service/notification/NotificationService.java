package com.invoice.tracker.service.notification;

import java.util.List;

import com.invoice.tracker.dto.notification.NotificationResponse;
import com.invoice.tracker.entity.invoice.Invoice;

public interface NotificationService {

    void sendInvoiceCreatedNotification(Invoice invoice);

    void sendPartialPaymentNotification(Invoice invoice);

    void sendInvoiceFullyPaidNotification(Invoice invoice);

    void sendDueReminder(Invoice invoice);

    void sendOverdueAlert(Invoice invoice);

    void saveNotification(Invoice invoice, String message, String recipient);

    List<NotificationResponse> getAllNotifications();
}
