package com.invoice.tracker.controller.support;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;
import com.invoice.tracker.dto.support.SupportRequest;
import com.invoice.tracker.dto.support.SupportResponse;
import com.invoice.tracker.service.support.SupportService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/support")
public class SupportController {

    private final SupportService supportService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ApiResponse<SupportResponse>> createTicket(@Valid @RequestBody SupportRequest request) {

        return ResponseBuilder.success(
                supportService.createTicket(request),
                "Support ticket created successfully.");
    }
}
