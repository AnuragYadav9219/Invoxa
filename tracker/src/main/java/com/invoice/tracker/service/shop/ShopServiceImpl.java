package com.invoice.tracker.service.shop;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.invoice.tracker.common.exception.ResourceNotFoundException;
import com.invoice.tracker.dto.shop.ShopRequest;
import com.invoice.tracker.dto.shop.ShopResponse;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.mapper.ShopMapper;
import com.invoice.tracker.repository.shop.ShopRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;

    @Override
    public ShopResponse getShopById(UUID id) {

        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found"));

        return ShopMapper.toResponse(shop);
    }

    @Override
    public ShopResponse updateShop(UUID id, ShopRequest request) {

        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found"));

        ShopMapper.updateEntity(shop, request);

        shopRepository.save(shop);

        return ShopMapper.toResponse(shop);
    }

}
