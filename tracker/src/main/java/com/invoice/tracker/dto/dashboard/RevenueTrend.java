package com.invoice.tracker.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueTrend {
    
    private LocalDate date;
    private BigDecimal revenue;
}
