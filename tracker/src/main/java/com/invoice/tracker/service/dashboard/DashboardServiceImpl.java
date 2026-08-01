package com.invoice.tracker.service.dashboard;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    public DashboardResponse getDashboard(int days) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        LocalDateTime startDate = getStartDate(days);

        RevenueMetrics revenueMetrics = getRevenueMetrics(shopId, startDate);

        InvoiceMetrics invoiceMetrics = getInvoiceMetrics(shopId, startDate);

        double revenueChange = calculateRevenueTrend(shopId, days);

        Map<String, BigDecimal> monthlyRevenue = getMonthlyRevenue(shopId, startDate);

        return DashboardResponse.builder()
                .totalRevenue(revenueMetrics.totalRevenue())
                .totalPending(revenueMetrics.totalPending())
                .totalOverdue(revenueMetrics.totalOverdue())

                .totalInvoices(invoiceMetrics.totalInvoices())
                .paidInvoices(invoiceMetrics.paidInvoices())
                .pendingInvoices(invoiceMetrics.pendingInvoices())
                .partiallyPaidInvoices(invoiceMetrics.partiallyPaidInvoices())
                .overdueInvoices(invoiceMetrics.overdueInvoices())

                .monthlyRevenue(monthlyRevenue)
                .revenueChangePercent(revenueChange)
                .build();
    }

    // =================== REVENUE TREND ===================

    @Override
    public List<RevenueTrend> getRevenueTrend(int days) {

        UUID shopId = SecurityUtils.getCurrentUserShopId();

        LocalDateTime start = getStartDate(days);

        List<Object[]> result = invoiceRepository.getRevenueTrend(shopId, start);

        return result.stream()
                .map(row -> new RevenueTrend(
                        ((java.sql.Date) row[0]).toLocalDate(),
                        defaultZero((BigDecimal) row[1])))
                .toList();
    }

    // ===================== PRIVATE METHODS =======================

    private RevenueMetrics getRevenueMetrics(UUID shopId, LocalDateTime startDate) {

        return new RevenueMetrics(
                defaultZero(invoiceRepository.getTotalRevenue(shopId, startDate)),
                defaultZero(invoiceRepository.getTotalPending(shopId, startDate)),
                defaultZero(invoiceRepository.getTotalOverdue(shopId, startDate)));
    }

    private InvoiceMetrics getInvoiceMetrics(UUID shopId, LocalDateTime startDate) {

        List<Object[]> rows = invoiceRepository.getInvoiceStatusCounts(shopId, startDate);

        long paid = 0;
        long pending = 0;
        long partiallyPaid = 0;
        long overdue = 0;

        for (Object[] row : rows) {

            InvoiceStatus status = (InvoiceStatus) row[0];
            long count = ((Number) row[1]).longValue();

            switch (status) {
                case PAID -> paid = count;
                case PENDING -> pending = count;
                case PARTIALLY_PAID -> partiallyPaid = count;
                case OVERDUE -> overdue = count;
            }
        }

        return new InvoiceMetrics(
                paid + pending + partiallyPaid + overdue,
                paid,
                pending,
                partiallyPaid,
                overdue);
    }

    private double calculateRevenueTrend(UUID shopId, int days) {

        LocalDateTime endDate = LocalDateTime.now();

        LocalDateTime currentStart = endDate.minusDays(days);

        LocalDateTime previousStart = currentStart.minusDays(days);

        BigDecimal currentRevenue = defaultZero(
                invoiceRepository.getRevenueBetween(
                        shopId,
                        currentStart,
                        endDate));

        BigDecimal previousRevenue = defaultZero(
                invoiceRepository.getRevenueBetween(
                        shopId,
                        previousStart,
                        currentStart));

        if (previousRevenue.compareTo(BigDecimal.ZERO) <= 0) {
            return currentRevenue.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }

        return currentRevenue
                .subtract(previousRevenue)
                .multiply(BigDecimal.valueOf(100))
                .divide(previousRevenue, 2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private Map<String, BigDecimal> getMonthlyRevenue(
            UUID shopId,
            LocalDateTime startDate) {

        List<Object[]> rows = invoiceRepository.getMonthlyRevenue(shopId, startDate);

        Map<String, BigDecimal> revenue = new LinkedHashMap<>();

        for (Object[] row : rows) {

            revenue.put(
                    (String) row[0],
                    defaultZero((BigDecimal) row[1]));
        }

        return revenue;
    }

    private LocalDateTime getStartDate(int days) {

        return LocalDate.now()
                .minusDays(days)
                .atStartOfDay();
    }

    private BigDecimal defaultZero(BigDecimal value) {

        return value == null ? BigDecimal.ZERO : value;
    }

    // ===================== RECORDS =======================

    private record RevenueMetrics(
            BigDecimal totalRevenue,
            BigDecimal totalPending,
            BigDecimal totalOverdue) {
    }

    private record InvoiceMetrics(
            long totalInvoices,
            long paidInvoices,
            long pendingInvoices,
            long partiallyPaidInvoices,
            long overdueInvoices) {
    }
}