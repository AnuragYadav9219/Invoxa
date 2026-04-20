package com.invoice.tracker.entity.item;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.invoice.tracker.entity.AuditableEntity;
import com.invoice.tracker.entity.auth.Shop;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "items")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Item extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private Unit defaultUnit;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "item_units", joinColumns = @JoinColumn(name = "item_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "unit")
    private List<Unit> allowedUnits;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    // Soft delete
    @Builder.Default
    private boolean deleted = false;

    private LocalDateTime deletedAt;

    private UUID deletedBy;
}
