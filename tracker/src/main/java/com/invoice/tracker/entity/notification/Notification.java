package com.invoice.tracker.entity.notification;

import java.time.LocalDateTime;
import java.util.UUID;

import com.invoice.tracker.entity.invoice.Invoice;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String type;

    private String recipient;      // phone/email

    private String message;

    private boolean sent;
    private int retryCount;
    private LocalDateTime lastTriedAt;

    @Enumerated(EnumType.STRING)
    private NotificationStatus status;

    private LocalDateTime sentAt;

    @ManyToOne
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;
}
