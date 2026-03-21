package com.invoice.tracker.dto.dashboard;

import java.math.BigDecimal;
import java.util.Map;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardResponse {

    private BigDecimal totalRevenue;
    private BigDecimal totalPending;
    private BigDecimal totalOverdue;

    private long totalInvoices;
    private long paidInvoices;
    private long pendingInvoices;
    private long overdueInvoices;

    private Map<String, BigDecimal> monthlyRevenue;
}
