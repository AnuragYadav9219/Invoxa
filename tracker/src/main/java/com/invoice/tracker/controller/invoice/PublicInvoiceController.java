package com.invoice.tracker.controller.invoice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.service.invoice.InvoiceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/invoices")
@RequiredArgsConstructor
public class PublicInvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/{paymentToken}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getPublicInvoice(@PathVariable String paymentToken) {

        return ResponseBuilder.success(
                invoiceService.getPublicInvoice(paymentToken),
                "Invoice fetched successfully");
    }
}
