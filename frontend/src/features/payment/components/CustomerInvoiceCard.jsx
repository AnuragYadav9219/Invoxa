import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
    CalendarDays,
    User,
    Phone,
    Mail,
    Receipt,
    IndianRupee,
    CheckCircle2,
    CreditCard,
} from "lucide-react";

import { formatCurrency, formatDate } from "@/utils/formatters";
import useRazorpayPayment from "../hooks/useRazorpayPayment";

export default function CustomerInvoiceCard({
    invoice,
    refetch,
}) {

    const {
        payNow,
        loading,
    } = useRazorpayPayment();

    const isPaid = invoice.status === "PAID";

    return (

        <div className="max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-3xl border bg-white shadow-2xl">

                {/* ================= HEADER ================= */}
                <div className="bg-linear-to-r from-indigo-600 via-blue-600 to-purple-600 text-white p-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Invoice
                            </h1>

                            <p className="text-indigo-100 mt-2">
                                #{invoice.invoiceNumber}
                            </p>
                        </div>

                        <div className="flex items-start">
                            <Badge
                                className={`
                                    text-sm px-4 py-2
                                    ${invoice.status === "PAID"
                                        ? "bg-green-500 text-white"
                                        : invoice.status === "PARTIALLY_PAID"
                                            ? "bg-yellow-500 text-white"
                                            : invoice.status === "OVERDUE"
                                                ? "bg-red-500 text-white"
                                                : "bg-white text-indigo-700"
                                    }
                                `}
                            >
                                {invoice.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* ================= BODY ================= */}
                <div className="p-8 space-y-8">

                    {/* CUSTOMER */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="font-semibold text-lg mb-4">
                                Customer Details
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User size={18} />

                                    <span>
                                        {invoice.customerName}
                                    </span>
                                </div>

                                {invoice.customerPhone && (
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} />

                                        <span>
                                            {invoice.customerPhone}
                                        </span>
                                    </div>
                                )}

                                {invoice.customerEmail && (
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} />

                                        <span>
                                            {invoice.customerEmail}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="font-semibold text-lg mb-4">
                                Invoice Details
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Receipt size={18} />
                                    {invoice.invoiceNumber}
                                </div>

                                <div className="flex items-center gap-3">
                                    <CalendarDays size={18} />
                                    Due
                                    {formatDate(invoice.dueDate)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* SUMMARY */}
                    <div className="grid md:grid-cols-3 gap-5">
                        <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-sm text-gray-500">
                                Total
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {formatCurrency(invoice.totalAmount)}
                            </h2>
                        </div>

                        <div className="rounded-2xl bg-green-50 p-5">
                            <p className="text-sm text-gray-500">
                                Paid
                            </p>

                            <h2 className="text-3xl font-bold mt-2 text-green-700">
                                {formatCurrency(invoice.paidAmount)}
                            </h2>
                        </div>

                        <div className="rounded-2xl bg-orange-50 p-5">
                            <p className="text-sm text-gray-500">
                                Remaining
                            </p>

                            <h2 className="text-3xl font-bold mt-2 text-orange-600">
                                {formatCurrency(invoice.remainingAmount)}
                            </h2>
                        </div>
                    </div>

                    <Separator />

                    {/* ITEMS */}
                    <div>
                        <h2 className="font-semibold text-lg mb-4">
                            Items
                        </h2>

                        <div className="overflow-auto rounded-xl border">
                            <table className="w-full">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="text-left px-4 py-3">
                                            Item
                                        </th>

                                        <th className="text-center">
                                            Qty
                                        </th>

                                        <th className="text-center">
                                            Price
                                        </th>

                                        <th className="text-right px-4">
                                            Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {invoice.items?.map(item => (
                                        <tr
                                            key={item.id}
                                            className="border-t"
                                        >
                                            <td className="px-4 py-4">
                                                {item.itemName}
                                            </td>

                                            <td className="text-center">
                                                {item.quantity}
                                            </td>

                                            <td className="text-center">
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
                    </div>
                </div>

                {/* ================= FOOTER ================= */}
                <div className="bg-slate-50 p-8">
                    {isPaid ? (
                        <div className="flex justify-center items-center gap-3 text-green-600">
                            <CheckCircle2 size={26} />

                            <span className="text-lg font-semibold">
                                This invoice has already been paid.
                            </span>
                        </div>
                    ) : (
                        <Button
                            className="w-full h-14 text-lg"
                            disabled={loading}
                            onClick={() =>
                                payNow(invoice, refetch)
                            }
                        >
                            <CreditCard
                                className="mr-2"
                                size={20}
                            />
                            {loading
                                ? "Opening Razorpay..."
                                : `Pay ${formatCurrency(invoice.remainingAmount)}`}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}