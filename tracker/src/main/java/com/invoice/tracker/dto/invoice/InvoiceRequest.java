package com.invoice.tracker.dto.invoice;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceRequest {
    
    private String customername;

    private String customerPhone;

    private Double amount;

    private LocalDate dueDate;
}
