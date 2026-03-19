package com.invoice.tracker.util;

import java.time.LocalDate;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.repository.invoice.InvoiceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvoiceScheduler {
    
    private final InvoiceRepository invoiceRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void markOverdueInvoices() {

        LocalDate today = LocalDate.now();

        log.info("Overdue scheduler started for date: {}", today);

        int updatedCount = invoiceRepository.markAllOverdue(today);

        log.info("Overdue scheduler completed. Updated {} invoices", updatedCount);
    }
}
