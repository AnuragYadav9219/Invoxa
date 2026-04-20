package com.invoice.tracker.dto.invoice;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InvoiceItemResponse {
    
    private UUID itemId;
    private String itemName;
    private BigDecimal quantity;
    private BigDecimal price;
    private BigDecimal total;
    private String unit;
}
