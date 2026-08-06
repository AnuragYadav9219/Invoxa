package com.invoice.tracker.entity.feedback;

import java.util.UUID;

import com.invoice.tracker.entity.AuditableEntity;
import com.invoice.tracker.entity.auth.Shop;
import com.invoice.tracker.entity.auth.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "feedback")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Feedback extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String email;

    @Column(nullable = false)
    private Integer rating;

    @Enumerated(EnumType.STRING)
    private FeedbackCategory category;

    @Enumerated(EnumType.STRING)
    private Recommendation recommendation;

    @Column(length = 1000)
    private String liked;

    @Column(length = 1000)
    private String improvement;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private Shop shop;
}
