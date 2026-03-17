package com.invoice.tracker.repository.item;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.item.Item;

public interface ItemRepository extends JpaRepository<Item, UUID> {

    List<Item> findByShopId(UUID shopId);

    Optional<Item> findByIdAndShopId(UUID itemId, UUID shopId);
}
