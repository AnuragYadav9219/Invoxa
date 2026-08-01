package com.invoice.tracker.entity.templates;

import java.util.UUID;

import com.invoice.tracker.entity.subscription.PlanType;

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
@Table(name = "templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code; // CLASSIC, MODERN, MINIMAL...

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanType minimumPlan;

    @Column(length = 500)
    private String description;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;
}