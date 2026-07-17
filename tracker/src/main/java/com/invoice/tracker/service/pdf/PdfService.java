// package com.invoice.tracker.service.pdf;

// import com.invoice.tracker.entity.invoice.InvoiceTemplate;
// import com.invoice.tracker.security.PrintTokenUtil;
// import com.microsoft.playwright.*;
// import com.microsoft.playwright.options.WaitUntilState;
// import com.microsoft.playwright.options.LoadState;
// import com.microsoft.playwright.options.Margin;

// import jakarta.annotation.PostConstruct;
// import jakarta.annotation.PreDestroy;
// import lombok.RequiredArgsConstructor;

// import java.net.URLEncoder;
// import java.nio.charset.StandardCharsets;
// import java.util.UUID;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;

// @Service
// @RequiredArgsConstructor
// public class PdfService {

//     private Playwright playwright;
//     private Browser browser;
//     private final PrintTokenUtil printTokenUtil;

//     @Value("${app.frontend.url}")
//     private String frontendUrl;

//     @PostConstruct
//     public void init() {
//         playwright = Playwright.create();

//         browser = playwright.chromium().launch(
//                 new BrowserType.LaunchOptions()
//                         .setHeadless(true));
//     }

//     @PreDestroy
//     public void shutdown() {
//         if (browser != null)
//             browser.close();
//         if (playwright != null)
//             playwright.close();
//     }

//     // ================= PDF GENERATION =================
//     public byte[] generateInvoicePdf(UUID invoiceId, UUID shopId, InvoiceTemplate template) {

//         BrowserContext context = browser.newContext(
//                 new Browser.NewContextOptions()
//                         .setViewportSize(1440, 2000));

//         Page page = context.newPage();

//         try {

//             String token = printTokenUtil.generateToken(invoiceId, shopId);

//             String url = frontendUrl
//                     + "/pdf/"
//                     + invoiceId
//                     + "?token="
//                     + URLEncoder.encode(token, StandardCharsets.UTF_8)
//                     + "&template="
//                     + URLEncoder.encode(template.name().toLowerCase(), StandardCharsets.UTF_8);

//             page.onConsoleMessage(msg -> System.out.println("[CONSOLE] " + msg.type() + " : " + msg.text()));

//             page.onPageError(err -> System.err.println("[PAGE ERROR] " + err));

//             page.onRequestFailed(request -> System.err.println("[REQUEST FAILED] "
//                     + request.url()
//                     + " -> "
//                     + request.failure()));

//             page.navigate(
//                     url,
//                     new Page.NavigateOptions()
//                             .setWaitUntil(WaitUntilState.DOMCONTENTLOADED));

//             page.waitForLoadState(LoadState.NETWORKIDLE);
//             page.waitForFunction("() => window.__PDF_READY__ === true");

//             System.out.println("PDF READY");

//             byte[] pdf = page.pdf(
//                     new Page.PdfOptions()
//                             .setFormat("A4")
//                             .setPrintBackground(true)
//                             .setPreferCSSPageSize(true)
//                             .setMargin(
//                                     new Margin()
//                                             .setTop("20px")
//                                             .setBottom("20px")
//                                             .setLeft("20px")
//                                             .setRight("20px")));

//             return pdf;

//         } catch (Exception ex) {

//             throw new RuntimeException("Failed to generate invoice PDF", ex);

//         } finally {

//             page.close();
//             context.close();
//         }
//     }
// }

package com.invoice.tracker.service.pdf;

import com.invoice.tracker.entity.invoice.InvoiceTemplate;
import com.invoice.tracker.security.PrintTokenUtil;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.WaitUntilState;
import com.microsoft.playwright.options.LoadState;
import com.microsoft.playwright.options.Margin;

import lombok.RequiredArgsConstructor;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final PrintTokenUtil printTokenUtil;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    // ================= PDF GENERATION =================
    public byte[] generateInvoicePdf(UUID invoiceId, UUID shopId, InvoiceTemplate template) {

        try (Playwright playwright = Playwright.create()) {

            Browser browser = playwright.chromium().launch(
                    new BrowserType.LaunchOptions()
                            .setHeadless(true));

            BrowserContext context = browser.newContext(
                    new Browser.NewContextOptions()
                            .setViewportSize(1440, 2000));

            Page page = context.newPage();

            try {

                String token = printTokenUtil.generateToken(invoiceId, shopId);

                String url = frontendUrl
                        + "/pdf/"
                        + invoiceId
                        + "?token="
                        + URLEncoder.encode(token, StandardCharsets.UTF_8)
                        + "&template="
                        + URLEncoder.encode(template.name().toLowerCase(), StandardCharsets.UTF_8);

                page.navigate(
                        url,
                        new Page.NavigateOptions()
                                .setWaitUntil(WaitUntilState.DOMCONTENTLOADED));

                System.out.println(page.content());

                page.waitForLoadState(LoadState.NETWORKIDLE);
                // page.waitForFunction("() => window.__PDF_READY__ === true");

                System.out.println("====== URL ======");
                System.out.println(page.url());
                        
                System.out.println("====== TITLE ======");
                System.out.println(page.title());
                        
                System.out.println("====== CONTENT ======");
                System.out.println(page.content());
                        
                page.screenshot(
                    new Page.ScreenshotOptions()
                        .setPath(java.nio.file.Paths.get("/tmp/pdf-debug.png"))
                        .setFullPage(true)
                );
                        
                page.waitForFunction(
                    "() => window.__PDF_READY__ === true",
                    new Page.WaitForFunctionOptions().setTimeout(60000)
                );

                return page.pdf(
                        new Page.PdfOptions()
                                .setFormat("A4")
                                .setPrintBackground(true)
                                .setPreferCSSPageSize(true)
                                .setMargin(
                                        new Margin()
                                                .setTop("20px")
                                                .setBottom("20px")
                                                .setLeft("20px")
                                                .setRight("20px")));

            } finally {
                page.close();
                context.close();
                browser.close();
            }

        } catch (Exception ex) {

            throw new RuntimeException("Failed to generate invoice PDF", ex);
        }
    }
}