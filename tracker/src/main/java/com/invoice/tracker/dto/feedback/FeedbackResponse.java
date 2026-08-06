package com.invoice.tracker.dto.feedback;

import java.time.LocalDateTime;
import java.util.UUID;

import com.invoice.tracker.entity.feedback.FeedbackCategory;
import com.invoice.tracker.entity.feedback.Recommendation;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FeedbackResponse {
    
    private UUID id;

    private Integer rating;

    private FeedbackCategory category;

    private Recommendation recommendation;

    private String liked;

    private String improvement;

    private String name;

    private String email;

    private LocalDateTime createdAt;
}
