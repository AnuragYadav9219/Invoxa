import { Eye, Download } from "lucide-react";
import { useState } from "react";

export default function InvoiceToolbar({
    invoice,
    selectedTemplate,
    downloadPDF,
}) {
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handlePreview = async () => {
        try {
            setIsPreviewing(true);

            const template = selectedTemplate || invoice?.template || "classic";

            const blob = await downloadPDF({
                id: invoice.id,
                template,
            }).unwrap();

            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");

        } finally {
            setIsPreviewing(false);
        }
    };

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            
            const template = selectedTemplate || invoice?.template || "classic";

            const blob = await downloadPDF({
                id: invoice.id,
                template,
            }).unwrap();

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `Invoice-${invoice.invoiceNumber}.pdf`;
            a.click();

            URL.revokeObjectURL(url);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="max-w-[210mm] mx-auto flex justify-end gap-3 mb-5 no-print">

            <button
                onClick={handlePreview}
                disabled={isPreviewing || isDownloading}
                className="flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm shadow hover:bg-slate-50"
            >
                <Eye size={16} />
                {isPreviewing ? "Opening..." : "Preview"}
            </button>

            <button
                onClick={handleDownload}
                disabled={isPreviewing || isDownloading}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2 text-sm shadow hover:bg-slate-800"
            >
                <Download size={16} />
                {isDownloading ? "Downloading..." : "Download"}
            </button>

        </div>
    );
}