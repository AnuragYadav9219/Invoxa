package com.invoice.tracker.controller.invoice;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.invoice.InvoicePdfResponse;
import com.invoice.tracker.service.invoice.InvoiceService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/print")
@RequiredArgsConstructor
public class PublicPrintController {

    private final InvoiceService invoiceService;

    @GetMapping("/{invoiceId}")
    public ResponseEntity<ApiResponse<InvoicePdfResponse>> getInvoiceForPrint(
            @PathVariable UUID invoiceId,
            HttpServletRequest request) {

                String token = request.getHeader("X-Print-Token");

                InvoicePdfResponse response = invoiceService.getInvoiceForPrint(invoiceId, token);

        return ResponseBuilder.success(response, "OK");
    }
}