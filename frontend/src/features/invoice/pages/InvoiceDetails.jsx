import { useParams } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    Calendar,
    FileText,
    BadgeIndianRupee,
} from "lucide-react";
import { useGetInvoiceByIdQuery } from "@/features/invoice/invoiceApi";
import PageLoader from "@/components/loaders/PageLoader";
import { useSelector } from "react-redux";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useGetShopQuery } from "@/features/shop/shopApi";

export default function InvoiceDetails() {
    const { id } = useParams();

    const { data, isLoading, error } = useGetInvoiceByIdQuery(id);

    const user = useSelector((state) => state.auth.user);

    const { data: shopData } = useGetShopQuery(user?.shopId, {
        skip: !user?.shopId,
    });

    const shop = shopData?.data;
    const invoice = data?.data;

    if (isLoading) {
        return <PageLoader />
    }

    if (error || !invoice) {
        return (
            <div className="p-10 text-center text-gray-500">
                Invoice not found
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen py-6">

            {/* ===== INVOICE CONTAINER ===== */}
            <div className="max-w-3xl mx-auto bg-white p-6 shadow-md border rounded-xl">

                {/* ===== HEADER ===== */}
                <div className="flex justify-between items-start border-b pb-4">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <FileText size={18} />
                            {user?.shopName || "N/A"}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {shop?.address || "Address not available"}
                        </p>
                        <p className="text-xs text-gray-500">
                            Phone: {shop?.phone || "N/A"}
                        </p>
                    </div>

                    <div className="text-right">
                        <h1 className="text-xl font-bold tracking-wide">
                            INVOICE
                        </h1>
                        <p className="text-xs text-gray-500">
                            #{invoice?.invoiceNumber}
                        </p>

                        <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                            <Calendar size={12} />
                            {formatDate(invoice?.dueDate)}
                        </div>
                    </div>
                </div>

                {/* ===== CUSTOMER ===== */}
                <div className="mt-6 flex justify-between text-sm">

                    {/* Left */}
                    <div className="space-y-1">
                        <p className="font-semibold mb-1">Bill To:</p>

                        <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>{invoice?.customerName}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Mail size={12} />
                            {invoice?.customerEmail || "No Email"}
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Phone size={12} />
                            {invoice?.customerPhone || "No Phone"}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="text-right">
                        <p className="font-semibold text-sm mb-1">Status</p>
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-100">
                            {invoice?.status}
                        </span>
                    </div>
                </div>

                {/* ===== ITEMS TABLE ===== */}
                <div className="mt-6">
                    <table className="w-full text-sm border-t border-b">

                        <thead>
                            <tr className="border-b text-gray-600">
                                <th className="py-2 text-left">Item</th>
                                <th className="py-2 text-center">Qty</th>
                                <th className="py-2 text-right">Price</th>
                                <th className="py-2 text-right">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {invoice?.items?.map((item, i) => (
                                <tr
                                    key={i}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="py-2 font-medium">
                                        {item.itemName}
                                    </td>

                                    <td className="py-2 text-center">
                                        {item.quantity}
                                    </td>

                                    <td className="py-2 text-right text-gray-600">
                                        {formatCurrency(item.price)}
                                    </td>

                                    <td className="py-2 text-right font-semibold">
                                        {formatCurrency(item.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ===== TOTALS ===== */}
                <div className="mt-6 flex justify-end">
                    <div className="w-64 text-sm space-y-2">

                        <div className="flex justify-between">
                            <span className="flex items-center gap-1">
                                <BadgeIndianRupee size={14} />
                                Total
                            </span>
                            <span>{formatCurrency(invoice?.totalAmount)}</span>
                        </div>

                        <div className="flex justify-between text-green-600">
                            <span>Paid</span>
                            <span>{formatCurrency(invoice?.paidAmount)}</span>
                        </div>

                        <div className="flex justify-between font-bold text-red-600 border-t pt-2">
                            <span>Balance Due</span>
                            <span>{formatCurrency(invoice?.remainingAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* ===== FOOTER ===== */}
                <div className="mt-10 flex justify-between items-end text-xs">
                    <div className="text-gray-500">
                        Thank you for your business
                    </div>

                    <div className="text-right">
                        <div className="border-t w-40 mb-1"></div>
                        <p className="text-gray-500">
                            Authorized Signature
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}