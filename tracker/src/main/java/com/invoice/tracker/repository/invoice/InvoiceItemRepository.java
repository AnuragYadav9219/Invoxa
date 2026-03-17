package com.invoice.tracker.repository.invoice;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.invoice.InvoiceItem;

public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, UUID> {
}