// package com.invoice.tracker.repository.invoice;

// import java.math.BigDecimal;
// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;
// import java.util.UUID;

// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.jpa.domain.Specification;
// import org.springframework.data.jpa.repository.EntityGraph;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
// import org.springframework.data.jpa.repository.Modifying;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.transaction.annotation.Transactional;

// import com.invoice.tracker.entity.invoice.Invoice;

// public interface InvoiceRepository extends JpaRepository<Invoice, UUID>, JpaSpecificationExecutor<Invoice> {

//         // ===================== BASIC =====================
//         @EntityGraph(attributePaths = { "items" })
//         Page<Invoice> findByShopId(UUID shopId, Pageable pageable);

//         Optional<Invoice> findByIdAndShopId(UUID id, UUID shopId);

//         List<Invoice> findByShopIdAndCustomerNameIgnoreCase(UUID shopId, String customerName);

//         List<Invoice> findByShopIdAndDeletedFalse(UUID shopId);

//         List<Invoice> findByShopIdAndDeletedTrue(UUID shopId);

//         List<Invoice> findByDeletedTrueAndDeletedAtBefore(LocalDateTime cutoff);

//         Optional<Invoice> findByIdAndShopIdAndDeletedFalse(UUID id, UUID shopId);

//         Optional<Invoice> findByPaymentToken(String paymentToken);

//         @Query("""
//                         SELECT i FROM Invoice i
//                         LEFT JOIN FETCH i.items
//                         WHERE i.shopId = :shopId AND i.deleted = true
//                         """)
//         List<Invoice> findDeletedInvoicesWithItems(UUID shopId);

//         @EntityGraph(attributePaths = "items")
//         Optional<Invoice> findById(UUID id);

//         @Query("""
//                             SELECT COUNT(DISTINCT LOWER(i.customerName))
//                             FROM Invoice i
//                             WHERE i.shopId = :shopId
//                               AND i.deleted = false
//                               AND i.customerName IS NOT NULL
//                               AND TRIM(i.customerName) <> ''
//                         """)
//         long countDistinctCustomers(@Param("shopId") UUID shopId);

//         @Query("""
//                             SELECT i FROM Invoice i
//                             LEFT JOIN FETCH i.items
//                             WHERE i.id = :id AND i.shopId = :shopId
//                         """)
//         Optional<Invoice> findByIdWithItems(UUID id, UUID shopId);

//         @EntityGraph(attributePaths = { "items" })
//         Page<Invoice> findAll(Specification<Invoice> spec,
//                         Pageable pageable);

//         @Query("""
//                             SELECT i FROM Invoice i
//                             LEFT JOIN FETCH i.items
//                             WHERE i.shopId = :shopId
//                             AND i.deleted = false
//                             ORDER BY i.createdAt DESC
//                         """)
//         List<Invoice> findRecentInvoicesWithItems(UUID shopId, Pageable pageable);

//         // ===================== BULK UPDATE =========================
//         @Modifying
//         @Transactional
//         @Query("""
//                         UPDATE Invoice i
//                         SET i.status = 'OVERDUE'
//                         WHERE i.dueDate < :today
//                         AND i.remainingAmount > 0
//                         AND i.status != 'PAID'
//                         """)
//         int markAllOverdue(LocalDate today);

//         // ====================== DASHBOARD ===================

//         // Total Revenue
//         @Query("""
//                         SELECT COALESCE(SUM(i.paidAmount), 0)
//                         FROM Invoice i
//                         WHERE i.shopId = :shopId
//                         AND i.deleted = false
//                         """)
//         BigDecimal getTotalRevenue(UUID shopId);

//         // Total Pending Amount
//         @Query("""
//                         SELECT COALESCE(SUM(i.remainingAmount), 0)
//                         FROM Invoice i
//                         WHERE i.shopId = :shopId
//                         AND i.deleted  = false
//                         AND i.status IN ('PENDING', 'PARTIALLY_PAID')
//                         """)
//         BigDecimal getTotalPending(UUID shopId);

//         // Total Overdue Amount
//         @Query("""
//                         SELECT COALESCE(SUM(i.remainingAmount), 0)
//                         FROM Invoice i
//                         WHERE i.shopId = :shopId
//                         AND i.deleted = false
//                         AND i.status = 'OVERDUE'
//                         """)
//         BigDecimal getTotalOverdue(UUID shopId);

//         // Count by status
//         @Query("""
//                         SELECT i.status, COUNT(i)
//                         FROM Invoice i
//                         WHERE i.shopId = :shopId
//                         AND i.deleted = false
//                         GROUP BY i.status
//                         """)
//         List<Object[]> getInvoiceStatusCounts(UUID shopId);

//         // Monthly Revenue (PAID only)
//         @Query("""
//                         SELECT FUNCTION('DATE_FORMAT', i.createdAt,'%Y-%m'),
//                                SUM(i.paidAmount)
//                         FROM Invoice i
//                         WHERE i.shopId=:shopId
//                           AND i.deleted=false
//                           AND i.status='PAID'
//                         GROUP BY FUNCTION('DATE_FORMAT', i.createdAt,'%Y-%m')
//                         ORDER BY FUNCTION('DATE_FORMAT', i.createdAt,'%Y-%m')
//                         """)
//         List<Object[]> getMonthlyRevenue(UUID shopId);

