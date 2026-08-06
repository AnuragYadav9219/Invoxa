package com.invoice.tracker.dto.feedback;

import com.invoice.tracker.entity.feedback.FeedbackCategory;
import com.invoice.tracker.entity.feedback.Recommendation;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequest {

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    @NotNull
    private FeedbackCategory category;

    @NotNull
    private Recommendation recommendation;

    @Size(max = 1000)
    private String liked;

    @Size(max = 1000)
    private String improvement;

    @Size(max = 100)
    private String name;

    @Size(max = 150)
    private String email;
}
