package com.invoice.tracker.controller.invoice;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.common.PageResponse;
import com.invoice.tracker.dto.invoice.CreateInvoiceRequest;
import com.invoice.tracker.dto.invoice.InvoiceFilterRequest;
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.entity.invoice.InvoiceTemplate;
import com.invoice.tracker.security.SecurityUtils;
import com.invoice.tracker.service.invoice.InvoiceService;
import com.invoice.tracker.service.pdf.PdfService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

        private final InvoiceService invoiceService;
        private final PdfService pdfService;

        // ========================= GET INVOICE TRASH =======================
        @PreAuthorize("hasRole('OWNER')")
        @GetMapping("/trash")
        public ResponseEntity<ApiResponse<List<InvoiceResponse>>> trashInvoice() {

                List<InvoiceResponse> invoices = invoiceService.getDeletedInvoices();

                return ResponseBuilder.success(invoices, "Trash fetched");
        }

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

        // ========================== GET BY CUSTOMER ========================
        @PreAuthorize("hasAnyRole('OWNER','STAFF')")
        @GetMapping("/by-customer")
        public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getByCustomer(@RequestParam String customerName) {

                List<InvoiceResponse> invoices = invoiceService.getInvoicesByCustomer(customerName);

                return ResponseBuilder.success(
                                invoices,
                                "Customer invoices fetched successfully");
        }

        // ========================== GET SUMMARIES OF CUSTOMER ========================
        @PreAuthorize("hasAnyRole('OWNER','STAFF')")
        @GetMapping("/customers-summary")
        public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCustomerSummary() {

                List<Map<String, Object>> summaries = invoiceService.getCustomerSummary();

                return ResponseBuilder.success(
                                summaries,
                                "Summaries fetched successfully");
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

        // ============================ DELETE INVOICE (SOFT) =========================
        @PreAuthorize("hasRole('OWNER')")
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteInvoice(@PathVariable UUID id) {

                invoiceService.deleteInvoice(id);

                return ResponseBuilder.success(
                                null,
                                "Invoice deleted successfully");
        }

        // ========================= RESTORE INVOICE =======================
        @PreAuthorize("hasRole('OWNER')")
        @PostMapping("/{id}/restore")
        public ResponseEntity<ApiResponse<Void>> restoreInvoice(@PathVariable UUID id) {

                invoiceService.restoreInvoice(id);

                return ResponseBuilder.success(null, "Invoice restored");
        }

        // ========================= PERMANENT DELETE =======================
        @PreAuthorize("hasRole('OWNER')")
        @DeleteMapping("/{id}/permanent")
        public ResponseEntity<ApiResponse<Void>> permanentDelete(@PathVariable UUID id) {

                invoiceService.permanentDeleteInvoice(id);

                return ResponseBuilder.success(null, "Invoice deleted permanently");
        }

        // ======================= VIEW + DOWNLOAD INVOICE ========================
        @PreAuthorize("hasAnyRole('OWNER', 'STAFF')")
        @PostMapping("/pdf/{invoiceId}")
        public ResponseEntity<byte[]> generateInvoicePdf(
                        @PathVariable UUID invoiceId,
                        @RequestParam(defaultValue = "classic") InvoiceTemplate template) {

                UUID shopId = SecurityUtils.getCurrentUserShopId();

                byte[] pdf = pdfService.generateInvoicePdf(invoiceId, shopId, template);

                return ResponseEntity.ok()
                                .contentType(MediaType.APPLICATION_PDF)
                                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice.pdf")
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
