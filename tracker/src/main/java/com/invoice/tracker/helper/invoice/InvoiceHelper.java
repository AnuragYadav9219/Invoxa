package com.invoice.tracker.helper.invoice;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.repository.invoice.InvoiceRepository;
import com.invoice.tracker.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class InvoiceHelper {

    private final InvoiceRepository invoiceRepository;

    public Invoice getInvoiceOrThrow(UUID invoiceId) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return invoiceRepository.findByIdWithItems(invoiceId, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
    }

    public Invoice getInvoiceOrThrow(UUID invoiceId, UUID shopId) {

        return invoiceRepository.findByIdWithItems(invoiceId, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
    }
}