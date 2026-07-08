package com.invoice.tracker.controller.invoice;

import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.service.invoice.InvoiceService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/internal/invoices")
@RequiredArgsConstructor
public class InternalInvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/{invoiceId}")
    public InvoiceResponse getInvoice(
            @PathVariable UUID invoiceId,
            HttpServletRequest request) {

        UUID tokenInvoiceId = (UUID) request.getAttribute("invoiceId");

        UUID shopId = (UUID) request.getAttribute("shopId");

        if (tokenInvoiceId == null) {
            throw new RuntimeException("Missing print token");
        }

        if (!tokenInvoiceId.equals(invoiceId)) {
            throw new RuntimeException("Invalid print token");
        }

        return invoiceService.getInvoiceForPrint(invoiceId, shopId);
    }
}
