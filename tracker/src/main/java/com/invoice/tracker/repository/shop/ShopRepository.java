package com.invoice.tracker.repository.shop;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.auth.Shop;

public interface ShopRepository extends JpaRepository<Shop, UUID>  {
    
}
