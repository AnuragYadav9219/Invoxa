package com.invoice.tracker.service.notification.channel;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.entity.feedback.Feedback;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.support.SupportTicket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${resend.from}")
    private String from;

    @Value("${support.admin.email}")
    private String supportAdminEmail;

    private final RestClient resendRestClient;
    private final TemplateEngine templateEngine;

    // ================= CORE EMAIL METHOD =================
    private void sendEmail(
            String to,
            String subject,
            String content,
            boolean isHtml,
            byte[] attachment,
            String fileName) {

        try {

            Map<String, Object> body = new HashMap<>();

            body.put("from", from);
            body.put("to", List.of(to));
            body.put("subject", subject);

            if (isHtml) {
                body.put("html", content);
            } else {
                body.put("text", content);
            }

            if (attachment != null) {

                Map<String, Object> file = new HashMap<>();

                file.put("filename", fileName);

                file.put(
                        "content",
                        Base64.getEncoder().encodeToString(attachment));

                body.put("attachments", List.of(file));
            }

            resendRestClient.post()
                    .uri("/emails")
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Email sent to {}", to);

        } catch (Exception e) {

            log.error("Email sending failed", e);

            throw new RuntimeException(e);
        }
    }

    // ====================== PUBLIC METHODS ========================

    public void sendText(String to, String subject, String body) {
        sendEmail(to, subject, body, false, null, null);
    }

    public void sendHtml(String to, String subject, String html) {
        sendEmail(to, subject, html, true, null, null);
    }

    public void sendHtmlWithAttachment(String to, String subject, String html, byte[] pdf, String fileName) {
        sendEmail(to, subject, html, true, pdf, fileName);
    }

    // ======================== TEMPLATE METHODS ========================

    public void sendOtpEmail(String email, String otp) {

        log.info("Sending OTP email to {}", email);

        Context context = new Context();
        context.setVariable("otp", otp);

        String html = templateEngine.process("email/otp-email", context);

        sendHtml(email, "Verify your email address", html);
    }

    public void sendInvoiceCreated(String email, Invoice invoice, byte[] pdf) {

        if (email == null || email.isBlank()) {
            throw new BadRequestException("Recipient email is required");
        }

        Context context = new Context();
        context.setVariable("invoice", invoice);

        String payLink = buildPayLink(invoice);

        log.info("Pay Link: {}", payLink);

        context.setVariable("payLink", payLink);

        String html = templateEngine.process("email/invoice-email", context);

        sendHtmlWithAttachment(
                email,
                "Invoice " + invoice.getInvoiceNumber() + " is ready",
                html,
                pdf,
                "invoice-" + invoice.getInvoiceNumber() + ".pdf");
    }

    public void sendPaymentReceived(Invoice invoice) {
        sendText(
                invoice.getCustomerEmail(),
                "Payment received for Invoice " + invoice.getInvoiceNumber(),
                "Hello,\n\n" +
                        "We have successfully received your payment for invoice " + invoice.getInvoiceNumber() + ".\n\n"
                        +
                        "Thank you for your business!\n\n" +
                        "If you have any questions, feel free to contact us.\n\n" +
                        "Best regards,\nYour Team");
    }

    public void sendReminder(Invoice invoice) {

        Context context = new Context();
        context.setVariable("invoice", invoice);

        String payLink = buildPayLink(invoice);
        context.setVariable("payLink", payLink);

        String html = templateEngine.process("email/reminder-email", context);

        sendHtml(
                invoice.getCustomerEmail(),
                "Reminder: Invoice " + invoice.getInvoiceNumber() + " is due soon",
                html);
    }

    public void sendOverdue(Invoice invoice) {

        Context context = new Context();
        context.setVariable("invoice", invoice);

        String payLink = buildPayLink(invoice);
        context.setVariable("payLink", payLink);

        String html = templateEngine.process("email/overdue-email", context);

        sendHtml(
                invoice.getCustomerEmail(),
                "Action required: Invoice " + invoice.getInvoiceNumber() + " is overdue",
                html);
    }

    public void sendSupportTicketNotification(SupportTicket ticket) {

        Context context = new Context();
        context.setVariable("ticket", ticket);

        String html = templateEngine.process(
                "email/support-ticket-email",
                context);

        sendHtml(
                supportAdminEmail,
                "New Support Ticket - " + ticket.getTicketNumber(),
                html);
    }

    public void sendFeedbackNotification(Feedback feedback) {

        Context context = new Context();

        context.setVariable("feedback", feedback);

        String html = templateEngine.process(
                "email/feedback-email",
                context);

        sendHtml(
                supportAdminEmail,
                "New Feedback (" + feedback.getRating() + "/5)",
                html);
    }

    // =========================== HELPER ===========================
    private String buildPayLink(Invoice invoice) {

        if (invoice.getPaymentToken() == null || invoice.getPaymentToken().isBlank()) {
            throw new BadRequestException("Invoice payment token is missing");
        }

        return frontendUrl + "/pay/" + invoice.getPaymentToken();
    }
}