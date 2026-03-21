package com.invoice.tracker.service.pdf;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.invoice.tracker.entity.invoice.Invoice;
import com.invoice.tracker.entity.invoice.InvoiceItem;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.ColumnText;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfGState;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class PdfService {

    // ==================== GENERATE PDF ========================
    public byte[] generateInvoicePdf(Invoice invoice) {

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Document document = new Document(PageSize.A4, 36, 36, 54, 36);
            PdfWriter writer = PdfWriter.getInstance(document, out);

            document.open();

            // Watermark
            if (invoice.getStatus() != null) {
                switch (invoice.getStatus()) {
                    case PAID:
                        addWatermark(writer, "PAID", new Color(46, 204, 113));
                        break;

                    case OVERDUE:
                        addWatermark(writer, "OVERDUE", new Color(231, 76, 60));
                        break;

                    default:
                        break;
                }
            }

            // Title
            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            // Invoice Details
            document.add(new Paragraph("Invoice No: " + invoice.getInvoiceNumber()));
            document.add(new Paragraph("Customer: " + invoice.getCustomerName()));
            document.add(new Paragraph("Phone: " + invoice.getCustomerPhone()));
            document.add(new Paragraph("Status: " + invoice.getStatus()));
            document.add(new Paragraph("Due Date: " +
                    (invoice.getDueDate() != null
                            ? invoice.getDueDate().format(DateTimeFormatter.ISO_DATE)
                            : "N/A")));

            document.add(new Paragraph("\n"));

            // Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setSpacingAfter(10);

            table.setWidths(new float[] { 3, 1, 2, 2 });

            // Headers
            addHeader(table, "Item");
            addHeader(table, "Qty");
            addHeader(table, "Price");
            addHeader(table, "Total");

            // Rows
            boolean isEven = true;

            for (InvoiceItem item : invoice.getItems()) {

                Color bgColor = isEven ? new Color(245, 245, 245) : Color.WHITE;

                table.addCell(createCell(item.getItemName(), bgColor));
                table.addCell(createCell(String.valueOf(item.getQuantity()), bgColor));
                table.addCell(createCell("₹ " + item.getPrice(), bgColor));
                table.addCell(createCell("₹ " + item.getTotal(), bgColor));

                isEven = !isEven;
            }

            document.add(table);

            // Total
            Font totalFont = new Font(Font.HELVETICA, 14, Font.BOLD);
            Paragraph total = new Paragraph("Total Amount: ₹ " + invoice.getTotalAmount(), totalFont);
            total.setAlignment(Element.ALIGN_RIGHT);
            total.setSpacingBefore(10);
            document.add(total);

            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    // =================== HEADER ======================
    private void addHeader(PdfPTable table, String title) {

        Font font = new Font(Font.HELVETICA, 12, Font.BOLD, Color.WHITE);

        PdfPCell header = new PdfPCell(new Phrase(title, font));

        // blue color
        header.setBackgroundColor(new Color(52, 152, 219));

        header.setBackgroundColor(new Color(52, 152, 219));
        header.setHorizontalAlignment(Element.ALIGN_CENTER);
        header.setVerticalAlignment(Element.ALIGN_MIDDLE);
        header.setPadding(8);

        table.addCell(header);
    }

    // ====================== CELL =========================
    private PdfPCell createCell(String text, Color bgColor) {

        PdfPCell cell = new PdfPCell(new Phrase(text));
        cell.setBackgroundColor(bgColor);
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        return cell;
    }

    // ==================== WATERMARK =======================
    private void addWatermark(PdfWriter writer, String text, Color color) {

        PdfContentByte canvas = writer.getDirectContentUnder();

        PdfGState gs = new PdfGState();
        gs.setFillOpacity(0.3f);
        canvas.setGState(gs);

        Font font = new Font(Font.HELVETICA, 70, Font.BOLD, color);
        Phrase watermark = new Phrase(text, font);

        ColumnText.showTextAligned(
                canvas,
                Element.ALIGN_CENTER,
                watermark,
                297,
                421,
                45);
    }
}
