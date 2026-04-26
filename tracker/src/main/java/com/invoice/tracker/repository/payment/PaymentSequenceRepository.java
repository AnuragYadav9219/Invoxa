package com.invoice.tracker.repository.payment;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.invoice.tracker.entity.payment.PaymentSequence;

public interface PaymentSequenceRepository extends JpaRepository<PaymentSequence, Long> {

    @Modifying
    @Query(value = """
                INSERT INTO payment_sequence (shop_id, year_value, last_number)
                VALUES (:shopId, :year, 1)
                ON DUPLICATE KEY UPDATE last_number = LAST_INSERT_ID(last_number + 1)
            """, nativeQuery = true)
    void upsertAndIncrement(UUID shopId, int year);

    @Query(value = "SELECT LAST_INSERT_ID()", nativeQuery = true)
    long getLastInsertedNumber();
}