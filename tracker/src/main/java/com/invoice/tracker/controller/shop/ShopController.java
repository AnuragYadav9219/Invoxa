package com.invoice.tracker.controller.shop;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.shop.ShopRequest;
import com.invoice.tracker.dto.shop.ShopResponse;
import com.invoice.tracker.service.shop.ShopService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    // ================= GET SHOP =====================
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShopResponse>> getShop(@PathVariable UUID id) {

        ShopResponse shop = shopService.getShopById(id);

        return ResponseBuilder.success(shop, "Shop fetched successfully");
    }

    // ================== UPDATE SHOP ===================
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ShopResponse>> updateShop(
            @PathVariable UUID id,
            @RequestBody ShopRequest request) {

        ShopResponse updatedShop = shopService.updateShop(id, request);

        return ResponseBuilder.success(updatedShop, "Shop updated successfully");
    }
}
