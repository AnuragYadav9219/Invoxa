package com.invoice.tracker.service.notification;

import com.invoice.tracker.repository.notification.NotificationRepository;
import com.invoice.tracker.security.SecurityUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.invoice.tracker.dto.notification.NotificationResponse;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.notification.Notification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;

    // =================== INVOICE CREATED =======================
    @Override
    @Async
    public void sendInvoiceCreatedNotification(Invoice invoice) {

        if (invoice.getCustomerPhone() == null || invoice.getCustomerPhone().isBlank()) {
            return;
        }

        String message = "Hi " + getCustomerName(invoice) + ",\n"
                + "Your invoice " + invoice.getInvoiceNumber()
                + " of ₹" + formatAmount(invoice.getTotalAmount())
                + " has been created.\n"
                + "Due date: " + invoice.getDueDate() + ".";

        saveNotification(invoice, message, invoice.getCustomerPhone());
    }

    // ===================== PARTIAL PAYMENT ======================
    @Override
    public void sendPartialPaymentNotification(Invoice invoice) {

        if (invoice.getCustomerPhone() == null || invoice.getCustomerPhone().isBlank()) {
            return;
        }

        String message = "Hi " + getCustomerName(invoice) + ",\n"
                + "We received ₹" + formatAmount(invoice.getPaidAmount())
                + " for invoice " + invoice.getInvoiceNumber() + ".\n"
                + "Remaining amount: ₹" + formatAmount(invoice.getRemainingAmount()) + ".";

        saveNotification(invoice, message, invoice.getCustomerPhone());
    }

    // =========================== FULL PAYMENT ===============================
    @Override
    public void sendInvoiceFullyPaidNotification(Invoice invoice) {

        if (invoice.getCustomerPhone() == null || invoice.getCustomerPhone().isBlank()) {
            return;
        }

        String message = "Hi " + getCustomerName(invoice) + ",\n"
                + "Invoice " + invoice.getInvoiceNumber()
                + " has been fully paid ✅\n"
                + "Thank you for your payment!";

        saveNotification(invoice, message, invoice.getCustomerPhone());
    }

    // ======================= DUE REMINDER ============================
    @Override
    public void sendDueReminder(Invoice invoice) {

        if (invoice.getCustomerPhone() == null || invoice.getCustomerPhone().isBlank()) {
            return;
        }

        String message = "Hi " + getCustomerName(invoice) + ",\n"
                + "Reminder: Invoice " + invoice.getInvoiceNumber()
                + " of ₹" + formatAmount(invoice.getTotalAmount())
                + " is due on " + invoice.getDueDate() + ".\n"
                + "Please ensure timely payment.";

        saveNotification(invoice, message, invoice.getCustomerPhone());
    }

    // ======================= OVERDUE ALERT ============================
    @Override
    public void sendOverdueAlert(Invoice invoice) {

        if (invoice.getCustomerPhone() == null || invoice.getCustomerPhone().isBlank()) {
            return;
        }

        String message = "Hi " + getCustomerName(invoice) + ",\n"
                + "Invoice " + invoice.getInvoiceNumber()
                + " is overdue \n"
                + "Outstanding amount: ₹" + formatAmount(invoice.getRemainingAmount()) + ".\n"
                + "Kindly make the payment as soon as possible.";

        saveNotification(invoice, message, invoice.getCustomerPhone());
    }

    // ====================== SAVE NOTIFICATION =========================
    @Override
    public void saveNotification(Invoice invoice, String message, String recipient) {

        Notification notification = Notification.builder()
                .invoice(invoice)
                .message(message)
                .recipient(recipient)
                .type("SMS")
                .sent(true) // later integrate
                .sentAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    // ================== ALL NOTIFICATIONS ==========================
    public List<NotificationResponse> getAllNotifications() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return notificationRepository.findByInvoice_ShopIdOrderBySentAtDesc(shopId)
                .stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .message(n.getMessage())
                        .type(n.getType())
                        .sent(n.isSent())
                        .sentAt(n.getSentAt())
                        .build())
                .toList();
    }

    // ============= USEFUL METHOD ===============
    private String formatAmount(BigDecimal amount) {
        return amount.setScale(2, RoundingMode.HALF_UP).toString();
    }

    private String getCustomerName(Invoice invoice) {
        return (invoice.getCustomerName() == null || invoice.getCustomerName().isBlank())
                ? "Customer"
                : invoice.getCustomerName();
    }
}
