package com.invoice.tracker.mapper;

import org.springframework.stereotype.Component;

import com.invoice.tracker.dto.feedback.FeedbackResponse;
import com.invoice.tracker.entity.feedback.Feedback;

@Component
public class FeedbackMapper {

    public FeedbackResponse toResponse(Feedback feedback) {

        return FeedbackResponse.builder()
                .id(feedback.getId())
                .rating(feedback.getRating())
                .category(feedback.getCategory())
                .recommendation(feedback.getRecommendation())
                .liked(feedback.getLiked())
                .improvement(feedback.getImprovement())
                .name(feedback.getName())
                .email(feedback.getEmail())
                .createdAt(feedback.getCreatedAt())
                .build();
    }

}
