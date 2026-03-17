package com.invoice.tracker.dto.item;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ItemResponse {
    
    private UUID id;
    private String name;
    private Double price;
}
