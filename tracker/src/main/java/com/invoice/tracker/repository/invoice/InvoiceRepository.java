package com.invoice.tracker.repository.invoice;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.invoice.tracker.entity.invoice.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID>, JpaSpecificationExecutor<Invoice> {

        // ===================== BASIC =====================
        Page<Invoice> findByShopId(UUID shopId, Pageable pageable);

        Optional<Invoice> findByIdAndShopId(UUID id, UUID shopId);

        // ===================== BULK UPDATE =========================
        @Modifying
        @Query("""
                        UPDATE Invoice i
                        SET i.status = 'OVERDUE'
                        WHERE i.dueDate < :today
                        AND i.remainingAmount > 0
                        AND i.status != 'PAID'
                        """)
        int markAllOverdue(LocalDate today);

        // ====================== DASHBOARD ===================

        // Total Revenue
        @Query("""
                        SELECT COALESCE(SUM(i.totalAmount), 0)
                        FROM Invoice i
                        WHERE i.shopId = :shopId
                        AND i.status = 'PAID'
                        """)
        BigDecimal getTotalRevenue(UUID shopId);

        // Total Pending Amount
        @Query("""
                        SELECT COALESCE(SUM(i.remainingAmount), 0)
                        FROM Invoice i
                        WHERE i.shopId = :shopId
                        AND i.status = 'PENDING'
                        """)
        BigDecimal getTotalPending(UUID shopId);

        // Total Overdue Amount
        @Query("""
                        SELECT COALESCE(SUM(i.remainingAmount), 0)
                        FROM Invoice i
                        WHERE i.shopId = :shopId
                        AND i.status = 'OVERDUE'
                        """)
        BigDecimal getTotalOverdue(UUID shopId);

        // Count by status
        @Query("""
                        SELECT i.status, COUNT(i)
                        FROM Invoice i
                        WHERE i.shopId = :shopId
                        GROUP BY i.status
                        """)
        List<Object[]> getInvoiceStatusCounts(UUID shopId);

        // Monthly Revenue (PAID only)
        @Query("""
                        SELECT FUNCTION('DATE_FORMAT', i.createdAt, '%Y-%m'), SUM(i.totalAmount)
                        FROM Invoice i
                        WHERE i.shopId = :shopId
                        AND i.status = 'PAID'
                        GROUP BY FUNCTION('DATE_FORMAT', i.createdAt, '%Y-%m')
                        ORDER BY FUNCTION('DATE_FORMAT', i.createdAt, '%Y-%m')
                        """)
        List<Object[]> getMonthlyRevenue(UUID shopId);
}
