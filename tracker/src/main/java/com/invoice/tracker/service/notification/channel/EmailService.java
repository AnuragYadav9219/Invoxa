package com.invoice.tracker.service.notification.channel;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.invoice.tracker.entity.invoice.Invoice;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void send(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    public void sendInvoiceCreated(Invoice invoice) {
        send(
            getCustomerEmail(invoice),
            "Invoice Created",
            buildInvoiceMessage(invoice)
        );
    }

    public void sendPaymentReceived(Invoice invoice) {
        send(
            getCustomerEmail(invoice),
            "Payment Received",
            "Your payment for Invoice #" + invoice.getInvoiceNumber() + " is received."
        );
    }

    public void sendReminder(Invoice invoice) {
        send(
            getCustomerEmail(invoice),
            "Payment Reminder",
            "Reminder: Invoice #" + invoice.getInvoiceNumber() + " is due on " + invoice.getDueDate()
        );
    }

    public void sendOverdue(Invoice invoice) {
        send(
            getCustomerEmail(invoice),
            "Invoice Overdue",
            "Invoice #" + invoice.getInvoiceNumber() + " is overdue. Please pay ASAP."
        );
    }

    // ================= HELPER =================

    private String getCustomerEmail(Invoice invoice) {
        // TODO: add email field in Invoice later
        return "customer@email.com";
    }

    private String buildInvoiceMessage(Invoice invoice) {
        return "Invoice #" + invoice.getInvoiceNumber() +
                "\nAmount: " + invoice.getTotalAmount() +
                "\nDue Date: " + invoice.getDueDate();
    }
}