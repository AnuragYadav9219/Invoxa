package com.invoice.tracker.service.invoice;

import java.util.List;
import java.util.UUID;

import com.invoice.tracker.dto.invoice.CreateInvoiceRequest;
import com.invoice.tracker.dto.invoice.InvoiceResponse;

public interface InvoiceService {
    
    InvoiceResponse createInvoice(CreateInvoiceRequest request);

    List<InvoiceResponse> getInvoices();

    InvoiceResponse getInvoice(UUID invoiceId);

    InvoiceResponse markAsPaid(UUID invoiceId);

    void deleteInvoice(UUID invoiceId);
}
