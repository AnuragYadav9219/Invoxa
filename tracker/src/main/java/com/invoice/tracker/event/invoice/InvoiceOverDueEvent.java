package com.invoice.tracker.event.invoice;

import com.invoice.tracker.entity.invoice.Invoice;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InvoiceOverDueEvent {
    private final Invoice invoice;
}
