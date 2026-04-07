package com.invoice.tracker.controller.payment;

import java.util.List;
import java.util.UUID;

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
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.dto.payment.CreatePaymentRequest;
import com.invoice.tracker.dto.payment.PaymentFilterRequest;
import com.invoice.tracker.dto.payment.PaymentResponse;
import com.invoice.tracker.service.payment.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // ======================== ADD PAYMENT ===========================
    @PreAuthorize("hasRole('OWNER')")
    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> addPayment(@RequestBody CreatePaymentRequest request) {

        PaymentResponse response = paymentService.addPayment(request);

        return ResponseBuilder.success(response, "SUCCESS");
    }

    // ======================== MARK AS PAID ===========================
    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/invoice/{invoiceId}/mark-paid")
    public ResponseEntity<ApiResponse<InvoiceResponse>> markInvoiceAsPaid(
            @PathVariable UUID invoiceId) {

        InvoiceResponse response = paymentService.markInvoiceAsPaid(invoiceId);

        return ResponseBuilder.success(response, "Invoice marked as PAID (Cash)");
    }

    // ======================== GET PAYMENTS HISTORY ===========================
    @PreAuthorize("hasAnyRole('OWNER','STAFF')")
    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByInvoice(@PathVariable UUID invoiceId) {

        List<PaymentResponse> payments = paymentService.getPaymentsByInvoice(invoiceId);

        return ResponseBuilder.success(payments, "Payments history fetched successfully");
    }

    // ========================= GET PAYMENT BY ID =========================
    @PreAuthorize("hasAnyRole('OWNER','STAFF')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable UUID id) {

        PaymentResponse payment = paymentService.getPaymentById(id);

        return ResponseBuilder.success(payment, "Payment fetched successfully");
    }

    // ========================= UPDATE PAYMENT ==========================
    @PreAuthorize("hasRole('OWNER')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> updatePayment(
            @PathVariable UUID id,
            @RequestBody CreatePaymentRequest request) {

        PaymentResponse response = paymentService.updatePayment(id, request);

        return ResponseBuilder.success(response, "Payment updated successfully");
    }

    // ========================= GET ALL PAYMENTS =========================
    @PreAuthorize("hasRole('OWNER')")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PaymentResponse>>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<PaymentResponse> payments = paymentService.getAllPayments(page, size);

        return ResponseBuilder.success(payments, "Payments fetched successfully");
    }

    // ====================== DELETE PAYMENTS (SOFT) ======================
    @PreAuthorize("hasRole('OWNER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePayment(@PathVariable UUID id) {

        paymentService.deletePayment(id);

        return ResponseBuilder.success(null, "Payment moved to trash");
    }

    // ========================= RESTORE PAYMENTS =============================
    @PreAuthorize("hasRole('OWNER')")
    @PutMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<Void>> restorePayment(@PathVariable UUID id) {

        paymentService.restorePayment(id);

        return ResponseBuilder.success(null, "Payment restored");
    }

    // ========================= PERMANENT PAYMENTS =============================
    @PreAuthorize("hasRole('OWNER')")
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse<Void>> permanentDelete(@PathVariable UUID id) {

        paymentService.permanentDeletePayment(id);

        return ResponseBuilder.success(null, "Payment deleted successfully");
    }

    // ========================= GET DELETED PAYMENTS =============================
    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/trash")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getDeletedPayments() {

        List<PaymentResponse> payments = paymentService.getDeletedPayments();

        return ResponseBuilder.success(payments, "Payments fetched successfully");
    }

    // ========================= FILTER PAYMENTS =============================
    @PreAuthorize("hasRole('OWNER', 'STAFF')")
    @PostMapping("/filter")
    public ResponseEntity<ApiResponse<PageResponse<PaymentResponse>>> filterPayments(
            @RequestBody PaymentFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseBuilder.success(
                paymentService.filterPayments(filter, page, size),
                "Filtered payments fetched successfully");
    }
}
