// package com.invoice.tracker.service.pdf;

// import java.util.List;
// import java.util.concurrent.locks.ReentrantLock;

// import org.springframework.stereotype.Service;

// import com.microsoft.playwright.Browser;
// import com.microsoft.playwright.BrowserType;
// import com.microsoft.playwright.Playwright;

// import jakarta.annotation.PreDestroy;

// @Service
// public class BrowserManager {

// private final Playwright playwright;
// private Browser browser;

// private final ReentrantLock lock = new ReentrantLock();

// public BrowserManager() {
// playwright = Playwright.create();
// browser = createBrowser();
// }

// private Browser createBrowser() {
// System.out.println("Launching Chromium...");

// Browser browser = playwright.chromium().launch(
// new BrowserType.LaunchOptions()
// .setHeadless(true)
// .setArgs(List.of(
// "--no-sandbox",
// "--disable-setuid-sandbox",
// "--disable-dev-shm-usage",
// "--disable-gpu",
// "--disable-extensions",
// "--disable-background-networking",
// "--disable-sync",
// "--mute-audio",
// "--disable-features=site-per-process",
// "--disable-renderer-backgrounding",
// "--disable-background-timer-throttling",
// "--disable-backgrounding-occluded-windows",
// "--disable-ipc-flooding-protection")));

// browser.onDisconnected(b -> System.out.println("Chromium disconnected."));

// return browser;
// }

// public Browser browser() {

// lock.lock();

// try {

// if (browser == null || !browser.isConnected()) {
// System.out.println("Recreating Chromium...");
// browser = createBrowser();
// }

// return browser;

// } finally {
// lock.unlock();
// }
// }

// @PreDestroy
// public void shutdown() {

// if (browser != null && browser.isConnected()) {
// browser.close();
// }

// playwright.close();
// }
// }

package com.invoice.tracker.service.pdf;

import java.util.List;

import org.springframework.stereotype.Service;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Playwright;

import jakarta.annotation.PreDestroy;

@Service
public class BrowserManager {

    private volatile Playwright playwright;
    private volatile Browser browser;

    private final Object lock = new Object();

    public Browser browser() {

        Browser current = browser;

        if (current != null && current.isConnected()) {
            return current;
        }

        synchronized (lock) {

            current = browser;

            if (current != null && current.isConnected()) {
                return current;
            }

            if (playwright == null) {
                playwright = Playwright.create();
            }

            browser = playwright.chromium().launch(
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

            browser.onDisconnected(b -> {

                synchronized (lock) {
                    browser = null;
                }

            });

            return browser;
        }
    }

    @PreDestroy
    public void shutdown() {

        if (browser != null) {
            browser.close();
        }

        if (playwright != null) {
            playwright.close();
        }

    }

}