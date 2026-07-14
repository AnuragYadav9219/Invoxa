package com.invoice.tracker.controller.invoice;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.service.invoice.InvoiceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/print")
@RequiredArgsConstructor
public class PublicPrintController {

    private final InvoiceService invoiceService;

    @GetMapping("/{invoiceId}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceForPrint(
            @PathVariable UUID invoiceId,
            @RequestHeader("X-Print-Token") String printToken) {

        return ResponseBuilder.success(
                invoiceService.getInvoiceForPrint(invoiceId, printToken),
                "Invoice fetched successfully");
    }
}