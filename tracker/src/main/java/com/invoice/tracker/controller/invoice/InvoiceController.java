package com.invoice.tracker.controller.invoice;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.common.PageResponse;
import com.invoice.tracker.dto.invoice.CreateInvoiceRequest;
import com.invoice.tracker.dto.invoice.InvoiceFilterRequest;
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.service.invoice.InvoiceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

        private final InvoiceService invoiceService;

        // ============================ CREATE INVOICE =========================
        @PreAuthorize("hasRole('OWNER')")
        @PostMapping
        public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(@RequestBody CreateInvoiceRequest request) {

                InvoiceResponse invoice = invoiceService.createInvoice(request);

                return ResponseBuilder.success(
                                invoice,
                                "Invoice created successfully",
                                HttpStatus.CREATED);
        }

        // ============================ GET INVOICES =========================

        @GetMapping
        public ResponseEntity<ApiResponse<PageResponse<InvoiceResponse>>> getInvoices(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {

                PageResponse<InvoiceResponse> invoices = invoiceService.getInvoices(page, size);

                return ResponseBuilder.success(
                                invoices,
                                "Invoices fetched successfully");
        }

        // ============================ GET SINGLE INVOICE =========================
        @PreAuthorize("hasAnyRole('OWNER','STAFF')")
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoice(@PathVariable UUID id) {

                InvoiceResponse invoice = invoiceService.getInvoice(id);

                return ResponseBuilder.success(
                                invoice,
                                "Invoice fetched successfully");
        }

        // =========================== UPDATE INVOICE ==========================
        @PutMapping("/{id}")
        @PreAuthorize("hasRole('OWNER')")
        public ResponseEntity<ApiResponse<InvoiceResponse>> updateInvoice(
                        @PathVariable UUID id,
                        @RequestBody CreateInvoiceRequest request) {

                InvoiceResponse invoice = invoiceService.updateInvoice(id, request);

                return ResponseBuilder.success(invoice, "Invoice updated successfully");
        }

        // ============================ DELETE INVOICE =========================
        @PreAuthorize("hasRole('OWNER')")
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteInvoice(@PathVariable UUID id) {

                invoiceService.deleteInvoice(id);

                return ResponseBuilder.success(
                                null,
                                "Invoice deleted successfully");
        }

        // ==================== VIEW + DOWNLOAD INVOICE ====================
        @PreAuthorize("hasAnyRole('OWNER','STAFF')")
        @GetMapping("/{invoiceId}/pdf")
        public ResponseEntity<byte[]> downloadInvoicePdf(
                        @PathVariable UUID invoiceId,
                        @RequestHeader("X-Shop-Id") UUID shopId,
                        @RequestParam(defaultValue = "false") boolean download) {

                byte[] pdf = invoiceService.getInvoicePdf(invoiceId, shopId);

                String disposition = download ? "attachment" : "inline";

                return ResponseEntity.ok()
                                .header("Content-Type", "application/pdf")
                                .header("Content-Disposition", disposition + "; filename=invoice-" + invoiceId + ".pdf")
                                .body(pdf);
        }

        // ========================= RECENT INVOICE DATA ====================
        @GetMapping("/recent")
        @PreAuthorize("hasRole('OWNER')")
        public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getRecentInvoices(
                        @RequestParam(defaultValue = "5") int limit) {

                List<InvoiceResponse> invoices = invoiceService.getRecentInvoices(limit);

                return ResponseBuilder.success(
                                invoices,
                                "Recent Invoices fetched successfully");
        }

        // ========================== FILTER ========================
        @PreAuthorize("hasAnyRole('OWNER','STAFF')")
        @PostMapping("/filter")
        public ResponseEntity<ApiResponse<PageResponse<InvoiceResponse>>> filterInvoices(
                        @RequestBody InvoiceFilterRequest request,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {

                PageResponse<InvoiceResponse> invoices = invoiceService.filterInvoices(request, page, size);

                return ResponseBuilder.success(
                                invoices,
                                "Filtered invoices fetched successfully");
        }
}
