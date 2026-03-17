package com.invoice.tracker.service.item;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.dto.item.CreateItemRequest;
import com.invoice.tracker.dto.item.ItemResponse;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.item.Item;
import com.invoice.tracker.repository.item.ItemRepository;
import com.invoice.tracker.repository.shop.ShopRepository;
import com.invoice.tracker.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final ShopRepository shopRepository;

    // Mapper
    private ItemResponse mapToResponse(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .price(item.getPrice())
                .build();
    }

    // Create item
    @Override
    @Transactional
    public ItemResponse createItem(CreateItemRequest request) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        Item item = Item.builder()
                .name(request.getName())
                .price(request.getPrice())
                .shop(shop)
                .build();

        itemRepository.save(item);

        return mapToResponse(item);
    }

    // Get single item
    @Override
    public ItemResponse getItem(UUID itemId) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        Item item = itemRepository
                .findByIdAndShopId(itemId, shopId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        return mapToResponse(item);
    }

    // Get all items of shop
    @Override
    public List<ItemResponse> getItems() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return itemRepository.findByShopId(shopId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update item
    @Override
    public ItemResponse updateItem(UUID itemId, CreateItemRequest request) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        Item item = itemRepository
                .findByIdAndShopId(itemId, shopId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setName(request.getName());
        item.setPrice(request.getPrice());

        itemRepository.save(item);

        return mapToResponse(item);
    }

    // Delete item
    @Override
    public void deleteItem(UUID itemId) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        Item item = itemRepository
                .findByIdAndShopId(itemId, shopId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        itemRepository.delete(item);
    }
}
