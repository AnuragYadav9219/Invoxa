package com.invoice.tracker.repository.invoice;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.entity.invoice.Invoice;

public interface InvoiceRepository
        extends JpaRepository<Invoice, UUID>,
                JpaSpecificationExecutor<Invoice> {

    // =========================================================
    // BASIC
    // =========================================================

    Page<Invoice> findByShopId(
            UUID shopId,
            Pageable pageable
    );

    long countByShopIdAndDeletedFalse(
            UUID shopId
    );

    Optional<Invoice> findByIdAndShopId(
            UUID id,
            UUID shopId
    );

    List<Invoice> findByShopIdAndCustomerNameIgnoreCase(
            UUID shopId,
            String customerName
    );

    List<Invoice> findByShopIdAndDeletedFalse(
            UUID shopId
    );

    List<Invoice> findByShopIdAndDeletedTrue(
            UUID shopId
    );

    List<Invoice> findByDeletedTrueAndDeletedAtBefore(
            LocalDateTime cutoff
    );

    Optional<Invoice> findByIdAndShopIdAndDeletedFalse(
            UUID id,
            UUID shopId
    );

    Optional<Invoice> findByPaymentToken(
            String paymentToken
    );

    // =========================================================
    // DELETED INVOICES WITH ITEMS
    // =========================================================

    @Query("""
            SELECT i
            FROM Invoice i
            LEFT JOIN FETCH i.items
            WHERE i.shopId = :shopId
              AND i.deleted = true
            """)
    List<Invoice> findDeletedInvoicesWithItems(
            @Param("shopId") UUID shopId
    );

    // =========================================================
    // FIND BY ID
    // =========================================================

    Optional<Invoice> findById(
            UUID id
    );

    // =========================================================
    // CUSTOMER COUNT
    // =========================================================

    @Query("""
            SELECT COUNT(DISTINCT LOWER(i.customerName))
            FROM Invoice i
            WHERE i.shopId = :shopId
              AND i.deleted = false
              AND i.customerName IS NOT NULL
              AND TRIM(i.customerName) <> ''
            """)
    long countDistinctCustomers(
            @Param("shopId") UUID shopId
    );

    // =========================================================
    // CUSTOMER COUNT BY PHONE
    // =========================================================

    @Query("""
            SELECT COUNT(DISTINCT i.customerPhone)
            FROM Invoice i
            WHERE i.shopId = :shopId
              AND i.deleted = false
              AND i.customerPhone IS NOT NULL
              AND TRIM(i.customerPhone) <> ''
            """)
    long countDistinctCustomersByPhone(
            @Param("shopId") UUID shopId
    );

    // =========================================================
    // FIND INVOICE WITH ITEMS
    // =========================================================

    @Query("""
            SELECT i
            FROM Invoice i
            LEFT JOIN FETCH i.items
            WHERE i.id = :id
              AND i.shopId = :shopId
            """)
    Optional<Invoice> findByIdWithItems(
            @Param("id") UUID id,
            @Param("shopId") UUID shopId
    );

    // =========================================================
    // SPECIFICATION SEARCH
    // =========================================================

    @Override
    Page<Invoice> findAll(
            Specification<Invoice> spec,
            Pageable pageable
    );

    // =========================================================
    // RECENT INVOICES
    // =========================================================

    @Query("""
            SELECT i
            FROM Invoice i
            WHERE i.shopId = :shopId
              AND i.deleted = false
            ORDER BY i.createdAt DESC
            """)
    List<Invoice> findRecentInvoices(
            @Param("shopId") UUID shopId,
            Pageable pageable
    );

    // =========================================================
    // BULK UPDATE
    // =========================================================

    @Modifying
    @Transactional
    @Query("""
            UPDATE Invoice i
            SET i.status = 'OVERDUE'
            WHERE i.dueDate < :today
              AND i.remainingAmount > 0
              AND i.status != 'PAID'
            """)
    int markAllOverdue(
            @Param("today") LocalDate today
    );

    // =========================================================
    // ===================== DASHBOARD ==========================
    // =========================================================
    //
    // IMPORTANT:
    //
    // Dashboard metrics are ALL-TIME for the current shop.
    //
    // We intentionally DO NOT use:
    //
    //     i.createdAt >= :startDate
    //
    // here.
    //
    // This means:
    //
    // Shop registered
    //       ↓
    // First invoice
    //       ↓
    // More invoices
    //       ↓
    // Today
    //
    // Everything is included.
    //
    // =========================================================


    // =========================================================
    // TOTAL REVENUE
    // =========================================================
    //
    // Revenue means money actually collected.
    //
    // We use paidAmount instead of totalAmount.
    //
    // Example:
    //
    // Invoice total  = ₹10,000
    // Paid amount    = ₹4,000
    // Remaining      = ₹6,000
    //
    // Revenue = ₹4,000
    //
    // This also works correctly with partially paid invoices.
    // =========================================================

    @Query("""
            SELECT COALESCE(SUM(i.paidAmount), 0)
            FROM Invoice i
            WHERE i.shopId = :shopId
              AND i.deleted = false
            """)
    BigDecimal getTotalRevenue(
            @Param("shopId") UUID shopId
    );


    // =========================================================
    // TOTAL PENDING AMOUNT
    // =========================================================
    //
    // Includes:
    //
    // PENDING
    // PARTIALLY_PAID
    //
    // remainingAmount is the amount still owed.
    // =========================================================

    @Query("""
            SELECT COALESCE(SUM(i.remainingAmount), 0)
            FROM Invoice i
            WHERE i.shopId = :shopId
              AND i.deleted = false
              AND i.status IN (
                  com.invoice.tracker.entity.invoice.InvoiceStatus.PENDING,
                  com.invoice.tracker.entity.invoice.InvoiceStatus.PARTIALLY_PAID
              )
            """)
    BigDecimal getTotalPending(
            @Param("shopId") UUID shopId
    );


    // =========================================================
    // TOTAL OVERDUE AMOUNT
    // =========================================================
    //
    // Only unpaid overdue amount is counted.
    // =========================================================

    @Query("""
            SELECT COALESCE(SUM(i.remainingAmount), 0)
            FROM Invoice i
            WHERE i.shopId = :shopId
              AND i.deleted = false
              AND i.status =
                  com.invoice.tracker.entity.invoice.InvoiceStatus.OVERDUE
            """)
    BigDecimal getTotalOverdue(
            @Param("shopId") UUID shopId
    );


    // =========================================================
    // INVOICE STATUS COUNTS
    // =========================================================
    //
    // Counts ALL invoices for this shop.
    //
    // No date filter.
    // =========================================================

    @Query("""
            SELECT i.status,
                   COUNT(i)
            FROM Invoice i
            WHERE i.shopId = :shopId
              AND i.deleted = false
            GROUP BY i.status
            """)
    List<Object[]> getInvoiceStatusCounts(
            @Param("shopId") UUID shopId
    );


    // =========================================================
    // MONTHLY REVENUE
    // =========================================================
    //
    // Complete revenue history.
    //
    // Example:
    //
    // Jan 2026 -> ₹20,000
    // Feb 2026 -> ₹35,000
    // Mar 2026 -> ₹42,000
    // Apr 2026 -> ₹51,000
    //
    // No 30-day limitation.
    //
    // Revenue is based on paidAmount.
    // =========================================================

    @Query("""
            SELECT
                FUNCTION(
                    'DATE_FORMAT',
                    i.createdAt,
                    '%b %Y'
                ),
                COALESCE(SUM(i.paidAmount), 0)
            FROM Invoice i
            WHERE i.shopId = :shopId
              AND i.deleted = false
            GROUP BY FUNCTION(
                'DATE_FORMAT',
                i.createdAt,
                '%b %Y'
            )
            ORDER BY MIN(i.createdAt)
            """)
    List<Object[]> getMonthlyRevenue(
            @Param("shopId") UUID shopId
    );


    // =========================================================
    // DAILY REVENUE HISTORY
    // =========================================================
    //
    // Complete daily revenue history.
    //
    // Example:
    //
    // 2026-08-01 -> ₹5,000
    // 2026-08-02 -> ₹2,500
    // 2026-08-03 -> ₹8,000
    //
    // No startDate.
    //
    // This is useful for the revenue trend chart.
    // =========================================================

    @Query("""
            SELECT
                FUNCTION('DATE', i.createdAt),
                COALESCE(SUM(i.paidAmount), 0)
            FROM Invoice i
            WHERE i.shopId = :shopId
              AND i.deleted = false
            GROUP BY FUNCTION('DATE', i.createdAt)
            ORDER BY FUNCTION('DATE', i.createdAt)
            """)
    List<Object[]> getRevenueTrend(
            @Param("shopId") UUID shopId
    );

}