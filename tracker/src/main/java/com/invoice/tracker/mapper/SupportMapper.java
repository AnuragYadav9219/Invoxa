package com.invoice.tracker.mapper;

import org.springframework.stereotype.Component;

import com.invoice.tracker.dto.support.SupportResponse;
import com.invoice.tracker.entity.support.SupportTicket;

@Component
public class SupportMapper {

    public SupportResponse toResponse(SupportTicket ticket) {

        return SupportResponse.builder()
                .id(ticket.getId())
                .ticketNumber(ticket.getTicketNumber())
                .status(ticket.getStatus())
                .type(ticket.getType())
                .subject(ticket.getSubject())
                .message(ticket.getMessage())
                .createdAt(ticket.getCreatedAt())
                .build();
    }
}
