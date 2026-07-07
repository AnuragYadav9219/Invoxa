import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Calendar, Phone, MapPin, Mail, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import InvoiceItemsTable from "../shared/InvoiceItemsTable";

export default function CorporateInvoice({ data }) {
    const balance = data.payment.remaining;
    const status =
        balance === 0
            ? "PAID"
            : balance === data.payment.total
                ? "PENDING"
                : "PARTIALLY PAID";

    return (
        <Card className="w-full md:w-[210mm] mx-auto border border-slate-200 rounded-none shadow-sm bg-white font-sans text-slate-800">
            <CardContent className="p-0">
                <div className="bg-slate-900 text-white p-3 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-slate-400" />
                            <h1 className="text-xl font-bold uppercase tracking-wider">{data.shop.name}</h1>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{data.shop.owner}</p>
                    </div>

                    <div className="text-left sm:text-right space-y-1">
                        <div className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Commercial Invoice No.</div>
                        <div className="text-lg font-mono font-bold">#{data.invoiceInfo.number}</div>
                    </div>
                </div>

                <div className="p-2.5 md:p-8 space-y-4 md:space-y-8">

                    {/* Meta Info Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-200 pb-6 mt-2 text-xs">
                        <div className="space-y-1">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider block">Date Issued</span>
                            <span className="text-slate-800 font-medium">{formatDate(data.invoiceInfo.createdAt)}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider block">Due Date</span>
                            <span className="text-slate-800 font-medium">{formatDate(data.invoiceInfo.dueDate)}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider block">Payment Status</span>
                            <div>
                                <Badge
                                    className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
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
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider block">Amount Due</span>
                            <span className="text-slate-900 font-bold font-mono">{formatCurrency(data.payment.remaining)}</span>
                        </div>
                    </div>

                    {/* Billing Parties Section */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4 pt-1">
                        {/* Remit / Vendor Details Card */}
                        <div className="rounded-sm border border-slate-200 bg-slate-50/30 p-1.5 md:p-4 flex flex-col justify-between transition-colors hover:bg-slate-50/60">
                            <div className="space-y-1.5 md:space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-1 md:pb-2 || 'Not available'">
                                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        Remit To
                                    </h2>
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-xs">
                                        Vendor
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <p className="font-bold text-slate-900 text-sm truncate">{data.shop.name || 'Not available'}</p>
                                    {data.shop.owner && (
                                        <p className="text-xs font-medium text-slate-500 truncate">{data.shop.owner || 'Not available'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-200/60 text-xs text-slate-600 space-y-1.5">
                                <p className="flex items-start gap-2 leading-tight">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                                    <span className="line-clamp-2">{data.shop.address || 'Not available'}</span>
                                </p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                                    <p className="flex items-center gap-1.5 font-mono text-[11px]">
                                        <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" /> {data.shop.phone || 'Not available'}
                                    </p>
                                    {data.shop.email && (
                                        <p className="flex items-center gap-1.5 text-[11px] truncate">
                                            <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" /> {data.shop.email || 'Not available'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Customer Details Card */}
                        <div className="rounded-sm border border-slate-200 bg-slate-50/30 p-1.5 flex flex-col justify-between transition-colors hover:bg-slate-50/60">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-1 md:pb-2">
                                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        Invoice To
                                    </h2>
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-xs">
                                        Client
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <p className="font-bold text-slate-900 text-sm truncate">{data.customer.name || 'Not available'}</p>
                                    {/* Visual placeholder line to match height if customer lacks a second property */}
                                    <p className="text-xs text-transparent select-none hidden sm:block">Placeholder</p>
                                </div>
                            </div>

                            <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-xs text-slate-600 space-y-1.5">
                                <p className="flex items-start gap-2 leading-tight">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                                    <span className="line-clamp-2">{data.customer.address || 'Not available'}</span>
                                </p>
                                {data.customer.phone ? (
                                    <p className="flex items-center gap-1.5 font-mono text-[11px] pt-0.5">
                                        <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" /> {data.customer.phone || 'Not available'}
                                    </p>
                                ) : (
                                    <p className="text-[11px] text-transparent select-none pt-0.5">Placeholder</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="space-y-2 pt-4">
                        <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <span>Line Item Breakdown</span>
                        </div>
                        <div className="overflow-x-auto border border-slate-200">
                            <InvoiceItemsTable items={data.items} variant="corporate" />
                        </div>
                    </div>

                    {/* Corporate Financial Summary Block */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 pt-4">
                        {/* Terms Note */}
                        <div className="max-w-md text-xs text-slate-500 space-y-1">
                            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">Terms & Conditions</span>
                            <p className="leading-relaxed">
                                Please remit net corporate dues payable within contractual agreements. Standard terms apply. Late payments are subject to standard structured corporate processing penalties.
                            </p>
                        </div>

                        {/* Total Matrix Box */}
                        <div className="w-full md:w-72 border border-slate-200 divide-y divide-slate-100 text-xs">
                            <div className="flex justify-between p-2 md:p-3 bg-slate-50/50">
                                <span className="text-slate-500 font-medium">Subtotal</span>
                                <span className="font-mono font-semibold text-slate-800">{formatCurrency(data.payment.total)}</span>
                            </div>
                            <div className="flex justify-between p-2 md:p-3">
                                <span className="text-slate-500 font-medium">Total Paid</span>
                                <span className="font-mono font-semibold text-emerald-600">-{formatCurrency(data.payment.paid)}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 md:p-4 bg-slate-900 text-white">
                                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Total Balance Due</span>
                                <span className="text-base font-bold font-mono tracking-tight">{formatCurrency(data.payment.remaining)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Minimalist Corporate Footer */}
                    <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        <div>
                            © {new Date().getFullYear()} {data.shop.name}. All Rights Reserved.
                        </div>
                        <div className="flex gap-4">
                            <span>Confidential Document</span>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}