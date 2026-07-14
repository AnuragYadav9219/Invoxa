package com.invoice.tracker.controller.shop;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.shop.ShopResponse;
import com.invoice.tracker.service.shop.ShopService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/shops")
@RequiredArgsConstructor
public class PublicShopController {

    private final ShopService shopService;

    @GetMapping("/{shopId}")
    public ResponseEntity<ApiResponse<ShopResponse>> getPublicShop(
            @PathVariable UUID shopId) {

        return ResponseBuilder.success(
                shopService.getPublicShop(shopId),
                "Shop fetched successfully");
    }
}
