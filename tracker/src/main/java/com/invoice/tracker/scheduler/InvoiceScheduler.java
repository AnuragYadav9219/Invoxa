package com.invoice.tracker.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.invoice.InvoiceStatus;
import com.invoice.tracker.event.invoice.DueReminderEvent;
import com.invoice.tracker.event.invoice.InvoiceOverDueEvent;
import com.invoice.tracker.repository.invoice.InvoiceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvoiceScheduler {

    private final InvoiceRepository invoiceRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void markOverdueInvoices() {

        LocalDate today = LocalDate.now();

        log.info("Overdue scheduler started for date: {}", today);

        List<Invoice> invoices = invoiceRepository.findAll();

        int updatedCount = 0;

        for (Invoice invoice : invoices) {

            if (invoice.getDueDate() != null
                    && invoice.getDueDate().isBefore(today)
                    && invoice.getStatus() != InvoiceStatus.PAID
                    && invoice.getStatus() != InvoiceStatus.OVERDUE) {

                invoice.setStatus(InvoiceStatus.OVERDUE);

                eventPublisher.publishEvent(new InvoiceOverDueEvent(invoice));

                updatedCount++;
            }
        }

        log.info("Overdue scheduler completed. Updated {} invoices", updatedCount);
    }

    @Scheduled(cron = "0 0 9 * * ?")
    @Transactional
    public void sendDueReminders() {

        LocalDate today = LocalDate.now();

        List<Invoice> invoices = invoiceRepository.findAll();

        for (Invoice invoice : invoices) {

            if (invoice.getDueDate() != null
                    && invoice.getDueDate().isEqual(today.plusDays(1))
                    && invoice.getStatus() != InvoiceStatus.PAID) {

                eventPublisher.publishEvent(new DueReminderEvent(invoice));
            }
        }
    }
}
