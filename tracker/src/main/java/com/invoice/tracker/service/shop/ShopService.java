package com.invoice.tracker.service.shop;

import java.util.UUID;

import com.invoice.tracker.dto.shop.ShopRequest;
import com.invoice.tracker.dto.shop.ShopResponse;

public interface ShopService {
    ShopResponse getShopById(UUID id);

    ShopResponse updateShop(UUID id, ShopRequest request);
}
