import { useParams } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Download,
    Eye,
} from "lucide-react";
import { useDownloadInvoicePDFMutation, useGetInvoiceByIdQuery } from "@/features/invoice/invoiceApi";
import PageLoader from "@/components/loaders/PageLoader";
import { useSelector } from "react-redux";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useGetShopQuery } from "@/features/shop/shopApi";

export default function InvoiceDetails() {
    const { id } = useParams();

    const { data, isLoading, error } = useGetInvoiceByIdQuery(id);
    const [downloadPDF, { isLoading: isDownloading }] = useDownloadInvoicePDFMutation();

    const user = useSelector((state) => state.auth.user);

    const { data: shopData } = useGetShopQuery(user?.shopId, {
        skip: !user?.shopId,
    });

    const shop = shopData?.data;
    const invoice = data;

    if (isLoading) return <PageLoader />;

    if (error || !invoice) {
        return (
            <div className="p-10 text-center text-gray-500">
                Invoice not found
            </div>
        );
    }

    const statusColor = {
        PAID: "bg-green-100 text-green-600",
        PENDING: "bg-yellow-100 text-yellow-600",
        OVERDUE: "bg-red-100 text-red-600",
    };

    // ================= DOWNLOAD =================
    const handleDownload = async () => {
        try {
            const blob = await downloadPDF(invoice.id).unwrap();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `Invoice-${invoice.invoiceNumber}.pdf`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    // ================= PREVIEW =================
    const handlePreview = async () => {
        try {
            const blob = await downloadPDF(invoice.id).unwrap();

            const url = window.URL.createObjectURL(blob);

            window.open(url);
        } catch (err) {
            console.error("Preview failed", err);
        }
    };

    // ================= PRINT =================
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-6 px-3 sm:px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden invoice-container">

                {/* HEADER */}
                <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-6 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold">{user?.shopName}</h2>
                        <p className="text-xs opacity-80">{shop?.address}</p>
                        <p className="text-xs opacity-80">{shop?.phone}</p>
                    </div>

                    <div className="text-right">
                        <h1 className="text-2xl font-bold tracking-wider">
                            INVOICE
                        </h1>
                        <p className="text-sm opacity-80">
                            #{invoice.invoiceNumber}
                        </p>
                        <div className="flex items-center justify-end gap-1 text-xs mt-1">
                            <Calendar size={12} />
                            {formatDate(invoice.dueDate)}
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 p-4 border-b no-print">

                    <button
                        onClick={handlePreview}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Eye size={16} />
                        {isDownloading ? "Loading..." : "Preview"}
                    </button>

                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <Download size={16} />
                        {isDownloading ? "Downloading..." : "Download"}
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6">

                    {/* CUSTOMER */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                        <div>
                            <p className="text-sm font-semibold mb-2">Bill To</p>

                            <div className="flex items-center gap-2">
                                <User size={14} />
                                <span>{invoice.customerName}</span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Mail size={12} />
                                {invoice.customerEmail || "No Email"}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Phone size={12} />
                                {invoice.customerPhone || "No Phone"}
                            </div>
                        </div>

                        <span
                            className={`px-4 py-1 text-xs rounded-full font-semibold self-start ${statusColor[invoice.status]
                                }`}
                        >
                            {invoice.status}
                        </span>
                    </div>

                    {/* ITEMS */}
                    <div className="hidden sm:block rounded-xl overflow-hidden border">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="py-3 text-left px-4">Item</th>
                                    <th className="py-3 text-center">Qty</th>
                                    <th className="py-3 text-right">Price</th>
                                    <th className="py-3 text-right px-4">Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {invoice.items.map((item, i) => (
                                    <tr key={i} className="border-t hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">
                                            {item.itemName}
                                        </td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-right text-gray-600">
                                            {formatCurrency(item.price)}
                                        </td>
                                        <td className="text-right px-4 font-semibold">
                                            {formatCurrency(item.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* TOTAL */}
                    <div className="flex justify-end mt-8">
                        <div className="w-full sm:w-72 bg-gray-50 rounded-xl p-4 shadow-sm">

                            <div className="flex justify-between text-sm mb-2">
                                <span>Total</span>
                                <span>{formatCurrency(invoice.totalAmount)}</span>
                            </div>

                            <div className="flex justify-between text-green-600 text-sm mb-2">
                                <span>Paid</span>
                                <span>{formatCurrency(invoice.paidAmount)}</span>
                            </div>

                            <div className="flex justify-between font-bold text-red-600 border-t pt-2 text-lg">
                                <span>Balance</span>
                                <span>{formatCurrency(invoice.remainingAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-10 flex justify-between items-end text-xs text-gray-500">
                        <p>Thank you for your business ❤️</p>

                        <div className="text-right">
                            <div className="border-t w-40 mb-1"></div>
                            Authorized Signature
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}