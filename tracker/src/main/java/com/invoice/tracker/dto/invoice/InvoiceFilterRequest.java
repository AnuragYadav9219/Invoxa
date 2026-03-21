package com.invoice.tracker.dto.invoice;

import java.time.LocalDate;

import com.invoice.tracker.entity.invoice.InvoiceStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceFilterRequest {
    
    private String search;

    private InvoiceStatus status;

    private LocalDate fromDate;
    private LocalDate toDate;
}
