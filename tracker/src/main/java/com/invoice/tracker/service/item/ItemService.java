package com.invoice.tracker.service.item;

import java.util.List;
import java.util.UUID;

import com.invoice.tracker.dto.item.CreateItemRequest;
import com.invoice.tracker.dto.item.ItemResponse;

public interface ItemService {
    
    ItemResponse createItem(CreateItemRequest request);

    List<ItemResponse> getItems();

    ItemResponse getItem(UUID itemId);

    ItemResponse updateItem(UUID itemId, CreateItemRequest request);

    void deleteItem(UUID itemId);
}
