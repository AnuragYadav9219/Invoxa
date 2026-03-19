package com.invoice.tracker.service.payment;

import java.util.List;
import java.util.UUID;

import com.invoice.tracker.dto.invoice.InvoiceResponse;
import com.invoice.tracker.dto.payment.CreatePaymentRequest;
import com.invoice.tracker.dto.payment.PaymentResponse;

public interface PaymentService {

    PaymentResponse addPayment(CreatePaymentRequest request);

    List<PaymentResponse> getPaymentsByInvoice(UUID invoiceId);

    InvoiceResponse markInvoiceAsPaid(UUID invoiceId);
}
