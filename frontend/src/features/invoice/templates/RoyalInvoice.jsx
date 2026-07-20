import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Phone, MapPin, Mail, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import InvoiceItemsTable from "../shared/InvoiceItemsTable";

export default function MinimalInvoice({ data }) {
    const balance = data.payment.remaining;
    const status =
        balance === 0
            ? "PAID"
            : balance === data.payment.total
                ? "PENDING"
                : "PARTIALLY PAID";

    return (
        <Card className="w-full md:w-[210mm] mx-auto border-2 border-amber-200/60 rounded-xl shadow-xl bg-linear-to-b from-purple-50/20 to-white font-serif text-slate-800 overflow-hidden">
            <CardContent className="p-0">
                {/* Elegant Banner Header */}
                <div className="bg-indigo-950 text-white p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-4 border-amber-400">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border border-amber-400/40 bg-indigo-900/50 flex items-center justify-center">
                                <Briefcase className="w-4 h-4 text-amber-400" />
                            </div>
                            <h1 className="text-xl font-medium tracking-wide font-sans uppercase text-amber-400">{data.shop.name}</h1>
                        </div>
                        <p className="text-xs font-sans text-indigo-200/70 italic tracking-wider">{data.shop.owner}</p>
                    </div>

                    <div className="text-left sm:text-right font-sans space-y-1">
                        <div className="text-[10px] font-bold tracking-widest text-indigo-300 uppercase">Invoice Number</div>
                        <div className="text-2xl font-light text-white tracking-tight">#{data.invoiceInfo.number}</div>
                    </div>
                </div>

                <div className="p-3 md:p-10 space-y-4 font-sans">
                    {/* Meta Info Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-indigo-300 pb-5 text-xs">
                        <div className="space-y-1">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider block">Date Issued</span>
                            <span className="text-slate-800 font-medium font-serif">{formatDate(data.invoiceInfo.createdAt)}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider block">Due Date</span>
                            <span className="text-slate-800 font-medium font-serif">{formatDate(data.invoiceInfo.dueDate)}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider block">Payment Status</span>
                            <div className="pt-0.5">
                                <Badge
                                    className="rounded-full px-2 py-0.5 text-[9px] font-bold border bg-indigo-50 text-indigo-900 border-indigo-200 uppercase tracking-wider"
                                    variant="outline"
                                >
                                    {status}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-400 font-semibold uppercase tracking-wider block">Amount Due</span>
                            <span className="text-indigo-950 font-bold font-serif text-sm">{formatCurrency(data.payment.remaining)}</span>
                        </div>
                    </div>

                    {/* Billing Parties Section - Fixed for Forced Side-by-Side Mobile Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-8">
                        <div className="space-y-1 border rounded p-2 min-w-0">
                            <div className="flex items-center justify-between border-b border-indigo-50 pb-1">
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-indigo-900 truncate">
                                    Issued From
                                </h2>
                            </div>
                            <div className="space-y-1 text-xs">
                                <p className="font-bold font-serif text-slate-900 text-sm truncate">{data.shop.name}</p>
                                {data.shop.owner && <p className="font-medium text-slate-500 truncate">{data.shop.owner}</p>}
                                <p className="text-slate-600 flex items-start gap-2 pt-1 leading-relaxed text-[11px] sm:text-xs">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-indigo-300 mt-0.5" />
                                    <span className="line-clamp-3">{data?.shop?.address || 'Not available'}</span>
                                </p>
                                <div className="flex flex-col gap-y-1 pt-1 text-slate-500 font-serif text-[11px] sm:text-xs">
                                    <p className="flex items-center gap-1.5 truncate">
                                        <Phone className="w-3.5 h-3.5 shrink-0 text-indigo-200" /> {data.shop.phone || 'Not available'}
                                    </p>
                                    {data.shop.email && (
                                        <p className="flex items-center gap-1.5 truncate">
                                            <Mail className="w-3.5 h-3.5 shrink-0 text-indigo-200" /> {data.shop.email || 'Not available'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 min-w-0 border p-2">
                            <div className="flex items-center justify-between border-b border-indigo-50 pb-1.5">
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-indigo-900 truncate">
                                    Prepared For
                                </h2>
                            </div>
                            <div className="space-y-1 text-xs">
                                <p className="font-bold font-serif text-slate-900 text-sm truncate">{data.customer.name || 'Not available'}</p>
                                <p className="text-slate-600 flex items-start gap-2 pt-1 leading-relaxed text-[11px] sm:text-xs">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-indigo-300 mt-0.5" />
                                    <span className="line-clamp-3">{data.customer.address || 'Not available'}</span>
                                </p>
                                {data.customer.phone ? (
                                    <p className="text-slate-500 flex items-center gap-1.5 font-serif pt-1 text-[11px] sm:text-xs truncate">
                                        <Phone className="w-3.5 h-3.5 shrink-0 text-indigo-200" /> {data.customer.phone || 'Not available'}
                                    </p>
                                ) : (
                                    <p className="text-transparent select-none pt-1 text-[11px] sm:text-xs">Placeholder</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-1.5 text-indigo-950 font-semibold text-xs uppercase tracking-wider">
                            <FileText className="w-4 h-4 text-indigo-400" />
                            <span>Statement Allocation</span>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-indigo-50 overflow-hidden shadow-sm">
                            <InvoiceItemsTable items={data.items} variant="royal" />
                        </div>
                    </div>

                    {/* Summary Block */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4">
                        <div className="max-w-md text-xs text-slate-400 space-y-1">
                            <span className="font-bold uppercase tracking-wider text-indigo-900/60 text-[10px] block">Notice & Framework</span>
                            <p className="leading-relaxed">
                                Please remit net corporate dues payable within contractual agreements. Standard terms apply. Late payments are subject to standard structured corporate processing penalties.
                            </p>
                        </div>

                        <div className="w-full sm:w-64 space-y-2 text-xs border-t border-indigo-50 pt-2">
                            <div className="flex justify-between text-slate-500">
                                <span>Subtotal Balance</span>
                                <span className="font-serif">{formatCurrency(data.payment.total)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>Credits Settled</span>
                                <span className="font-serif text-rose-700">-{formatCurrency(data.payment.paid)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-indigo-900/10 text-indigo-950">
                                <span className="font-bold uppercase tracking-wider text-[10px]">Net Remaining Due</span>
                                <span className="text-base font-bold font-serif text-indigo-950">{formatCurrency(data.payment.remaining)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-indigo-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                        <div>© {new Date().getFullYear()} {data.shop.name}.</div>
                        <div>Confidential Transaction Log</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}