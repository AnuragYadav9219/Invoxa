package com.invoice.tracker.helper.invoice;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.repository.invoice.InvoiceRepository;
import com.invoice.tracker.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class InvoiceHelper {

    private final InvoiceRepository invoiceRepository;

    public Invoice getInvoiceOrThrow(UUID invoiceId) {

        return invoiceRepository.findByIdAndShopId(
                invoiceId,
                SecurityUtils.getCurrentUserShopId()).orElseThrow(() -> new RuntimeException("Invoice not found"));
    }
}