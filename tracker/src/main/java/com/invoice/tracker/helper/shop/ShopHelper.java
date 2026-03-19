package com.invoice.tracker.helper.shop;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.repository.shop.ShopRepository;
import com.invoice.tracker.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ShopHelper {

    private final ShopRepository shopRepository;

    public Shop getCurrentShopOrThrow() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        return shopRepository.findById(shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found"));
    }
}
