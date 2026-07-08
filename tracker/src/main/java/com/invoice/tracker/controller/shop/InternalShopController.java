package com.invoice.tracker.controller.shop;

import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.dto.shop.ShopResponse;
import com.invoice.tracker.service.shop.ShopService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/internal/shops")
@RequiredArgsConstructor
public class InternalShopController {

    private final ShopService shopService;

    @GetMapping("/{shopId}")
    public ShopResponse getShop(
            @PathVariable UUID shopId,
            HttpServletRequest request) {

        UUID tokenShopId = (UUID) request.getAttribute("shopId");

        if (tokenShopId == null) {
            throw new RuntimeException("Missing print token");
        }

        if (!tokenShopId.equals(shopId)) {
            throw new RuntimeException("Invalid print token");
        }

        return shopService.getShopById(shopId);
    }
}