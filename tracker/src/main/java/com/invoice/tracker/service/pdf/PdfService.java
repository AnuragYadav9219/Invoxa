package com.invoice.tracker.service.pdf;

import com.invoice.tracker.entity.invoice.InvoiceTemplate;
import com.invoice.tracker.security.PrintTokenUtil;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.WaitUntilState;
import com.microsoft.playwright.options.Margin;
import com.microsoft.playwright.options.Media;

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
        private final BrowserManager browserManager;

        @Value("${app.frontend.url}")
        private String frontendUrl;

        // ================= PDF GENERATION =================
        public byte[] generateInvoicePdf(UUID invoiceId, UUID shopId, InvoiceTemplate template) {

                BrowserContext context = browserManager.browser().newContext();

                Page page = context.newPage();

                try {

                        String token = printTokenUtil.generateToken(invoiceId, shopId);

                        String url = String.format(
                                        "%s/pdf/%s?token=%s&template=%s",
                                        frontendUrl,
                                        invoiceId,
                                        URLEncoder.encode(token, StandardCharsets.UTF_8),
                                        template.name().toLowerCase());

                        page.onRequest(request -> System.out
                                        .println("REQUEST: " + request.method() + " " + request.url()));

                        page.onResponse(response -> System.out
                                        .println("RESPONSE: " + response.status() + " " + response.url()));

                        page.onRequestFailed(request -> System.out
                                        .println("FAILED: " + request.failure() + " " + request.url()));

                        page.onConsoleMessage(msg -> System.out.println("CONSOLE [" + msg.type() + "]: " + msg.text()));

                        page.onPageError(err -> System.out.println("PAGE ERROR: " + err));

                        System.out.println("Opening: " + url);

                        page.navigate(
                                        url,
                                        new Page.NavigateOptions()
                                                        .setWaitUntil(WaitUntilState.DOMCONTENTLOADED));

                        System.out.println("DOM loaded");

                        page.waitForFunction(
                                        "() => window.__PDF_READY__ === true",
                                        null,
                                        new Page.WaitForFunctionOptions()
                                                        .setTimeout(30000));

                        System.out.println("PDF Ready");

                        page.waitForSelector("#invoice-root");

                        System.out.println("Invoice Root Found");

                        page.emulateMedia(
                                        new Page.EmulateMediaOptions()
                                                        .setMedia(Media.PRINT));

                        return page.pdf(
                                        new Page.PdfOptions()
                                                        .setFormat("A4")
                                                        .setPrintBackground(true)
                                                        .setMargin(
                                                                        new Margin()
                                                                                        .setTop("20px")
                                                                                        .setBottom("20px")
                                                                                        .setLeft("20px")
                                                                                        .setRight("20px")));

                } finally {
                        page.close();
                        context.close();
                }
        }
}