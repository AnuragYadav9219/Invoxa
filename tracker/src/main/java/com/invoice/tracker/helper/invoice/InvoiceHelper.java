package com.invoice.tracker.helper.invoice;

import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
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

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        if (!invoice.getShopId().equals(shopId)) {
            throw new AccessDeniedException("Unauthorized access");
        }

        return invoice;
    }
}