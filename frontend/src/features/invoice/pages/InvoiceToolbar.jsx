import { Eye, Download } from "lucide-react";

export default function InvoiceToolbar({
    invoice,
    selectedTemplate,
    downloadPDF,
    isDownloading,
}) {

    const handlePreview = async () => {

        const res = await downloadPDF({
            id: invoice.id,
            template: selectedTemplate,
            preview: true,
        });

        if (res.data?.blob) {

            const url = URL.createObjectURL(res.data.blob);

            window.open(url, "_blank");
        }
    };

    const handleDownload = async () => {

        const res = await downloadPDF({
            id: invoice.id,
            template: selectedTemplate,
            preview: false,
        });

        if (res.data?.blob) {

            const url = URL.createObjectURL(res.data.blob);

            const a = document.createElement("a");

            a.href = url;
            a.download = `Invoice-${invoice.invoiceNumber}.pdf`;

            a.click();

            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="max-w-[210mm] mx-auto flex justify-end gap-3 mb-5 no-print">

            <button
                onClick={handlePreview}
                disabled={isDownloading}
                className="flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm shadow hover:bg-slate-50"
            >
                <Eye size={16} />
                Preview
            </button>

            <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2 text-sm shadow hover:bg-slate-800"
            >
                <Download size={16} />
                {isDownloading ? "Downloading..." : "Download"}
            </button>

        </div>
    );
}