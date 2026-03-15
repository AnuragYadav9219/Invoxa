package com.invoice.tracker.controller.invoice;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.dto.invoice.InvoiceRequest;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.service.invoice.InvoiceService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    public Invoice createInvoice(
            @RequestBody InvoiceRequest request,
            @RequestHeader("shopId") UUID shopId) {
        return invoiceService.createInvoice(request, shopId);
    }

    @GetMapping
    public List<Invoice> getInvoices(@RequestHeader("shopId") UUID shopId) {
        return invoiceService.getShopInvoices(shopId);
    }
}
