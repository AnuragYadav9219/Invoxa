package com.invoice.tracker.service.payment;

import java.util.List;
import java.util.UUID;

import com.invoice.tracker.dto.common.PageResponse;
import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.dto.payment.CreatePaymentRequest;
import com.invoice.tracker.dto.payment.PaymentFilterRequest;
import com.invoice.tracker.dto.payment.PaymentResponse;

public interface PaymentService {

    PaymentResponse addPayment(CreatePaymentRequest request);

    List<PaymentResponse> getPaymentsByInvoice(UUID invoiceId);

    PageResponse<PaymentResponse> getAllPayments(int page, int size);

    PaymentResponse getPaymentById(UUID id);

    PaymentResponse updatePayment(UUID id, CreatePaymentRequest request);

    public void restorePayment(UUID id);

    public void restorePaymentsByInvoice(UUID invoiceId);

    public void deletePayment(UUID paymentId);

    public void deletePaymentsByInvoice(UUID invoiceId);

    public void permanentDeletePayment(UUID id);

    public List<PaymentResponse> getDeletedPayments();

    InvoiceResponse markInvoiceAsPaid(UUID invoiceId);

    PageResponse<PaymentResponse> filterPayments(PaymentFilterRequest filter, int page, int size);
}
