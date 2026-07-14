package com.invoice.tracker.entity.auth;

import java.util.UUID;

import com.invoice.tracker.entity.AuditableEntity;
import com.invoice.tracker.entity.invoice.InvoiceTemplate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "shop")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Shop extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;     // tenant_id

    private String shopName;

    private String ownerName;

    private String phone;

    private String email;

    private String address;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceTemplate invoiceTemplate = InvoiceTemplate.CLASSIC;
}
