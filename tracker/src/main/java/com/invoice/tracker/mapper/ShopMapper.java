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
                .ownerName(shop.getOwnerName())
                .email(shop.getEmail())
                .phone(shop.getPhone())
                .address(shop.getAddress())
                .invoiceTemplate(
                        shop.getInvoiceTemplate() != null
                                ? shop.getInvoiceTemplate().name()
                                : "CLASSIC")
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
                .email(request.getEmail())
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
        shop.setEmail(request.getEmail());
    }
}
