package com.invoice.tracker.mapper;

import com.invoice.tracker.dto.shop.ShopRequest;
import com.invoice.tracker.dto.shop.ShopResponse;
import com.invoice.tracker.entity.auth.Shop;

public class ShopMapper {

    // ================== ENTITY -> RESPONSE ======================
    public static ShopResponse toResponse(Shop shop) {
        if (shop == null)
            return null;

        return ShopResponse.builder()
                .id(shop.getId())
                .shopName(shop.getShopName())
                .ownername(shop.getOwnerName())
                .phone(shop.getPhone())
                .address(shop.getAddress())
                .build();
    }

    // ==================== REQUEST -> ENTITY =====================
    public static Shop toEntity(ShopRequest request) {
        if (request == null)
            return null;

        return Shop.builder()
                .shopName(request.getShopName())
                .ownerName(request.getOwnerName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();
    }

    // ====================== UPDATE ENTITY ========================
    public static void updateEntity(Shop shop, ShopRequest request) {
        if (shop == null || request == null)
            return;

        shop.setShopName(request.getShopName());
        shop.setOwnerName(request.getOwnerName());
        shop.setPhone(request.getPhone());
        shop.setAddress(request.getAddress());
    }
}
