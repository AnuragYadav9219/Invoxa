package com.invoice.tracker.service.notification.channel;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.invoice.tracker.common.exception.BadRequestException;
import com.invoice.tracker.entity.invoice.Invoice;
import com.resend.Resend;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String username;

    private final JavaMailSender mailSender;
    private final Resend resend;
    private final TemplateEngine templateEngine;

    // ================= CORE EMAIL METHOD =================
    public void sendEmail(String to, String subject, String content, boolean isHtml, byte[] attachment,
            String fileName) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, isHtml);

            if (attachment != null && fileName != null) {
                helper.addAttachment(fileName, new ByteArrayResource(attachment));
            }

            log.info("SMTP Username: {}", username);
            mailSender.send(message);
            log.info("Email sent to {}", to);

        } catch (Exception e) {
            log.error("Failed to send email to {}", to, e);
            throw new RuntimeException("Email sending failed", e);
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

    // =========================== HELPER ===========================
    private String buildPayLink(Invoice invoice) {

        if (invoice.getPaymentToken() == null || invoice.getPaymentToken().isBlank()) {
            throw new BadRequestException("Invoice payment token is missing");
        }

        return frontendUrl + "/pay/" + invoice.getPaymentToken();
    }
}