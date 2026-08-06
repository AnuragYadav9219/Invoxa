package com.invoice.tracker.controller.dashboard;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.dashboard.DashboardResponse;
import com.invoice.tracker.dto.dashboard.RevenueTrend;
import com.invoice.tracker.service.dashboard.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {

        DashboardResponse data = dashboardService.getDashboard();

        return ResponseBuilder.success(
                data,
                "Dashboard data fetched successfully");
    }

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/revenue-trend")
    public ResponseEntity<ApiResponse<List<RevenueTrend>>> revenueTrend(
            @RequestParam(defaultValue = "30") int days) {

        List<RevenueTrend> revenueTrend = dashboardService.getRevenueTrend();

        return ResponseBuilder.success(
                revenueTrend,
                "Revenue trend fetched successfully.");
    }
}
