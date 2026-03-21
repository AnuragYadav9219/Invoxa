package com.invoice.tracker.service.dashboard;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.invoice.tracker.dto.dashboard.DashboardResponse;
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

        BigDecimal totalRevenue = invoiceRepository.getTotalRevenue(shopId);
        BigDecimal totalPending = invoiceRepository.getTotalPending(shopId);
        BigDecimal totalOverdue = invoiceRepository.getTotalOverdue(shopId);

        // Status counts
        List<Object[]> results = invoiceRepository.getInvoiceStatusCounts(shopId);

        long paid = 0, pending = 0, overdue = 0;

        for (Object[] row : results) {
            InvoiceStatus status = (InvoiceStatus) row[0];
            Long count = (Long) row[1];

            switch (status) {
                case PAID -> paid = count;
                case PENDING -> pending = count;
                case OVERDUE -> overdue = count;
            }
        }

        long totalInvoices = paid + pending + overdue;

        // Monthly revenue
        List<Object[]> monthlyData = invoiceRepository.getMonthlyRevenue(shopId);
        Map<String, BigDecimal> monthlyRevenue = new HashMap<>();

        for (Object[] row : monthlyData) {
            String month = (String) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            monthlyRevenue.put(month, amount);
        }

        return DashboardResponse.builder()
                .totalRevenue(totalRevenue)
                .totalPending(totalPending)
                .totalOverdue(totalOverdue)
                .totalInvoices(totalInvoices)
                .paidInvoices(paid)
                .pendingInvoices(pending)
                .overdueInvoices(overdue)
                .monthlyRevenue(monthlyRevenue)
                .build();
    }

}
