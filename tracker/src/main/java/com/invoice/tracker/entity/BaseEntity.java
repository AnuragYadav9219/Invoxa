package com.invoice.tracker.entity;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private String createdAt;
}
