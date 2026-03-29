package com.invoice.tracker.dto.invoice;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceItemRequest {
    
    private String itemName;
    private BigDecimal price;
    private int quantity;
}
