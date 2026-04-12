package com.invoice.tracker.service.invoice;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.invoice.tracker.dto.common.PageResponse;
import com.invoice.tracker.dto.invoice.CreateInvoiceRequest;
import com.invoice.tracker.dto.invoice.InvoiceFilterRequest;
import com.invoice.tracker.dto.invoice.InvoiceResponse;

public interface InvoiceService {

    InvoiceResponse createInvoice(CreateInvoiceRequest request);

    PageResponse<InvoiceResponse> getInvoices(int page, int size);

    InvoiceResponse getInvoice(UUID invoiceId);

    InvoiceResponse updateInvoice(UUID invoiceId, CreateInvoiceRequest request);

    void deleteInvoice(UUID invoiceId);

    void restoreInvoice(UUID id);

    List<InvoiceResponse> getInvoicesByCustomer(String customerName);

    List<Map<String, Object>> getCustomerSummary();

    void permanentDeleteInvoice(UUID id);

    List<InvoiceResponse> getDeletedInvoices();

    byte[] getInvoicePdf(UUID invoiceId, UUID shopId);

    List<InvoiceResponse> getRecentInvoices(int limit);

    PageResponse<InvoiceResponse> filterInvoices(InvoiceFilterRequest filter, int page, int size);
}
