package com.invoice.tracker.dto.support;

import com.invoice.tracker.entity.support.SupportType;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SupportRequest {
    
    @NotNull
    private SupportType type;

    private String name;

    private String email;

    @NotNull
    private String subject;

    @NotNull
    private String message;
}
