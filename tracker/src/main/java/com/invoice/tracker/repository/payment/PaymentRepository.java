package com.invoice.tracker.repository.payment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.invoice.tracker.entity.payment.Payment;

public interface PaymentRepository extends JpaRepository<Payment, UUID>, JpaSpecificationExecutor<Payment> {

    List<Payment> findByInvoiceIdAndDeletedFalseOrderByCreatedAtDesc(UUID invoiceId);

    Page<Payment> findByInvoiceShopIdAndDeletedFalse(UUID shopId, Pageable pageable);

    List<Payment> findByInvoiceShopIdAndDeletedFalse(UUID shopId);

    List<Payment> findByInvoiceShopIdAndDeletedTrue(UUID shopId);

    List<Payment> findByInvoiceIdAndDeletedFalse(UUID invoiceId);

    List<Payment> findByInvoiceIdAndDeletedTrue(UUID invoiceId);

    List<Payment> findByDeletedTrueAndDeletedAtBefore(LocalDateTime cutoff);

    Optional<Payment> findByIdAndInvoiceShopIdAndDeletedFalse(UUID id, UUID shopId);

    long countByInvoiceShopId(UUID shopId);
}
