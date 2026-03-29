package com.invoice.tracker.service.item;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.dto.item.CreateItemRequest;
import com.invoice.tracker.dto.item.ItemResponse;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.item.Item;
import com.invoice.tracker.helper.item.ItemHelper;
import com.invoice.tracker.helper.shop.ShopHelper;
import com.invoice.tracker.mapper.ItemMapper;
import com.invoice.tracker.repository.item.ItemRepository;
import com.invoice.tracker.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final ItemHelper itemHelper;
    private final ShopHelper shopHelper;
    private final ItemMapper itemMapper;

    // Create item
    @Override
    @Transactional
    public ItemResponse createItem(CreateItemRequest request) {

        Shop shop = shopHelper.getCurrentShopOrThrow();

        Item item = Item.builder()
                .name(request.getName())
                .price(request.getPrice())
                .shop(shop)
                .build();

        itemRepository.save(item);

        return itemMapper.toResponse(item);
    }

    // Get single item
    @Override
    public ItemResponse getItem(UUID itemId) {

        Item item = itemHelper.getItemOrThrow(itemId);

        return itemMapper.toResponse(item);
    }

    // Get all items of shop
    @Override
    public List<ItemResponse> getItems() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return itemRepository.findByShopIdAndDeletedFalse(shopId)
                .stream()
                .map(itemMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Update item
    @Override
    public ItemResponse updateItem(UUID itemId, CreateItemRequest request) {

        Item item = itemHelper.getItemOrThrow(itemId);

        item.setName(request.getName());
        item.setPrice(request.getPrice());

        itemRepository.save(item);

        return itemMapper.toResponse(item);
    }

    // Delete item
    @Override
    @Transactional
    public void deleteItem(UUID itemId) {

        Item item = itemHelper.getItemOrThrow(itemId);

        item.setDeleted(true);
        item.setDeletedAt(LocalDateTime.now());
        item.setDeletedBy(SecurityUtils.getCurrentUserId());

        itemRepository.save(item);
    }

    // ============== RESTORE ITEM ================
    @Override
    @Transactional
    public void restoreItem(UUID itemId) {
        UUID shopId = SecurityUtils.getCurrentUserShopId();

        Item item = itemRepository.findByIdAndShopId(itemId, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (!item.isDeleted()) {
            throw new RuntimeException("Item is not deleted");
        }

        item.setDeleted(false);
        item.setDeletedAt(null);
        item.setDeletedBy(null);

        itemRepository.save(item);
    }

    // ================ GET DELETED ITEMS ================
    @Override
    public List<ItemResponse> getDeletedItems() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return itemRepository.findByShopIdAndDeletedTrue(shopId)
                .stream()
                .map(itemMapper::toResponse)
                .toList();
    }

    // ================ PERMANENTLY DELETE =================
    @Override
    @Transactional
    public void permanentlyDeleteItem(UUID itemId) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        Item item = itemRepository.findByIdAndShopId(itemId, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (!item.isDeleted()) {
            throw new RuntimeException("Item must be deleted first");
        }

        itemRepository.delete(item);
    }
}
