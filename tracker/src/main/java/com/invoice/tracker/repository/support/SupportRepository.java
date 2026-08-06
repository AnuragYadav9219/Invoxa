package com.invoice.tracker.repository.support;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.support.SupportTicket;

public interface SupportRepository extends JpaRepository<SupportTicket, UUID> {
    
}
