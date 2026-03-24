package com.invoice.tracker.controller.payment;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.dto.payment.CreatePaymentRequest;
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

        return ResponseBuilder.success(payments, "Payments fetched successfully");
    }
}
