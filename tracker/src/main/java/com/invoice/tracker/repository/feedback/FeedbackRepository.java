package com.invoice.tracker.repository.feedback;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.feedback.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {

}
