package com.invoice.tracker.listener;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import com.invoice.tracker.event.invoice.DueReminderEvent;
import com.invoice.tracker.event.invoice.InvoiceCreatedEvent;
import com.invoice.tracker.event.invoice.InvoiceOverDueEvent;
import com.invoice.tracker.event.invoice.PartialPaymentEvent;
import com.invoice.tracker.event.invoice.PaymentReceivedEvent;
import com.invoice.tracker.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationService notificationService;

    @Async
    @TransactionalEventListener
    public void handleInvoiceCreated(InvoiceCreatedEvent event) {
        notificationService.sendInvoiceCreatedNotification(event.getInvoice());
    }

    @Async
    @TransactionalEventListener
    public void handlePartialPayment(PartialPaymentEvent event) {
        notificationService.sendPartialPaymentNotification(event.getInvoice());
    }

    @Async
    @TransactionalEventListener
    public void handleFullyPaid(PaymentReceivedEvent event) {
        notificationService.sendInvoiceFullyPaidNotification(event.getInvoice());
    }

    @Async
    @TransactionalEventListener
    public void handleOverdue(InvoiceOverDueEvent event) {
        notificationService.sendOverdueAlert(event.getInvoice());
    }

    @Async
    @TransactionalEventListener
    public void handleDueReminder(DueReminderEvent event) {
        notificationService.sendDueReminder(event.getInvoice());
    }
}
