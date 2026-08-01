package com.invoice.tracker.service.dashboard;

import java.util.List;

import com.invoice.tracker.dto.dashboard.DashboardResponse;
import com.invoice.tracker.dto.dashboard.RevenueTrend;

public interface DashboardService {
    
    DashboardResponse getDashboard(int days);

    List<RevenueTrend> getRevenueTrend(int days);
}
