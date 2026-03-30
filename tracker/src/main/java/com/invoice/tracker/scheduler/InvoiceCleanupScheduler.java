package com.invoice.tracker.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.repository.invoice.InvoiceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceCleanupScheduler {

    private final InvoiceRepository invoiceRepository;

    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanOldDeletedInvoices() {

        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);

        List<Invoice> oldInvoices = invoiceRepository.findByDeletedTrueAndDeletedAtBefore(cutoff);

        if (!oldInvoices.isEmpty()) {
            invoiceRepository.deleteAll(oldInvoices);
            log.info("Deleted {} old invoices permanently", oldInvoices.size());
        }
    }
}
