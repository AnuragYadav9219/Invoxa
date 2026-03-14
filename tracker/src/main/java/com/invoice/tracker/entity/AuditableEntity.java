package com.invoice.tracker.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public class AuditableEntity extends BaseEntity {
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
