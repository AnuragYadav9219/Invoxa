package com.invoice.tracker.controller.invoice;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.dto.invoice.CreateInvoiceRequest;
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.service.invoice.InvoiceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    // ============================ CREATE INVOICE =========================
    @PostMapping
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(@RequestBody CreateInvoiceRequest request) {

        InvoiceResponse invoice = invoiceService.createInvoice(request);

        ApiResponse<InvoiceResponse> response = ApiResponse.<InvoiceResponse>builder()
                .success(true)
                .message("Invoice created successfully")
                .data(invoice)
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ============================ GET ALL INVOICE =========================
    @GetMapping
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getInvoices() {

        List<InvoiceResponse> invoices = invoiceService.getInvoices();

        ApiResponse<List<InvoiceResponse>> response = ApiResponse.<List<InvoiceResponse>>builder()
                .success(true)
                .message("Invoices fetched successfully")
                .data(invoices)
                .build();

        return ResponseEntity.ok(response);
    }

    // ============================ GET SINGLE INVOICE =========================
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoice(@PathVariable UUID id) {

        InvoiceResponse invoice = invoiceService.getInvoice(id);

        ApiResponse<InvoiceResponse> response = ApiResponse.<InvoiceResponse>builder()
                .success(true)
                .message("Invoice fetched successfully")
                .data(invoice)
                .build();

        return ResponseEntity.ok(response);
    }

    // ============================ DELETE INVOICE =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInvoice(@PathVariable UUID id) {

        invoiceService.deleteInvoice(id);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Invoice deleted successfully")
                .data(null)
                .build();

        return ResponseEntity.ok(response);
    }
}