//         @Query("""
//                         SELECT COALESCE(SUM(i.paidAmount), 0)
//                         FROM Invoice i
//                         WHERE i.shopId = :shopId
//                           AND i.deleted = false
//                           AND i.createdAt >= :start
//                           AND i.createdAt < :end
//                         """)
//         BigDecimal getRevenueBetween(
//                         @Param("shopId") UUID shopId,
//                         @Param("start") LocalDateTime start,
//                         @Param("end") LocalDateTime end);
// }

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

public interface InvoiceRepository extends JpaRepository<Invoice, UUID>, JpaSpecificationExecutor<Invoice> {

  // ===================== BASIC =====================
  Page<Invoice> findByShopId(UUID shopId, Pageable pageable);

  Optional<Invoice> findByIdAndShopId(UUID id, UUID shopId);

  List<Invoice> findByShopIdAndCustomerNameIgnoreCase(UUID shopId, String customerName);

  List<Invoice> findByShopIdAndDeletedFalse(UUID shopId);

  List<Invoice> findByShopIdAndDeletedTrue(UUID shopId);

  List<Invoice> findByDeletedTrueAndDeletedAtBefore(LocalDateTime cutoff);

  Optional<Invoice> findByIdAndShopIdAndDeletedFalse(UUID id, UUID shopId);

  Optional<Invoice> findByPaymentToken(String paymentToken);

  @Query("""
      SELECT i FROM Invoice i
      LEFT JOIN FETCH i.items
      WHERE i.shopId = :shopId AND i.deleted = true
      """)
  List<Invoice> findDeletedInvoicesWithItems(UUID shopId);

  Optional<Invoice> findById(UUID id);

  @Query("""
          SELECT COUNT(DISTINCT LOWER(i.customerName))
          FROM Invoice i
          WHERE i.shopId = :shopId
            AND i.deleted = false
            AND i.customerName IS NOT NULL
            AND TRIM(i.customerName) <> ''
      """)
  long countDistinctCustomers(@Param("shopId") UUID shopId);

  @Query("""
          SELECT i FROM Invoice i
          LEFT JOIN FETCH i.items
          WHERE i.id = :id AND i.shopId = :shopId
      """)
  Optional<Invoice> findByIdWithItems(UUID id, UUID shopId);

  @Override
  Page<Invoice> findAll(Specification<Invoice> spec,
      Pageable pageable);

  @Query("""
      SELECT i
      FROM Invoice i
      WHERE i.shopId=:shopId
      AND i.deleted=false
      ORDER BY i.createdAt DESC
      """)
  List<Invoice> findRecentInvoices(UUID shopId, Pageable pageable);

  // ===================== BULK UPDATE =========================
  @Modifying
  @Transactional
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
      SELECT COALESCE(SUM(i.paidAmount), 0)
      FROM Invoice i
      WHERE i.shopId = :shopId
      AND i.deleted = false
      """)
  BigDecimal getTotalRevenue(UUID shopId);

  // Total Pending Amount
  @Query("""
      SELECT COALESCE(SUM(i.remainingAmount), 0)
      FROM Invoice i
      WHERE i.shopId = :shopId
      AND i.deleted  = false
      AND i.status IN ('PENDING', 'PARTIALLY_PAID')
      """)
  BigDecimal getTotalPending(UUID shopId);

  // Total Overdue Amount
  @Query("""
      SELECT COALESCE(SUM(i.remainingAmount), 0)
      FROM Invoice i
      WHERE i.shopId = :shopId
      AND i.deleted = false
      AND i.status = 'OVERDUE'
      """)
  BigDecimal getTotalOverdue(UUID shopId);

  // Count by status
  @Query("""
      SELECT i.status, COUNT(i)
      FROM Invoice i
      WHERE i.shopId = :shopId
      AND i.deleted = false
      GROUP BY i.status
      """)
  List<Object[]> getInvoiceStatusCounts(UUID shopId);

  // Monthly Revenue (PAID only)
  @Query("""
      SELECT FUNCTION('DATE_FORMAT', i.createdAt,'%Y-%m'),
             SUM(i.paidAmount)
      FROM Invoice i
      WHERE i.shopId=:shopId
        AND i.deleted=false
        AND i.status='PAID'
      GROUP BY FUNCTION('DATE_FORMAT', i.createdAt,'%Y-%m')
      ORDER BY FUNCTION('DATE_FORMAT', i.createdAt,'%Y-%m')
      """)
  List<Object[]> getMonthlyRevenue(UUID shopId);

  @Query("""
      SELECT COALESCE(SUM(i.paidAmount), 0)
      FROM Invoice i
      WHERE i.shopId = :shopId
        AND i.deleted = false
        AND i.createdAt >= :start
        AND i.createdAt < :end
      """)
  BigDecimal getRevenueBetween(
      @Param("shopId") UUID shopId,
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);
}
