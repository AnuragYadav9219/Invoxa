package com.invoice.tracker.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.invoice.tracker.entity.subscription.PlanType;
import com.invoice.tracker.entity.templates.Template;
import com.invoice.tracker.repository.template.TemplateRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TemplateDataInitializer implements CommandLineRunner {

    private final TemplateRepository repository;

    @Override
    public void run(String... args) {

        if (repository.count() > 0) {
            return;
        }

        repository.saveAll(List.of(

                // =========================
                // FREE
                // =========================

                Template.builder()
                        .code("classic")
                        .name("Classic")
                        .description("A timeless layout designed for traditional business invoicing.")
                        .minimumPlan(PlanType.FREE)
                        .active(true)
                        .build(),

                Template.builder()
                        .code("modern")
                        .name("Modern")
                        .description("A clean, contemporary design with a minimal professional look.")
                        .minimumPlan(PlanType.FREE)
                        .active(true)
                        .build(),

                Template.builder()
                        .code("minimal")
                        .name("Minimal")
                        .description("A distraction-free layout focused on clarity and simplicity.")
                        .minimumPlan(PlanType.FREE)
                        .active(true)
                        .build(),

                // =========================
                // PRO
                // =========================

                Template.builder()
                        .code("corporate")
                        .name("Corporate")
                        .description("A polished business template ideal for companies and enterprises.")
                        .minimumPlan(PlanType.PRO)
                        .active(true)
                        .build(),

                Template.builder()
                        .code("vibrant")
                        .name("Vibrant")
                        .description("A colorful and energetic design that stands out instantly.")
                        .minimumPlan(PlanType.PRO)
                        .active(true)
                        .build(),

                Template.builder()
                        .code("sunrise")
                        .name("Sunrise")
                        .description("A warm and elegant theme inspired by soft sunrise tones.")
                        .minimumPlan(PlanType.PRO)
                        .active(true)
                        .build(),

                Template.builder()
                        .code("tropical")
                        .name("Tropical")
                        .description("A fresh tropical design with bright citrus-inspired colors.")
                        .minimumPlan(PlanType.PRO)
                        .active(true)
                        .build(),

                // =========================
                // BUSINESS
                // =========================

                Template.builder()
                        .code("cyberpunk")
                        .name("Cyberpunk")
                        .description("A futuristic dark theme featuring bold neon-inspired styling.")
                        .minimumPlan(PlanType.BUSINESS)
                        .active(true)
                        .build(),

                Template.builder()
                        .code("neonDark")
                        .name("Neon Dark")
                        .description("A premium dark interface enhanced with glowing neon accents.")
                        .minimumPlan(PlanType.BUSINESS)
                        .active(true)
                        .build(),

                Template.builder()
                        .code("neoBrutal")
                        .name("Neo Brutal")
                        .description("A bold brutalist design with high-contrast modern aesthetics.")
                        .minimumPlan(PlanType.BUSINESS)
                        .active(true)
                        .build(),

                Template.builder()
                        .code("rainbow")
                        .name("Playful Rainbow")
                        .description("A cheerful multi-color design perfect for creative businesses.")
                        .minimumPlan(PlanType.BUSINESS)
                        .active(true)
                        .build(),

                Template.builder()
                        .code("popRetro")
                        .name("Pop Retro")
                        .description("A nostalgic retro-inspired layout with vibrant vintage colors.")
                        .minimumPlan(PlanType.BUSINESS)
                        .active(true)
                        .build(),

                Template.builder()
                        .code("royal")
                        .name("Royal")
                        .description("A luxurious template featuring refined typography and premium styling.")
                        .minimumPlan(PlanType.BUSINESS)
                        .active(true)
                        .build()

        ));
    }
}