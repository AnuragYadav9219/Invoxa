package com.invoice.tracker.service.invoice;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.invoice.tracker.dto.invoice.InvoiceRequest;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.invoice.InvoiceStatus;
import com.invoice.tracker.repository.auth.ShopRepository;
import com.invoice.tracker.repository.invoice.InvoiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ShopRepository shopRepository;

    // Create an invoice
    public Invoice createInvoice(InvoiceRequest request, UUID shopId) {

        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        Invoice invoice = Invoice.builder()
                .invoiceNumber("INV-" + System.currentTimeMillis())
                .customerName(request.getCustomername())
                .customerPhone(request.getCustomerPhone())
                .amount(request.getAmount())
                .dueDate(request.getDueDate())
                .status(InvoiceStatus.PENDING)
                .shop(shop)
                .build();

        return invoiceRepository.save(invoice);
    }

    // Get invoices of that particular shop
    public List<Invoice> getShopInvoices(UUID shopId) {

        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        return invoiceRepository.findByShop(shop);
    }
}
