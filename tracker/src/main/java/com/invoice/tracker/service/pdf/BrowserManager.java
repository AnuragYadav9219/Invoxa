package com.invoice.tracker.service.pdf;

import java.util.List;

import org.springframework.stereotype.Service;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Playwright;

import jakarta.annotation.PreDestroy;

@Service
public class BrowserManager {

    private final Playwright playwright;
    private final Browser browser;

    public BrowserManager() {

        playwright = Playwright.create();

        browser = playwright.chromium().launch(
                new BrowserType.LaunchOptions()
                        .setHeadless(true)
                        .setArgs(List.of(
                                "--no-sandbox",
                                "--disable-setuid-sandbox",
                                "--disable-dev-shm-usage",
                                "--disable-gpu",
                                "--disable-extensions",
                                "--disable-background-networking",
                                "--disable-sync",
                                "--mute-audio")));
    }

    public Browser browser() {
        return browser;
    }

    @PreDestroy
    public void shutdown() {
        browser.close();
        playwright.close();
    }
}
