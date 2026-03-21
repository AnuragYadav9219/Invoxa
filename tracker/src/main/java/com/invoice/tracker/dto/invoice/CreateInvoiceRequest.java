package com.invoice.tracker.dto.invoice;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateInvoiceRequest {
    
    private String customerName;

    private String customerPhone;

    private String customerEmail;

    private LocalDate dueDate;

    private List<InvoiceItemRequest> items;
}
