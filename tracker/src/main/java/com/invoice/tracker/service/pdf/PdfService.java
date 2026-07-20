package com.invoice.tracker.service.pdf;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.invoice.tracker.entity.invoice.InvoiceTemplate;
import com.invoice.tracker.security.PrintTokenUtil;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.Margin;
import com.microsoft.playwright.options.Media;
import com.microsoft.playwright.options.WaitUntilState;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PdfService {

        private final PrintTokenUtil printTokenUtil;
        private final BrowserManager browserManager;

        @Value("${app.frontend.url}")
        private String frontendUrl;

        public byte[] generateInvoicePdf(
                        UUID invoiceId,
                        UUID shopId,
                        InvoiceTemplate template) {

                BrowserContext context = browserManager.browser().newContext();
                Page page = context.newPage();

                try {

                        page.setDefaultTimeout(90000);

                        page.onConsoleMessage(
                                        msg -> System.out.println("[Console] " + msg.type() + " : " + msg.text()));

                        page.onPageError(err -> System.out.println("[Page Error] " + err));

                        page.onRequestFailed(req -> System.out.println("[Request Failed] "
                                        + req.url()
                                        + " -> "
                                        + req.failure()));

                        page.onResponse(res -> {
                                if (res.status() >= 400) {
                                        System.out.println("[HTTP " + res.status() + "] " + res.url());
                                }
                        });

                        String token = printTokenUtil.generateToken(invoiceId, shopId);

                        String url = String.format(
                                        "%s/pdf.html?invoiceId=%s&token=%s&template=%s",
                                        frontendUrl,
                                        invoiceId,
                                        URLEncoder.encode(token, StandardCharsets.UTF_8),
                                        template.name().toLowerCase());

                        System.out.println("--------------------------------");
                        System.out.println("Opening:");
                        System.out.println(url);
                        System.out.println("--------------------------------");

                        long totalStart = System.currentTimeMillis();

                        page.exposeFunction("javaTime", args -> {
                                System.out.println(
                                                "Browser started JS after "
                                                                + (System.currentTimeMillis() - totalStart)
                                                                + " ms");
                                return null;
                        });

                        page.navigate(
                                        url,
                                        new Page.NavigateOptions()
                                                        .setWaitUntil(WaitUntilState.COMMIT)
                                                        .setTimeout(90000));

                        System.out.println("Navigate took: "
                                        + (System.currentTimeMillis() - totalStart) + " ms");

                        page.waitForFunction(
                                        "() => window.__PDF_READY__ === true",
                                        null,
                                        new Page.WaitForFunctionOptions()
                                                        .setTimeout(90000));

                        // allow browser to paint one more frame
                        page.evaluate("() => new Promise(requestAnimationFrame)");

                        System.out.println("Ready took: "
                                        + (System.currentTimeMillis() - totalStart) + " ms");

                        page.emulateMedia(
                                        new Page.EmulateMediaOptions()
                                                        .setMedia(Media.PRINT));

                        long pdfStart = System.currentTimeMillis();

                        byte[] pdf = page.pdf(
                                        new Page.PdfOptions()
                                                        .setFormat("A4")
                                                        .setPrintBackground(true)
                                                        .setMargin(
                                                                        new Margin()
                                                                                        .setTop("20px")
                                                                                        .setBottom("20px")
                                                                                        .setLeft("20px")
                                                                                        .setRight("20px")));

                        System.out.println("PDF took: "
                                        + (System.currentTimeMillis() - pdfStart) + " ms");

                        System.out.println("Total: "
                                        + (System.currentTimeMillis() - totalStart) + " ms");

                        return pdf;

                } finally {

                        try {
                                page.close();
                        } catch (Exception ignored) {
                        }

                        try {
                                context.close();
                        } catch (Exception ignored) {
                        }
                }
        }
}