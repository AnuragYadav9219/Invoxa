package com.invoice.tracker.dto.invoice;

import com.invoice.tracker.entity.templates.InvoiceTemplate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateInvoiceTemplateRequest {
    private InvoiceTemplate invoiceTemplate;
}
