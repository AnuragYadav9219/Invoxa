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
        <Card className="w-full md:w-[210mm] mx-auto border-t-8 border-t-emerald-600 border-x border-b border-emerald-100 rounded-xl shadow-xl bg-white font-sans text-slate-700 overflow-hidden">
            <CardContent className="p-0">
                {/* Header Banner */}
                <div className="bg-linear-to-br from-emerald-50/60 via-white to-white p-2 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-100">
                    <div className="flex items-center gap-2">
                        <div className="p-2 md:p-2.5 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-200">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{data.shop.name}</h1>
                            <p className="text-xs font-semibold text-emerald-600/80 uppercase tracking-wider">{data.shop.owner}</p>
                        </div>
                    </div>

                    <div className="bg-emerald-950 text-white rounded-xl p-3 min-w-45 text-left sm:text-right relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-16 h-16 bg-emerald-800/20 rounded-full" />
                        <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">Statement Reference</div>
                        <div className="text-lg font-mono font-bold md:mt-0.5">#{data.invoiceInfo.number}</div>
                    </div>
                </div>

                <div className="p-2 md:p-8 space-y-5 md:space-y-8">
                    {/* Meta Cards Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 border p-1.5 rounded-xl gap-2 md:gap-4">
                        <div className="bg-slate-50 p-1.5 md:p-3 rounded-lg border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issued</span>
                            <span className="text-slate-800 font-semibold text-xs">{formatDate(data.invoiceInfo.createdAt)}</span>
                        </div>
                        <div className="bg-slate-50 p-1.5 md:p-3 rounded-lg border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Due Date</span>
                            <span className="text-slate-800 font-semibold text-xs">{formatDate(data.invoiceInfo.dueDate)}</span>
                        </div>
                        <div className="bg-slate-50 p-1.5 md:p-3 rounded-lg border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                            <div className="mt-0.5">
                                <Badge className="rounded-md px-1.5 border py-0 text-[9px] font-bold" variant={status === "PAID" ? "default" : status === "PARTIALLY PAID" ? "secondary" : "destructive"}>
                                    {status}
                                </Badge>
                            </div>
                        </div>
                        <div className="bg-emerald-50/50 p-1.5 md:p-3 rounded-lg border border-emerald-100/60">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Balance Outstanding</span>
                            <span className="text-emerald-900 font-extrabold font-mono text-sm">{formatCurrency(data.payment.remaining)}</span>
                        </div>
                    </div>

                    {/* Entities Section */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                        <div className="p-2.5 md:p-5 border border-slate-200 rounded-xl space-y-1 md:space-y-3 bg-white shadow-xs">
                            <div className="flex items-center gap-1 border-b border-slate-200 pb-1 md:pb-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Owner Details</h2>
                            </div>
                            <div className="space-y-1.5 text-xs">
                                <p className="font-bold text-slate-900 text-sm">{data.shop.name || 'Not available'}</p>
                                {data.shop.owner && <p className="font-medium text-slate-500">{data.shop.owner || 'Not available'}</p>}
                                <p className="text-slate-600 flex items-start gap-1.5 pt-1">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                                    <span>{data.shop.address || 'Not available'}</span>
                                </p>
                                <p className="text-slate-600 flex items-center gap-1.5 font-mono">
                                    <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" /> {data.shop.phone || 'Not available'}
                                </p>
                                {data.shop.email && (
                                    <p className="text-slate-600 flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" /> {data.shop.email || 'Not available'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="p-2.5 md:p-5 border border-slate-200 rounded-xl space-y-1 md:space-y-3 bg-white shadow-xs">
                            <div className="flex items-center gap-1 border-b border-slate-200 pb-1 md:pb-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Client Details</h2>
                            </div>
                            <div className="space-y-1.5 text-xs">
                                <p className="font-bold text-slate-900 text-sm">{data.customer.name || 'Not available'}</p>
                                <p className="text-slate-600 flex items-start gap-1.5 pt-1">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                                    <span>{data.customer.address || 'Not available'}</span>
                                </p>
                                {data.customer.phone ? (
                                    <p className="text-slate-600 flex items-center gap-1.5 font-mono">
                                        <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" /> {data.customer.phone || 'Not available'}
                                    </p>
                                ) : (
                                    <p className="text-transparent select-none">Placeholder</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            <span>Detailed Assessment</span>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
                            <InvoiceItemsTable items={data.items} variant="vibrant" />
                        </div>
                    </div>

                    {/* Ledger Block */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch gap-2 md:gap-6 md:pt-2">
                        <div className="flex-1 bg-slate-50 p-2 md:p-4 rounded-xl text-xs text-slate-500 border border-slate-100 flex flex-col justify-center">
                            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">Standard Stipulations</span>
                            <p className="leading-relaxed">
                                Please remit net corporate dues payable within contractual agreements. Standard terms apply. Late payments are subject to standard structured corporate processing penalties.
                            </p>
                        </div>

                        <div className="w-full md:w-80 bg-slate-900 text-white rounded-xl p-2.5 flex flex-col justify-between space-y-3 shadow-md">
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between text-slate-400">
                                    <span>Subtotal Amount</span>
                                    <span className="font-mono">{formatCurrency(data.payment.total)}</span>
                                </div>
                                <div className="flex justify-between text-emerald-400 font-medium">
                                    <span>Clearing Adjustments</span>
                                    <span className="font-mono">-{formatCurrency(data.payment.paid)}</span>
                                </div>
                            </div>
                            <div className="border-t border-slate-800 pt-1 md:pt-2.5 flex justify-between items-center">
                                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Final Settlement</span>
                                <span className="text-lg font-black font-mono text-emerald-400">{formatCurrency(data.payment.remaining)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Minimalist Corporate Footer */}
                    <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                        <div>© {new Date().getFullYear()} {data.shop.name}.</div>
                        <div>Secure Electronic Document</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}