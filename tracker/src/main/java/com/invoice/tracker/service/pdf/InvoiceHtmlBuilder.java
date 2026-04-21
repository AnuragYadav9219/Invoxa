package com.invoice.tracker.service.pdf;

import java.text.NumberFormat;
import java.util.Locale;

import org.springframework.stereotype.Component;

import com.invoice.tracker.dto.shop.ShopResponse;
import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.invoice.InvoiceItem;

@Component
public class InvoiceHtmlBuilder {

    public String build(Invoice invoice, ShopResponse shop, String email) {

        // return """
        // <!DOCTYPE html>
        // <html>
        // <head>
        // <meta charset="UTF-8"/>

        // <!-- Tailwind -->
        // <script src="https://cdn.tailwindcss.com"></script>

        // <!-- Font -->
        // <link
        // href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        // rel="stylesheet">

        // <style>
        // body {
        // font-family: 'Inter', sans-serif;
        // margin: 0;
        // padding: 0;
        // }
        // </style>

        // </head>

        // <body class="bg-slate-50">

        // <div class="max-w-[210mm] mx-auto bg-white shadow p-8">

        // <!-- HEADER -->
        // <div class="flex justify-between items-start">

        // <div>
        // <h1 class="text-2xl font-bold text-teal-600">%s</h1>
        // <p class="text-sm text-gray-600">%s</p>
        // <p class="text-sm text-gray-600">%s</p>
        // <p class="text-sm text-gray-600">%s</p>
        // </div>

        // <div class="text-right text-sm">
        // <p><b>Invoice:</b> #%s</p>
        // <p><b>Date:</b> %s</p>
        // <p><b>Due:</b> %s</p>
        // </div>

        // </div>

        // <!-- CUSTOMER -->
        // <div class="mt-6 text-right">
        // <h3 class="text-teal-600 font-semibold text-sm">CUSTOMER DETAILS</h3>
        // <p class="font-bold">%s</p>
        // <p>%s</p>
        // <p>%s</p>
        // </div>

        // <!-- TABLE -->
        // <table class="w-full mt-6 border border-gray-200">
        // <thead class="bg-teal-50 text-teal-700 text-sm">
        // <tr>
        // <th class="p-2 text-left">Item</th>
        // <th class="p-2 text-center">Qty</th>
        // <th class="p-2 text-right">Price</th>
        // <th class="p-2 text-right">Total</th>
        // </tr>
        // </thead>
        // <tbody>
        // %s
        // </tbody>
        // </table>

        // <!-- SUMMARY -->
        // <div class="mt-6 flex justify-end">
        // <div class="w-64 bg-gray-50 border rounded p-4 text-sm">

        // <div class="flex justify-between">
        // <span>Subtotal</span>
        // <span>%s</span>
        // </div>

        // <div class="flex justify-between text-green-600">
        // <span>Paid</span>
        // <span>+ %s</span>
        // </div>

        // <hr class="my-2"/>

        // <div class="flex justify-between font-bold text-red-600">
        // <span>Balance</span>
        // <span>%s</span>
        // </div>

        // </div>
        // </div>

        // <!-- FOOTER -->
        // <div class="mt-10 text-xs text-gray-500 flex justify-between">
        // <div>📞 %s</div>
        // <div>✉ %s</div>
        // <div>📍 %s</div>
        // </div>

        // </div>

        // </body>
        // </html>
        // """
        // .formatted(
        // shop.getShopName(),
        // shop.getOwnername(),
        // shop.getAddress(),
        // shop.getPhone(),

        // invoice.getInvoiceNumber(),
        // formatDate(invoice.getCreatedAt()),
        // formatDate(invoice.getDueDate()),

        // invoice.getCustomerName(),
        // invoice.getCustomerAddress(),
        // invoice.getCustomerPhone(),

        // buildItems(invoice),

        // formatCurrency(invoice.getTotalAmount()),
        // formatCurrency(invoice.getPaidAmount()),
        // formatCurrency(invoice.getRemainingAmount()),

        // shop.getPhone(),
        // email,
        // shop.getAddress());
        // }

        return """
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8"/>

                <script src="https://cdn.tailwindcss.com"></script>

                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

                <style>
                  body {
                    font-family: 'Inter', sans-serif;
                    margin: 0;
                    padding: 0;
                    background: #f1f5f9;
                  }

                  .a4 {
                    width: 210mm;
                    min-height: 297mm;
                    margin: auto;
                    background: white;
                  }
                </style>
                </head>

                <body>

                <div class="a4 p-10">

                  <!-- HEADER -->
                  <div class="flex justify-between items-start border-b pb-6">

                    <div>
                      <h1 class="text-3xl font-extrabold text-teal-600">%s</h1>
                      <p class="text-sm text-gray-600 mt-2">%s</p>
                      <p class="text-sm text-gray-600">%s</p>
                      <p class="text-sm text-gray-600">%s</p>
                    </div>

                    <div class="text-right">
                      <h2 class="text-xl font-bold text-gray-800">INVOICE</h2>
                      <p class="text-sm mt-2"><b>#%s</b></p>
                      <p class="text-sm text-gray-600">Date: %s</p>
                      <p class="text-sm text-gray-600">Due: %s</p>
                    </div>

                  </div>

                  <!-- CUSTOMER -->
                  <div class="mt-8 flex justify-between">

                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Bill To</p>
                      <p class="font-bold text-gray-800 mt-1">%s</p>
                      <p class="text-sm text-gray-600">%s</p>
                      <p class="text-sm text-gray-600">%s</p>
                    </div>

                  </div>

                  <!-- TABLE -->
                  <table class="w-full mt-8 border border-gray-200 rounded overflow-hidden">

                    <thead class="bg-teal-50 text-teal-700 text-sm">
                      <tr>
                        <th class="p-3 text-left">Item</th>
                        <th class="p-3 text-center">Qty</th>
                        <th class="p-3 text-right">Price</th>
                        <th class="p-3 text-right">Total</th>
                      </tr>
                    </thead>

                    <tbody class="text-sm">
                      %s
                    </tbody>

                  </table>

                  <!-- SUMMARY -->
                  <div class="mt-10 flex justify-between items-start">

                    <div class="text-sm text-teal-600 font-semibold">
                      THANK YOU FOR YOUR BUSINESS
                    </div>

                    <div class="w-72 bg-gray-50 border rounded-xl p-5 shadow-sm">

                      <div class="flex justify-between mb-2">
                        <span class="font-medium">Subtotal</span>
                        <span>%s</span>
                      </div>

                      <div class="flex justify-between text-green-600 font-semibold mb-2">
                        <span>Paid</span>
                        <span>+ %s</span>
                      </div>

                      <div class="border-t my-3"></div>

                      <div class="flex justify-between text-lg font-bold text-red-600">
                        <span>Balance</span>
                        <span>%s</span>
                      </div>

                    </div>

                  </div>

                  <!-- FOOTER -->
                  <div class="mt-16 pt-6 border-t text-xs text-gray-500 flex justify-between">

                    <div>📞 %s</div>
                    <div>✉ %s</div>
                    <div>📍 %s</div>

                  </div>

                </div>

                </body>
                </html>
                """
                .formatted(
                        shop.getShopName(),
                        shop.getOwnername(),
                        shop.getAddress(),
                        shop.getPhone(),

                        invoice.getInvoiceNumber(),
                        formatDate(invoice.getCreatedAt()),
                        formatDate(invoice.getDueDate()),

                        invoice.getCustomerName(),
                        invoice.getCustomerAddress(),
                        invoice.getCustomerPhone(),

                        buildItems(invoice),

                        formatCurrency(invoice.getTotalAmount()),
                        formatCurrency(invoice.getPaidAmount()),
                        formatCurrency(invoice.getRemainingAmount()),

                        shop.getPhone(),
                        email,
                        shop.getAddress());
    }

    private String buildItems(Invoice invoice) {
        StringBuilder rows = new StringBuilder();

        int i = 1;

        for (InvoiceItem item : invoice.getItems()) {
            rows.append("""
                        <tr>
                          <td class="p-2">%d. %s</td>
                          <td class="p-2 text-center">%s %s</td>
                          <td class="p-2 text-right">%s</td>
                          <td class="p-2 text-right">%s</td>
                        </tr>
                    """.formatted(
                    i++,
                    item.getItemName(),
                    item.getQuantity(),
                    formatUnit(item.getUnit()),
                    formatCurrency(item.getPrice()),
                    formatCurrency(item.getTotal())));
        }

        return rows.toString();
    }

    private String formatCurrency(Number amount) {
        return NumberFormat.getCurrencyInstance(new Locale("en", "IN"))
                .format(amount);
    }

    private String formatDate(Object date) {
        if (date == null)
            return "";
        return date.toString();
    }

    private String formatUnit(Object unit) {
        return switch (unit.toString()) {
            case "KG" -> "kg";
            case "PIECE" -> "pc";
            default -> unit.toString();
        };
    }
}