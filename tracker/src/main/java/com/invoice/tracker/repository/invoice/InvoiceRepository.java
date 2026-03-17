package com.invoice.tracker.repository.invoice;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.invoice.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    List<Invoice> findByShopId(UUID shopId);

    Optional<Invoice> findByIdAndShopId(UUID id, UUID shopId);
}
