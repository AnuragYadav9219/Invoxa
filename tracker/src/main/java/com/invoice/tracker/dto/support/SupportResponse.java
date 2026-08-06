package com.invoice.tracker.dto.support;

import java.time.LocalDateTime;
import java.util.UUID;

import com.invoice.tracker.entity.support.SupportType;
import com.invoice.tracker.entity.support.TicketStatus;

import lombok.Builder;
import lombok.Value;

@Builder
@Value
public class SupportResponse {
    
    private UUID id;

    private String ticketNumber;

    private SupportType type;

    private TicketStatus status;

    private String subject;

    private String message;

    private LocalDateTime createdAt;
}
