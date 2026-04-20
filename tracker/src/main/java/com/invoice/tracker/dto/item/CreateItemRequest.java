package com.invoice.tracker.dto.item;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateItemRequest {
    
    private String name;

    private BigDecimal price;

    private String defaultUnit;

    private List<String> allowedUnits;
}
