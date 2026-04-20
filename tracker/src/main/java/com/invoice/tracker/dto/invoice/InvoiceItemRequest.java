package com.invoice.tracker.dto.invoice;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceItemRequest {

    private UUID itemId;
    private BigDecimal quantity;

    private String unit;
    
    private BigDecimal customPrice;
}
