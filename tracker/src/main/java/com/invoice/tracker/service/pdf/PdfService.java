// package com.invoice.tracker.service.pdf;

// import com.invoice.tracker.entity.invoice.InvoiceTemplate;
// import com.invoice.tracker.security.PrintTokenUtil;
// import com.microsoft.playwright.*;
// import com.microsoft.playwright.options.WaitUntilState;
// import com.microsoft.playwright.options.Margin;

// import lombok.RequiredArgsConstructor;

// import java.net.URLEncoder;
// import java.nio.charset.StandardCharsets;
// import java.util.List;
// import java.util.UUID;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;

// @Service
// @RequiredArgsConstructor
// public class PdfService {

//         private final PrintTokenUtil printTokenUtil;
//         private final BrowserManager browserManager;

//         @Value("${app.frontend.url}")
//         private String frontendUrl;

//         // ================= PDF GENERATION =================
//         public byte[] generateInvoicePdf(UUID invoiceId, UUID shopId, InvoiceTemplate template) {

//                 try (Playwright playwright = Playwright.create()) {

//                         Browser browser = playwright.chromium().launch(
//                                 new BrowserType.LaunchOptions()
//                                         .setHeadless(true)
//                                         .setArgs(List.of(
//                                                 "--no-sandbox",
//                                                 "--disable-setuid-sandbox",
//                                                 "--disable-dev-shm-usage",
//                                                 "--disable-gpu",
//                                                 "--disable-extensions",
//                                                 "--disable-background-networking",
//                                                 "--disable-background-timer-throttling",
//                                                 "--disable-renderer-backgrounding",
//                                                 "--disable-sync",
//                                                 "--mute-audio",
//                                                 "--hide-scrollbars")));

//                         BrowserContext context = browserManager.browser().newContext();

//                         Page page = context.newPage();

//                         try {

//                                 String token = printTokenUtil.generateToken(invoiceId, shopId);

//                                 String url = String.format(
//                                         "%s/pdf/%s?token=%s&template=%s",
//                                         frontendUrl,
//                                         invoiceId,
//                                         URLEncoder.encode(token, StandardCharsets.UTF_8),
//                                         template.name().toLowerCase()
//                                 );

//                                 // String url = frontendUrl
//                                 //                 + "/pdf/"
//                                 //                 + invoiceId
//                                 //                 + "?token="
//                                 //                 + URLEncoder.encode(token, StandardCharsets.UTF_8)
//                                 //                 + "&template="
//                                 //                 + URLEncoder.encode(template.name().toLowerCase(),
//                                 //                                 StandardCharsets.UTF_8);

//                                 System.out.println("====== CONTENT ======");
//                                 page.onConsoleMessage(msg -> System.out
//                                                 .println("BROWSER CONSOLE: " + msg.type() + " -> " + msg.text()));

//                                 page.onPageError(err -> System.out.println("PAGE ERROR: " + err));

//                                 page.onRequestFailed(req -> System.out
//                                                 .println("REQUEST FAILED: " + req.url() + " -> " + req.failure()));

//                                 page.onResponse(res -> {
//                                         if (res.status() >= 400) {
//                                                 System.out.println("HTTP " + res.status() + " -> " + res.url());
//                                         }
//                                 });

//                                 page.navigate(
//                                                 url,
//                                                 new Page.NavigateOptions()
//                                                                 .setWaitUntil(WaitUntilState.DOMCONTENTLOADED));

//                                 System.out.println(page.content());

//                                 page.navigate(url);

//                                 page.waitForFunction("() => window.__PDF_READY__ === true");

//                                 // page.waitForFunction("() => window.__PDF_READY__ === true");

//                                 System.out.println("====== URL ======");
//                                 System.out.println(page.url());

//                                 System.out.println("====== TITLE ======");
//                                 System.out.println(page.title());

//                                 System.out.println("STEP 1: Waiting for PDF_READY");

//                                 page.waitForFunction("() => window.__PDF_READY__ === true");

//                                 System.out.println("STEP 2: PDF_READY received");

//                                 byte[] pdf = page.pdf(
//                                                 new Page.PdfOptions()
//                                                                 .setFormat("A4")
//                                                                 .setPrintBackground(true)
//                                                                 .setMargin(
//                                                                         new Margin()
//                                                                                 .setTop("20px")
//                                                                                 .setBottom("20px")
//                                                                                 .setLeft("20px")
//                                                                                 .setRight("20px")));

//                                 System.out.println("STEP 3: PDF generated. Size = " + pdf.length);

//                                 return pdf;

//                         } finally {
//                                 page.close();
//                                 context.close();
//                         }

//                 } catch (Exception ex) {
//                         ex.printStackTrace();

//                         System.err.println("=================================");
//                         System.err.println("PDF GENERATION FAILED");
//                         System.err.println("Exception: " + ex.getClass().getName());
//                         System.err.println("Message: " + ex.getMessage());
//                         System.err.println("=================================");

//                         throw new RuntimeException("Failed to generate invoice PDF", ex);
//                 }
//         }
// }





package com.invoice.tracker.service.pdf;

import com.invoice.tracker.entity.invoice.InvoiceTemplate;
import com.invoice.tracker.security.PrintTokenUtil;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.Margin;
import com.microsoft.playwright.options.WaitUntilState;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final PrintTokenUtil printTokenUtil;
    private final BrowserManager browserManager;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    // ================= PDF GENERATION =================
    public byte[] generateInvoicePdf(
            UUID invoiceId,
            UUID shopId,
            InvoiceTemplate template) {

        BrowserContext context = browserManager.browser().newContext();
        Page page = context.newPage();

        try {

            // Faster timeout
            page.setDefaultTimeout(10000);

            String token = printTokenUtil.generateToken(invoiceId, shopId);

            String url = String.format(
                    "%s/pdf/%s?token=%s&template=%s",
                    frontendUrl,
                    invoiceId,
                    URLEncoder.encode(token, StandardCharsets.UTF_8),
                    template.name().toLowerCase()
            );

            // Navigate to invoice page
            page.navigate(
                    url,
                    new Page.NavigateOptions()
                            .setWaitUntil(WaitUntilState.DOMCONTENTLOADED)
            );

            // Wait until React finishes rendering
            page.waitForFunction("() => window.__PDF_READY__ === true");

            // Generate PDF
            return page.pdf(
                    new Page.PdfOptions()
                            .setFormat("A4")
                            .setPrintBackground(true)
                            .setMargin(
                                    new Margin()
                                            .setTop("20px")
                                            .setBottom("20px")
                                            .setLeft("20px")
                                            .setRight("20px")
                            )
            );

        } finally {
            page.close();
            context.close();
        }
    }
}