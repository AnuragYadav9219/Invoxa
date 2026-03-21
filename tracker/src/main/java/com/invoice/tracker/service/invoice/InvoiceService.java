package com.invoice.tracker.service.invoice;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.invoice.tracker.dto.invoice.CreateInvoiceRequest;
import com.invoice.tracker.dto.invoice.InvoiceFilterRequest;
import com.invoice.tracker.dto.invoice.InvoiceResponse;

public interface InvoiceService {

    InvoiceResponse createInvoice(CreateInvoiceRequest request);

    Page<InvoiceResponse> getInvoices(int page, int size);

    InvoiceResponse getInvoice(UUID invoiceId);

    void deleteInvoice(UUID invoiceId);

    byte[] getInvoicePdf(UUID invoiceId, UUID shopId);

    Page<InvoiceResponse> filterInvoices(InvoiceFilterRequest filter, int page, int size);
}
