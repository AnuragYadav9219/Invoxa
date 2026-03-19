package com.invoice.tracker.repository.invoice;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.invoice.tracker.entity.invoice.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    List<Invoice> findByShopId(UUID shopId);

    Optional<Invoice> findByIdAndShopId(UUID id, UUID shopId);

    @Modifying
    @Query("""
            UPDATE Invoice i
            SET i.status = 'OVERDUE'
            WHERE i.dueDate < :today
            AND i.remainingAmount > 0
            AND i.status != 'PAID'
            """)
    int markAllOverdue(LocalDate today);
}
