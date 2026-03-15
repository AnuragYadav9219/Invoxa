package com.invoice.tracker.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.invoice.tracker.entity.Invoice;
import com.invoice.tracker.repository.InvoiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final UserService userService;

    public List<Invoice> getInvoices() {

        UUID shopId = userService.getCurrentUserShopId();

        return invoiceRepository.findByShopId(shopId);
    }
}
