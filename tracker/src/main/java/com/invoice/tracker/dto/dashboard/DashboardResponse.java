package com.invoice.tracker.dto.dashboard;

import java.math.BigDecimal;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {

    @Builder.Default
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal totalPending = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal totalOverdue = BigDecimal.ZERO;

    private long totalInvoices;
    private long paidInvoices;
    private long pendingInvoices;
    private long partiallyPaidInvoices;
    private long overdueInvoices;

    private double revenueChangePercent;
    private Map<String, BigDecimal> monthlyRevenue;
}
