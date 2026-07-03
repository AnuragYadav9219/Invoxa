import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Phone, MapPin, User, Mail } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import InvoiceItemsTable from "../shared/InvoiceItemsTable";

export default function ModernInvoice({ data }) {
    const balance = data.payment.remaining;
    const status =
        balance === 0
            ? "PAID"
            : balance === data.payment.total
                ? "PENDING"
                : "PARTIALLY PAID";

    return (
        <Card className="w-full md:w-[210mm] border-0 rounded-2xl shadow-xl overflow-hidden bg-white">
            <CardContent className="p-0">
                {/* Top Accent Line */}
                <div className="h-2 bg-linear-to-r from-blue-600 via-indigo-500 to-violet-500" />

                <div className="p-4 sm:p-6 md:p-8 space-y-6">

                    {/* ================= APP-STYLE STATUS HEADER ================= */}
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Invoice</span>
                            <div className="flex items-center gap-2">
                                <span className="text-base font-mono font-bold text-slate-900">#{data.invoiceInfo.number}</span>
                            </div>
                        </div>
                        <Badge
                            className="rounded-full px-3 py-1 border border-slate-400 text-xs font-bold uppercase tracking-wider shadow-xs"
                            variant={
                                status === "PAID"
                                    ? "default"
                                    : status === "PARTIALLY PAID"
                                        ? "secondary"
                                        : "destructive"
                            }
                        >
                            {status}
                        </Badge>
                    </div>

                    {/* ================= INVOICE PARTIES CONTAINER ================= */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">

                        {/* VENDOR CARD */}
                        <div className="flex-1 rounded-xl border border-slate-300 bg-white  p-4 shadow-2xs min-w-0 flex flex-col justify-between gap-3">
                            <div className="space-y-1">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Issued By
                                </span>
                                <h3 className="text-sm font-bold text-slate-900 truncate">
                                    {data.shop.name}
                                </h3>
                                <p className="text-xs font-medium text-slate-500 truncate">
                                    {data.shop.owner}
                                </p>
                            </div>

                            <div className="pt-2 border-t border-slate-300 text-xs text-slate-600 space-y-0.5">
                                <p className="truncate">{data.shop.address}</p>
                                <p className="font-mono text-[11px] text-slate-400">{data.shop.phone}</p>
                            </div>
                        </div>

                        {/* CUSTOMER CARD */}
                        <div className="flex-1 rounded-xl border border-slate-300 bg-slate-50/50 p-4 shadow-2xs min-w-0 flex items-start gap-3.5 hover:bg-slate-50/80 transition-colors">

                            <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 shrink-0 shadow-3xs flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-600" />
                            </div>

                            <div className="space-y-1.5 min-w-0 flex-1">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                                    Bill To
                                </span>
                                <div className="space-y-0.5">
                                    <h3 className="text-sm font-bold text-slate-900 truncate">
                                        {data.customer.name}
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                                        {data.customer.address}
                                    </p>
                                </div>
                                {data.customer.phone && (
                                    <p className="text-[11px] font-mono font-medium text-slate-400 pt-1.5 border-t border-slate-200/60 w-fit">
                                        {data.customer.phone}
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* ================= DATES BAR (MOBILE COMPACT) ================= */}
                    <div className="flex items-center justify-between text-xs border-y border-slate-100 py-3 px-1 text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Issued: <strong className="text-slate-700 font-medium">{formatDate(data.invoiceInfo.createdAt)}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Due: <strong className="text-slate-700 font-medium">{formatDate(data.invoiceInfo.dueDate)}</strong></span>
                        </div>
                    </div>

                    {/* ================= ITEMS ================= */}
                    <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                            <h3 className="font-bold text-sm text-slate-900">Invoice Items</h3>
                            <span className="text-xs text-slate-500">
                                {data.items.length} item{data.items.length > 1 ? "s" : ""}
                            </span>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                            <InvoiceItemsTable items={data.items} variant="modern" />
                        </div>
                    </div>

                    {/* ================= PAYMENT SUMMARY ================= */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        {/* Note & Authorization Line */}
                        <div className="space-y-4">
                            <p className="text-xs italic text-slate-500 leading-relaxed">
                                Thank you for your business. Please complete payment prior to the due date.
                            </p>
                        </div>

                        {/* Totals Frame */}
                        <div className="rounded-xl bg-slate-900 text-white p-4 space-y-2.5 shadow-md">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="font-medium">{formatCurrency(data.payment.total)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Paid To Date</span>
                                <span className="font-medium text-green-400">{formatCurrency(data.payment.paid)}</span>
                            </div>
                            <div className="border-t border-slate-700 pt-2 flex justify-between items-center">
                                <span className="text-xs font-semibold text-slate-300">Balance Due</span>
                                <span className="text-lg font-bold tracking-tight">{formatCurrency(data.payment.remaining)}</span>
                            </div>
                        </div>
                    </div>

                    {/* ================= COMPACT FOOTER ================= */}
                    <div className="pt-2 border-t border-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-400 font-medium">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-0.5">
                            <span className="text-slate-600 font-semibold">{data.shop.name}</span>
                            <span className="text-slate-300 hidden sm:inline">•</span>
                            <span>{data.shop.phone}</span>
                            <span className="text-slate-300">•</span>
                            <span className="break-all">{data.shop.email}</span>
                        </div>
                        <p className="text-center sm:text-right italic tracking-wide">
                            Thank you for your business • Terms apply
                        </p>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}