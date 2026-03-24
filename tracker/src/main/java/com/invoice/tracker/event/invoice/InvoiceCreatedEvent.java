package com.invoice.tracker.event.invoice;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InvoiceCreatedEvent {
    private final UUID invoiceId;
    private final UUID shopId;
}
