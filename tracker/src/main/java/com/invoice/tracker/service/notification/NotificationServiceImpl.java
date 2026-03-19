package com.invoice.tracker.service.notification;

import com.invoice.tracker.repository.notification.NotificationRepository;
import com.invoice.tracker.security.SecurityUtils;
import com.invoice.tracker.service.notification.channel.EmailService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final EmailService emailService;

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    // =================== INVOICE CREATED =======================
    @Override
    @Async
    public void sendInvoiceCreatedNotification(Invoice invoice) {

        if (!isValidRecipient(invoice))
            return;

        String message = buildInvoiceCreatedMessage(invoice);

        boolean sent = sendEmailSafely(() -> emailService.sendInvoiceCreated(invoice), invoice);

        saveNotification(invoice, message, getRecipient(invoice), "EMAIL", sent);
    }

    // ===================== PARTIAL PAYMENT ======================
    @Override
    @Async
    public void sendPartialPaymentNotification(Invoice invoice) {

        if (!isValidRecipient(invoice))
            return;

        String message = buildPartialPaymentMessage(invoice);

        boolean sent = sendEmailSafely(() -> emailService.sendPaymentReceived(invoice), invoice);

        saveNotification(invoice, message, getRecipient(invoice), "EMAIL", sent);
    }

    // =========================== FULL PAYMENT ===============================
    @Override
    @Async
    public void sendInvoiceFullyPaidNotification(Invoice invoice) {

        if (!isValidRecipient(invoice))
            return;

        String message = buildFullPaymentMessage(invoice);

        boolean sent = sendEmailSafely(() -> emailService.sendPaymentReceived(invoice), invoice);

        saveNotification(invoice, message, getRecipient(invoice), "EMAIL", sent);
    }

    // ======================= DUE REMINDER ============================
    @Override
    @Async
    public void sendDueReminder(Invoice invoice) {

        if (!isValidRecipient(invoice))
            return;

        String message = buildDueReminderMessage(invoice);

        boolean sent = sendEmailSafely(() -> emailService.sendReminder(invoice), invoice);

        saveNotification(invoice, message, getRecipient(invoice), "EMAIL", sent);
    }

    // ======================= OVERDUE ALERT ============================
    @Override
    @Async
    public void sendOverdueAlert(Invoice invoice) {

        if (!isValidRecipient(invoice))
            return;

        String message = buildOverdueMessage(invoice);

        boolean sent = sendEmailSafely(() -> emailService.sendOverdue(invoice), invoice);

        saveNotification(invoice, message, getRecipient(invoice), "EMAIL", sent);
    }

    // ====================== SAVE NOTIFICATION =========================
    @Override
    public void saveNotification(Invoice invoice, String message, String recipient, String type, boolean sent) {

        Notification notification = Notification.builder()
                .invoice(invoice)
                .message(message)
                .recipient(recipient)
                .type(type)
                .sent(sent) 
                .retryCount(sent ? 0 : 1)
                .lastTriedAt(LocalDateTime.now())
                .sentAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    // ================== ALL NOTIFICATIONS ==========================
    @Override
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

    // ================== COMMON EMAIL HANDLER ==========================

    private boolean sendEmailSafely(Runnable emailAction, Invoice invoice) {
        try {
            emailAction.run();
            return true;
        } catch (Exception e) {
            log.error("Email failed for invoice {}", invoice.getInvoiceNumber(), e);
            return false;
        }
    }

    // ================== MESSAGE BUILDERS ==========================

    private String buildInvoiceCreatedMessage(Invoice invoice) {
        return "Hi " + getCustomerName(invoice) + ",\n"
                + "Your invoice " + invoice.getInvoiceNumber()
                + " of ₹" + formatAmount(invoice.getTotalAmount())
                + " has been created.\n"
                + "Due date: " + invoice.getDueDate() + ".";
    }

    private String buildPartialPaymentMessage(Invoice invoice) {
        return "Hi " + getCustomerName(invoice) + ",\n"
                + "We received ₹" + formatAmount(invoice.getPaidAmount())
                + " for invoice " + invoice.getInvoiceNumber() + ".\n"
                + "Remaining amount: ₹" + formatAmount(invoice.getRemainingAmount()) + ".";
    }

    private String buildFullPaymentMessage(Invoice invoice) {
        return "Hi " + getCustomerName(invoice) + ",\n"
                + "Invoice " + invoice.getInvoiceNumber()
                + " has been fully paid.\n"
                + "Thank you for your payment!";
    }

    private String buildDueReminderMessage(Invoice invoice) {
        return "Hi " + getCustomerName(invoice) + ",\n"
                + "Reminder: Invoice " + invoice.getInvoiceNumber()
                + " of ₹" + formatAmount(invoice.getTotalAmount())
                + " is due on " + invoice.getDueDate() + ".\n"
                + "Please ensure timely payment.";
    }

    private String buildOverdueMessage(Invoice invoice) {
        return "Hi " + getCustomerName(invoice) + ",\n"
                + "Invoice " + invoice.getInvoiceNumber()
                + " is overdue.\n"
                + "Outstanding amount: ₹" + formatAmount(invoice.getRemainingAmount()) + ".\n"
                + "Kindly make the payment as soon as possible.";
    }

    // ============= HELPERS ===============

    private boolean isValidRecipient(Invoice invoice) {
        return invoice.getCustomerEmail() != null && !invoice.getCustomerEmail().isBlank();
    }

    private String getRecipient(Invoice invoice) {
        return invoice.getCustomerEmail();
    }

    private String formatAmount(BigDecimal amount) {
        return amount.setScale(2, RoundingMode.HALF_UP).toString();
    }

    private String getCustomerName(Invoice invoice) {
        return (invoice.getCustomerName() == null || invoice.getCustomerName().isBlank())
                ? "Customer"
                : invoice.getCustomerName();
    }
}
