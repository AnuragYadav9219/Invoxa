package com.invoice.tracker.entity.payment;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "payment_sequence", uniqueConstraints = @UniqueConstraint(columnNames = { "shop_id", "year_value" }))
@Getter
@Setter
public class PaymentSequence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shop_id", nullable = false, length = 36)
    private UUID shopId;

    @Column(name = "year_value")
    private int year;

    private long lastNumber;
}