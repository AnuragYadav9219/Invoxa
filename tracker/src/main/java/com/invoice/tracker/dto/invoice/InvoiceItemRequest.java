package com.invoice.tracker.dto.invoice;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceItemRequest {
    
    private UUID itemId;

    private int quantity;
}
