package com.invoice.tracker.util;

import java.time.Year;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.invoice.tracker.entity.invoice.InvoiceSequence;
import com.invoice.tracker.repository.invoice.InvoiceSequenceRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class InvoiceNumberGenerator {

    private final InvoiceSequenceRepository sequenceRepository;
    
    @Transactional
    public String generate() {

        InvoiceSequence seq = sequenceRepository.save(new InvoiceSequence());

        Long number = seq.getId();

        return "INV-" + Year.now().getValue() + "-" + String.format("%05d", number);
    }
}
