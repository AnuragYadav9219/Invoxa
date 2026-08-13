package com.invoice.tracker.service.dashboard;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.invoice.tracker.dto.dashboard.DashboardResponse;
import com.invoice.tracker.dto.dashboard.RevenueTrend;
import com.invoice.tracker.entity.invoice.InvoiceStatus;
import com.invoice.tracker.repository.invoice.InvoiceRepository;
import com.invoice.tracker.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final InvoiceRepository invoiceRepository;

    @Override
    public DashboardResponse getDashboard() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        RevenueMetrics revenueMetrics = getRevenueMetrics(shopId);

        InvoiceMetrics invoiceMetrics = getInvoiceMetrics(shopId);

        Map<String, BigDecimal> monthlyRevenue =
                getMonthlyRevenue(shopId);

        return DashboardResponse.builder()

                // ================= REVENUE =================

                .totalRevenue(revenueMetrics.totalRevenue())

                .totalPending(revenueMetrics.totalPending())

                .totalOverdue(revenueMetrics.totalOverdue())

                // ================= INVOICES =================

                .totalInvoices(invoiceMetrics.totalInvoices())

                .paidInvoices(invoiceMetrics.paidInvoices())

                .pendingInvoices(invoiceMetrics.pendingInvoices())

                .partiallyPaidInvoices(
                        invoiceMetrics.partiallyPaidInvoices())

                .overdueInvoices(
                        invoiceMetrics.overdueInvoices())

                // ================= CHART =================

                .monthlyRevenue(monthlyRevenue)

                .build();
    }

    // =========================================================
    // REVENUE TREND
    // =========================================================

    @Override
    public List<RevenueTrend> getRevenueTrend() {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        List<Object[]> result =
                invoiceRepository.getRevenueTrend(shopId);

        return result.stream()
                .map(row -> new RevenueTrend(
                        ((java.sql.Date) row[0]).toLocalDate(),
                        defaultZero((BigDecimal) row[1])
                ))
                .toList();
    }

    // =========================================================
    // REVENUE METRICS
    // =========================================================

    private RevenueMetrics getRevenueMetrics(UUID shopId) {

        return new RevenueMetrics(

                defaultZero(
                        invoiceRepository.getTotalRevenue(shopId)
                ),

                defaultZero(
                        invoiceRepository.getTotalPending(shopId)
                ),
                
                defaultZero(
                        invoiceRepository.getTotalOverdue(shopId)
                )
        );
    }

    // =========================================================
    // INVOICE METRICS
    // =========================================================

    private InvoiceMetrics getInvoiceMetrics(UUID shopId) {

        List<Object[]> rows =
                invoiceRepository.getInvoiceStatusCounts(shopId);

        long paid = 0;
        long pending = 0;
        long partiallyPaid = 0;
        long overdue = 0;

        for (Object[] row : rows) {

            InvoiceStatus status =
                    (InvoiceStatus) row[0];

            long count =
                    ((Number) row[1]).longValue();

            switch (status) {

                case PAID -> paid = count;

                case PENDING -> pending = count;

                case PARTIALLY_PAID ->
                        partiallyPaid = count;

                case OVERDUE -> overdue = count;
            }
        }

        long total =
                paid
                        + pending
                        + partiallyPaid
                        + overdue;

        return new InvoiceMetrics(
                total,
                paid,
                pending,
                partiallyPaid,
                overdue
        );
    }

    // =========================================================
    // MONTHLY REVENUE
    // =========================================================

    private Map<String, BigDecimal> getMonthlyRevenue(
            UUID shopId) {

        List<Object[]> rows =
                invoiceRepository.getMonthlyRevenue(shopId);

        Map<String, BigDecimal> revenue =
                new LinkedHashMap<>();

        for (Object[] row : rows) {

            String month = (String) row[0];

            BigDecimal amount =
                    defaultZero((BigDecimal) row[1]);

            revenue.put(month, amount);
        }

        return revenue;
    }

    // =========================================================
    // NULL SAFETY
    // =========================================================

    private BigDecimal defaultZero(BigDecimal value) {

        return value == null
                ? BigDecimal.ZERO
                : value;
    }

    // =========================================================
    // RECORDS
    // =========================================================

    private record RevenueMetrics(
            BigDecimal totalRevenue,
            BigDecimal totalPending,
            BigDecimal totalOverdue
    ) {
    }

    private record InvoiceMetrics(
            long totalInvoices,
            long paidInvoices,
            long pendingInvoices,
            long partiallyPaidInvoices,
            long overdueInvoices
    ) {
    }
}