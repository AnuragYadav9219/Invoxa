package com.invoice.tracker.helper.item;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.entity.item.Item;
import com.invoice.tracker.repository.item.ItemRepository;
import com.invoice.tracker.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ItemHelper {

    private final ItemRepository itemRepository;

    public Item getItemOrThrow(UUID itemId) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return itemRepository.findByIdAndShopIdAndDeletedFalse(
                itemId,
                shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
    }
}
