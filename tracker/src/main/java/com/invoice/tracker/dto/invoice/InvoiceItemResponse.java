package com.invoice.tracker.dto.invoice;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InvoiceItemResponse {
    
    private String itemName;
    private int quantity;
    private BigDecimal price;
    private BigDecimal total;
}
