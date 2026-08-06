package com.invoice.tracker.service.feedback;

import com.invoice.tracker.dto.feedback.FeedbackRequest;
import com.invoice.tracker.dto.feedback.FeedbackResponse;

public interface FeedbackService {
    
    FeedbackResponse submitFeedback(FeedbackRequest request);
}
