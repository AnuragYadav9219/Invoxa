package com.invoice.tracker.listener;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.event.invoice.DueReminderEvent;
import com.invoice.tracker.event.invoice.InvoiceCreatedEvent;
import com.invoice.tracker.event.invoice.InvoiceOverDueEvent;
import com.invoice.tracker.event.invoice.PartialPaymentEvent;
import com.invoice.tracker.event.invoice.PaymentReceivedEvent;
import com.invoice.tracker.repository.invoice.InvoiceRepository;
import com.invoice.tracker.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationService notificationService;
    private final InvoiceRepository invoiceRepository;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleInvoiceCreated(InvoiceCreatedEvent event) {

        Invoice invoice = invoiceRepository
                .findById(event.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice Not found: " + event.getInvoiceId()));

        notificationService.sendInvoiceCreatedNotification(invoice, event.getShopId());
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePartialPayment(PartialPaymentEvent event) {

        Invoice invoice = invoiceRepository
                .findById(event.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice Not found: " + event.getInvoiceId()));

        notificationService.sendPartialPaymentNotification(invoice, event.getShopId());
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleFullyPaid(PaymentReceivedEvent event) {

        Invoice invoice = invoiceRepository
                .findById(event.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice Not found: " + event.getInvoiceId()));

        notificationService.sendInvoiceFullyPaidNotification(invoice, event.getShopId());
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOverdue(InvoiceOverDueEvent event) {

        Invoice invoice = invoiceRepository
                .findById(event.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice Not found: " + event.getInvoiceId()));

        notificationService.sendOverdueAlert(invoice, event.getShopId());
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleDueReminder(DueReminderEvent event) {

        Invoice invoice = invoiceRepository
                .findById(event.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice Not found: " + event.getInvoiceId()));

        notificationService.sendDueReminder(invoice, event.getShopId());
    }
}
