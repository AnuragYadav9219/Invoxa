import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    CalendarDays,
    User,
    Phone,
    Mail,
    Receipt,
    CheckCircle2,
    CreditCard,
    ShieldCheck,
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

    const getStatusStyle = (status) => {
        switch (status) {
            case "PAID":
                return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "PARTIALLY_PAID":
                return "bg-indigo-100 text-indigo-800 border-indigo-200";
            case "OVERDUE":
                return "bg-rose-100 text-rose-800 border-rose-200";
            default:
                return "bg-slate-100 text-slate-800 border-slate-200";
        }
    };

    return (
        <div className="max-w-3xl mx-auto w-full">
            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)]">

                {/* ================= HEADER ================= */}
                <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
                    {/* Decorative background glow */}
                    <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-indigo-300">
                                    <Receipt size={20} />
                                </span>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    Invoice Summary
                                </h1>
                            </div>
                            <p className="text-xs sm:text-sm text-indigo-200/80 font-medium pl-1">
                                Reference Number: <strong className="text-white">#{invoice.invoiceNumber}</strong>
                            </p>
                        </div>

                        <Badge
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider border shadow-sm ${getStatusStyle(invoice.status)}`}
                        >
                            {invoice.status?.replaceAll("_", " ")}
                        </Badge>
                    </div>
                </div>

                {/* ================= BODY ================= */}
                <div className="p-6 sm:p-8 space-y-6 bg-slate-50/50">

                    {/* CUSTOMER & INVOICE DETAILS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* CUSTOMER CARD */}
                        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                                Billed To Client
                            </h2>

                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2.5 text-slate-800">
                                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                                        <User size={15} />
                                    </div>
                                    <span className="font-bold text-sm">
                                        {invoice.customerName}
                                    </span>
                                </div>

                                {invoice.customerPhone && (
                                    <div className="flex items-center gap-2.5 text-slate-600">
                                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                                            <Phone size={15} />
                                        </div>
                                        <span className="text-xs font-semibold">
                                            {invoice.customerPhone}
                                        </span>
                                    </div>
                                )}

                                {invoice.customerEmail && (
                                    <div className="flex items-center gap-2.5 text-slate-600">
                                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                                            <Mail size={15} />
                                        </div>
                                        <span className="text-xs font-semibold truncate">
                                            {invoice.customerEmail}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* INVOICE DATE INFO CARD */}
                        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                                Timeline & Terms
                            </h2>

                            <div className="space-y-3 pt-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-medium">Invoice ID</span>
                                    <span className="font-bold text-slate-800">#{invoice.invoiceNumber}</span>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-medium">Due Date</span>
                                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                                        <CalendarDays size={13} className="text-indigo-600" />
                                        <span>{formatDate(invoice.dueDate)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FINANCIAL SUMMARY METRICS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Net Amount</p>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                {formatCurrency(invoice.totalAmount)}
                            </h2>
                        </div>

                        <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4 shadow-2xs space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Paid Amount</p>
                            <h2 className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">
                                {formatCurrency(invoice.paidAmount)}
                            </h2>
                        </div>

                        <div className="rounded-2xl bg-rose-50/60 border border-rose-100 p-4 shadow-2xs space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Balance Remaining</p>
                            <h2 className="text-xl sm:text-2xl font-black text-rose-700 tracking-tight">
                                {formatCurrency(invoice.remainingAmount)}
                            </h2>
                        </div>

                    </div>

                    {/* ITEMS LEDGER TABLE */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
                        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                                Line Items Breakdown
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="px-5 py-3">Item Description</th>
                                        <th className="px-3 py-3 text-center">Qty</th>
                                        <th className="px-3 py-3 text-center">Price</th>
                                        <th className="px-5 py-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                    {invoice.items?.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-3.5 font-bold text-slate-800">
                                                {item.itemName}
                                            </td>

                                            <td className="px-3 py-3.5 text-center font-semibold text-slate-600">
                                                {item.quantity}
                                            </td>

                                            <td className="px-3 py-3.5 text-center text-slate-600">
                                                {formatCurrency(item.price)}
                                            </td>

                                            <td className="px-5 py-3.5 text-right font-extrabold text-indigo-600">
                                                {formatCurrency(item.total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ================= FOOTER / CHECKOUT ACTION ================= */}
                <div className="bg-white p-6 border-t border-slate-100 flex flex-col items-center justify-center gap-3">
                    {isPaid ? (
                        <div className="flex justify-center items-center gap-2.5 text-emerald-600 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 w-full text-center">
                            <CheckCircle2 size={20} />
                            <span className="text-sm font-bold tracking-tight">
                                This invoice has been completely settled & paid.
                            </span>
                        </div>
                    ) : (
                        <div className="w-full space-y-2">
                            <Button
                                className="w-full h-12 sm:h-13 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm sm:text-base font-bold rounded-2xl shadow-lg shadow-emerald-500/25 cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
                                disabled={loading}
                                onClick={() =>
                                    payNow(invoice, refetch)
                                }
                            >
                                {loading ? (
                                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <CreditCard size={18} />
                                )}
                                <span>
                                    {loading
                                        ? "Initializing Secure Gateway..."
                                        : `Pay Now — ${formatCurrency(invoice.remainingAmount)}`}
                                </span>
                            </Button>

                            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
                                <ShieldCheck size={13} className="text-emerald-600" />
                                <span>Secured 256-bit SSL Razorpay Checkout</span>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}