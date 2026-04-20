package com.invoice.tracker.repository.payment;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import com.invoice.tracker.entity.payment.PaymentSequence;

import jakarta.persistence.LockModeType;

public interface PaymentSequenceRepository extends JpaRepository<PaymentSequence, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<PaymentSequence> findByShopIdAndYear(UUID shopId, int year);
}