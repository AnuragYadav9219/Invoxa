package com.invoice.tracker.dto.item;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateItemRequest {
    
    private String name;

    private Double price;
}
