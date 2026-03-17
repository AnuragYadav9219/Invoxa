package com.invoice.tracker.dto.invoice;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InvoiceResponse {

    private UUID id;
    private String invoiceNumber;
    private UUID shopId;

    private String customerName;
    private String customerPhone;

    private Double totalAmount;
    private String status;
    private LocalDate dueDate;

    private List<InvoiceItemResponse> items;
}
