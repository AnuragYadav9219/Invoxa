package com.invoice.tracker.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.Shop;

public interface ShopRepository extends JpaRepository<Shop, UUID> {

}
