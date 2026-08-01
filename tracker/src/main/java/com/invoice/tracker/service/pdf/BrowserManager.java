package com.invoice.tracker.service.pdf;

import java.util.List;

import org.springframework.stereotype.Service;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Playwright;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class BrowserManager {

    private Playwright playwright;

    @PostConstruct
    public void init() {
        playwright = Playwright.create();
    }

    public Browser newBrowser() {
        return playwright.chromium().launch(
                new BrowserType.LaunchOptions()
                        .setHeadless(true)
                        .setArgs(List.of(
                                "--no-sandbox",
                                "--disable-dev-shm-usage",
                                "--disable-gpu",
                                "--disable-extensions",
                                "--disable-background-networking",
                                "--disable-sync",
                                "--disable-background-timer-throttling",
                                "--disable-renderer-backgrounding",
                                "--disable-ipc-flooding-protection")));
    }

    @PreDestroy
    public void shutdown() {
        if (playwright != null) {
            playwright.close();
        }
    }
}