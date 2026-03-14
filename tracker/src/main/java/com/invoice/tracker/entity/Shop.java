package com.invoice.tracker.entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
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
    @GeneratedValue
    private UUID id;     // tenant_id

    private String shopName;

    private String ownerName;

    private String phone;

    private String address;
}
