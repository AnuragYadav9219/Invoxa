package com.invoice.tracker.service.notification;

import com.invoice.tracker.repository.notification.NotificationRepository;
import com.invoice.tracker.security.SecurityUtils;
import com.invoice.tracker.service.notification.channel.EmailService;
import com.invoice.tracker.service.pdf.PdfService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.dto.notification.NotificationResponse;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.notification.Notification;
import com.invoice.tracker.entity.notification.NotificationStatus;
import com.invoice.tracker.mapper.NotificationMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final PdfService pdfService;
    private final NotificationMapper notificationMapper;

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    // =================== INVOICE CREATED =======================
    @Override
    @Async
    public void sendInvoiceCreatedNotification(Invoice invoice, UUID shopId, String email) {

        if (!invoice.getShopId().equals(shopId)) {
            throw new AccessDeniedException("Unauthorized access");
        }

        if (!isValidRecipient(invoice))
            return;

        String message = buildInvoiceCreatedMessage(invoice);

        byte[] pdf = pdfService.generateInvoicePdf(
            invoice.getId(), 
            invoice.getShopId(),
            invoice.getTemplate()
        );

        boolean sent = sendEmailSafely(() -> {
            emailService.sendInvoiceCreated(email, invoice, pdf);
        }, invoice);

        saveNotification(invoice, message, getRecipient(invoice), "EMAIL", sent);
    }

    // ===================== PARTIAL PAYMENT ======================
    @Override
    @Async
    public void sendPartialPaymentNotification(Invoice invoice, UUID shopId) {

        if (!invoice.getShopId().equals(shopId)) {
            throw new AccessDeniedException("Unauthorized access");
        }

        if (!isValidRecipient(invoice))
            return;

        String message = buildPartialPaymentMessage(invoice);

        boolean sent = sendEmailSafely(() -> emailService.sendPaymentReceived(invoice), invoice);

        saveNotification(invoice, message, getRecipient(invoice), "EMAIL", sent);
    }

    // =========================== FULL PAYMENT ===============================
    @Override
    @Async
    public void sendInvoiceFullyPaidNotification(Invoice invoice, UUID shopId) {

        if (!invoice.getShopId().equals(shopId)) {
            throw new AccessDeniedException("Unauthorized access");
        }

        if (!isValidRecipient(invoice))
            return;

        String message = buildFullPaymentMessage(invoice);

        boolean sent = sendEmailSafely(() -> emailService.sendPaymentReceived(invoice), invoice);

        saveNotification(invoice, message, getRecipient(invoice), "EMAIL", sent);
    }

    // ======================= DUE REMINDER ============================
    @Override
    @Async
    public void sendDueReminder(Invoice invoice, UUID shopId) {

        if (!invoice.getShopId().equals(shopId)) {
            throw new AccessDeniedException("Unauthorized access");
        }

        if (!isValidRecipient(invoice))
            return;

        String message = buildDueReminderMessage(invoice);

        boolean sent = sendEmailSafely(() -> emailService.sendReminder(invoice), invoice);

        saveNotification(invoice, message, getRecipient(invoice), "EMAIL", sent);
    }

    // ======================= OVERDUE ALERT ============================
    @Override
    @Async
    public void sendOverdueAlert(Invoice invoice, UUID shopId) {

        if (!invoice.getShopId().equals(shopId)) {
            throw new AccessDeniedException("Unauthorized access");
        }

        if (!isValidRecipient(invoice))
            return;

        String message = buildOverdueMessage(invoice);

        boolean sent = sendEmailSafely(() -> emailService.sendOverdue(invoice), invoice);

        saveNotification(invoice, message, getRecipient(invoice), "EMAIL", sent);
    }

    // ====================== SAVE NOTIFICATION =========================
    @Override
    public void saveNotification(Invoice invoice, String message, String recipient, String type, boolean sent) {

        NotificationStatus status = sent
                ? NotificationStatus.SENT
                : NotificationStatus.FAILED;

        Notification notification = Notification.builder()
                .invoice(invoice)
                .message(message)
                .recipient(recipient)
                .type(type)
                .sent(sent)
                .status(status)
                .retryCount(sent ? 0 : 1)
                .lastTriedAt(LocalDateTime.now())
                .sentAt(sent ? LocalDateTime.now() : null)
                .build();

        notificationRepository.save(notification);
    }

    // ================== FETCH NOTIFICATIONS LOGICS ==========================

    @Override
    public List<NotificationResponse> getAllNotifications() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return notificationMapper.map(
                notificationRepository.findByInvoice_ShopIdOrderBySentAtDesc(shopId));
    }

    @Override
    public List<NotificationResponse> getFailedNotifications() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return notificationMapper.map(notificationRepository
                .findByStatusAndInvoice_ShopIdOrderBySentAtDesc(NotificationStatus.FAILED, shopId));
    }

    @Override
    public List<NotificationResponse> getRetryingNotifications() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return notificationMapper.map(notificationRepository
                .findByStatusAndInvoice_ShopIdOrderBySentAtDesc(NotificationStatus.RETRYING, shopId));
    }

    @Override
    public List<NotificationResponse> getSentNotifications() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return notificationMapper.map(notificationRepository
                .findByStatusAndInvoice_ShopIdOrderBySentAtDesc(NotificationStatus.SENT, shopId));
    }

    @Override
    public void markAsRead(UUID id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        n.setRead(true);
        notificationRepository.save(n);
    }

    @Override
    @Transactional
    public void markAllAsRead(UUID shopId) {

        List<Notification> list = notificationRepository.findByInvoice_ShopIdAndIsReadFalse(shopId);

        list.forEach(n -> n.setRead(true));
    }

    @Override
    public long getUnreadCount() {
        UUID shopId = SecurityUtils.getCurrentUserShopId();
        return notificationRepository.countByInvoice_ShopIdAndIsReadFalse(shopId);
    }

    @Override
    @Transactional
    public void deleteNotification(UUID id) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        long exists = notificationRepository.countByIdAndInvoice_ShopId(id, shopId);

        if (exists == 0) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notificationRepository.deleteByIdAndInvoice_ShopId(id, shopId);
    }

    @Override
    @Transactional
    public void deleteAllNotifications() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        List<Notification> notifications = notificationRepository.findByInvoice_ShopIdOrderBySentAtDesc(shopId);

        notificationRepository.deleteAll(notifications);
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
        return String.format(
                "Hi %s,%n%n"
                        + "Your invoice %s for ₹%s has been successfully created.%n"
                        + "Due date: %s%n%n"
                        + "Please review and make the payment on or before the due date.%n%n"
                        + "Thank you for your business.",
                getCustomerName(invoice),
                invoice.getInvoiceNumber(),
                formatAmount(invoice.getTotalAmount()),
                invoice.getDueDate());
    }

    private String buildPartialPaymentMessage(Invoice invoice) {
        return String.format(
                "Hi %s,%n%n"
                        + "We’ve received a payment of ₹%s for invoice %s.%n"
                        + "Remaining balance: ₹%s%n%n"
                        + "Please complete the remaining payment at your convenience.%n%n"
                        + "Thank you.",
                getCustomerName(invoice),
                formatAmount(invoice.getPaidAmount()),
                invoice.getInvoiceNumber(),
                formatAmount(invoice.getRemainingAmount()));
    }

    private String buildFullPaymentMessage(Invoice invoice) {
        return String.format(
                "Hi %s,%n%n"
                        + "We’re pleased to inform you that invoice %s has been fully paid.%n%n"
                        + "Thank you for your prompt payment.%n"
                        + "We appreciate your business!",
                getCustomerName(invoice),
                invoice.getInvoiceNumber());
    }

    private String buildDueReminderMessage(Invoice invoice) {
        return String.format(
                "Hi %s,%n%n"
                        + "This is a friendly reminder that invoice %s for ₹%s is due on %s.%n%n"
                        + "We kindly request you to ensure the payment is made by the due date to avoid any delays.%n%n"
                        + "Thank you.",
                getCustomerName(invoice),
                invoice.getInvoiceNumber(),
                formatAmount(invoice.getTotalAmount()),
                invoice.getDueDate());
    }

    private String buildOverdueMessage(Invoice invoice) {
        return String.format(
                "Hi %s,%n%n"
                        + "We would like to inform you that invoice %s is now overdue.%n"
                        + "Outstanding amount: ₹%s%n%n"
                        + "We kindly request you to make the payment at the earliest to avoid further action.%n%n"
                        + "If you’ve already made the payment, please disregard this message.%n%n"
                        + "Thank you.",
                getCustomerName(invoice),
                invoice.getInvoiceNumber(),
                formatAmount(invoice.getRemainingAmount()));
    }

    // ============= HELPERS ===============

    private boolean isValidRecipient(Invoice invoice) {
        return invoice.getCustomerEmail() != null && !invoice.getCustomerEmail().isBlank();
    }

    private String getRecipient(Invoice invoice) {
        return invoice.getCustomerEmail();
    }

    private String formatAmount(BigDecimal amount) {

        if (amount == null) {
            return "0.00";
        }

        return amount.setScale(2, RoundingMode.HALF_UP).toString();
    }

    private String getCustomerName(Invoice invoice) {
        return (invoice.getCustomerName() == null || invoice.getCustomerName().isBlank())
                ? "Customer"
                : invoice.getCustomerName();
    }
}
