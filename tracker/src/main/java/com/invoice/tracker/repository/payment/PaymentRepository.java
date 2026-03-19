package com.invoice.tracker.repository.payment;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.payment.Payment;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    
    List<Payment> findByInvoiceIdOrderByCreatedAtDesc(UUID invoiceId);
}
