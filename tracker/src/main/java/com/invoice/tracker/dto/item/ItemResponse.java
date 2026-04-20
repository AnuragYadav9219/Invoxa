package com.invoice.tracker.dto.item;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ItemResponse {
    
    private UUID id;
    private String name;
    private BigDecimal price;
    private String defaultUnit;
    private List<String> allowedUnits;
}
