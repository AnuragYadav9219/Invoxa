package com.invoice.tracker.repository.invoice;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.invoice.InvoiceSequence;

public interface InvoiceSequenceRepository extends JpaRepository<InvoiceSequence, Long> {
    
}
