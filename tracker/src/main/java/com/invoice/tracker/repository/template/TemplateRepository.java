package com.invoice.tracker.repository.template;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.invoice.tracker.entity.templates.Template;

public interface TemplateRepository extends JpaRepository<Template, UUID> {

  Optional<Template> findByCode(String code);

  List<Template> findByActiveTrueOrderByName();
}
