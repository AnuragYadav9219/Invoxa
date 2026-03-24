package com.invoice.tracker.controller.dashboard;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.dto.dashboard.DashboardResponse;
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

        ApiResponse<DashboardResponse> response = ApiResponse.<DashboardResponse>builder()
                .success(true)
                .message("Dashboard data fetched successfully")
                .data(data)
                .build();

        return ResponseEntity.ok(response);
    }
}
