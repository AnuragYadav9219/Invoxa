package com.invoice.tracker.event.invoice;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InvoiceFullyPaidEvent {
    private final UUID invoiceId;
    private final UUID shopId;
}
