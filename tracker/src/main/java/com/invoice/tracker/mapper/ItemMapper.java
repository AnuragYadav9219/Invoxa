package com.invoice.tracker.mapper;

import org.springframework.stereotype.Component;

import com.invoice.tracker.dto.item.ItemResponse;
import com.invoice.tracker.entity.item.Item;

@Component
public class ItemMapper {

    public ItemResponse toResponse(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .price(item.getPrice())
                .defaultUnit(item.getDefaultUnit() != null ? item.getDefaultUnit().name() : null)
                .allowedUnits(
                        item.getAllowedUnits() != null
                                ? item.getAllowedUnits().stream()
                                        .map((Enum::name))
                                        .toList()
                                : null)
                .build();
    }
}
