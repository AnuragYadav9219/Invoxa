import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, FileText } from "lucide-react";
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
        <Card className="w-full md:w-[210mm] mx-auto border-2 border-lime-200 rounded-3xl shadow-xl bg-linear-to-br from-lime-50/30 via-white to-orange-50/20 font-sans text-slate-800 overflow-hidden">
            <CardContent className="p-0">
                {/* Header Banner - Rich Energetic Orange/Lime Wave */}
                <div className="bg-linear-to-br from-orange-500 via-orange-600 to-amber-500 text-white p-3 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-4 border-lime-400">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-lime-400 text-orange-950 flex items-center justify-center shadow-md">
                                <Briefcase className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <h1 className="text-xl font-black uppercase tracking-tight text-white">{data.shop.name}</h1>
                        </div>
                        <p className="text-xs text-orange-100 font-bold uppercase tracking-wider">{data.shop.owner}</p>
                    </div>

                    <div className="text-left sm:text-right font-medium space-y-0.5">
                        <div className="text-[10px] font-black tracking-widest text-orange-200 uppercase">Statement No.</div>
                        <div className="text-xl font-mono font-extrabold text-white">#{data.invoiceInfo.number}</div>
                    </div>
                </div>

                <div className="p-3 md:p-8 space-y-5">
                    {/* Meta Stripe - Contrast Mint/Teal Block */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-teal-50/60 border border-teal-100 p-2 md:p-4 rounded-2xl text-xs font-bold">
                        <div className="space-y-0.5">
                            <span className="text-teal-700 uppercase text-[9px] block tracking-wide">Issued Timeline</span>
                            <span className="text-slate-900 font-semibold">{formatDate(data.invoiceInfo.createdAt)}</span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-teal-700 uppercase text-[9px] block tracking-wide">Limit Target</span>
                            <span className="text-slate-900 font-semibold">{formatDate(data.invoiceInfo.dueDate)}</span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-teal-700 uppercase text-[9px] block tracking-wide">Ledger Status</span>
                            <div className="mt-0.5">
                                <Badge className="rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider bg-orange-500 text-white hover:bg-orange-600 border-0 uppercase">
                                    {status}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-orange-600 uppercase text-[9px] block tracking-wide">Net Remainder</span>
                            <span className="text-orange-600 font-black text-sm block font-mono">{formatCurrency(data.payment.remaining)}</span>
                        </div>
                    </div>

                    {/* Forced Side-by-Side Clean Layout Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Issued From - Lime Border Accent */}
                        <div className="border border-slate-100 bg-white p-2 md:p-4 rounded-2xl shadow-xs border-l-4 border-l-lime-500 flex flex-col justify-between min-w-0">
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-widest text-lime-600 border-b border-slate-100 md:pb-1 mb-1 md:mb-2 truncate">
                                    Owner Details
                                </h2>
                                <p className="font-extrabold text-slate-900 text-sm truncate">{data.shop.name || 'Not available'}</p>
                                {data.shop.owner && <p className="text-xs font-semibold text-slate-400 truncate">{data.shop.owner || 'Not available'}</p>}
                            </div>
                            <div className="mt-2 pt-1 border-t border-slate-50 text-[11px] space-y-0.5 text-slate-600">
                                <p className="flex items-start gap-1 leading-snug">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-lime-500/60 mt-0.5" />
                                    <span className="line-clamp-2">{data.shop.address || 'Not available'}</span>
                                </p>
                                <p className="truncate font-mono text-[10px] text-slate-400">P: {data.shop.phone || 'Not available'}</p>
                            </div>
                        </div>

                        {/* Prepared For - Orange Border Accent */}
                        <div className="border border-slate-100 bg-white p-2 md:p-4 rounded-2xl shadow-xs border-l-4 border-l-orange-500 flex flex-col justify-between min-w-0">
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-widest text-orange-600 border-b border-slate-100 md:pb-1 mb-1 md:mb-2 truncate">
                                    Client Details
                                </h2>
                                <p className="font-extrabold text-slate-900 text-sm truncate">{data.customer.name || 'Not available'}</p>
                            </div>
                            <div className="mt-2 pt-1 border-t border-slate-50 text-[11px] space-y-1 text-slate-600">
                                <p className="flex items-start gap-1 leading-snug">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-orange-400/60 mt-0.5" />
                                    <span className="line-clamp-2">{data.customer.address || 'Not available'}</span>
                                </p>
                                {data.customer.phone ? (
                                    <p className="truncate font-mono text-[10px] text-slate-400">P: {data.customer.phone || 'Not available'}</p>
                                ) : (
                                    <p className="text-transparent select-none text-[10px]">Placeholder</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Items Matrix Allocation */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs uppercase tracking-wider">
                            <FileText className="w-4 h-4 text-orange-500" />
                            <span>Statement Allocation Matrix</span>
                        </div>
                        <div className="overflow-x-auto rounded-2xl border border-slate-100 overflow-hidden shadow-xs bg-white">
                            <InvoiceItemsTable items={data.items} variant="tropical" />
                        </div>
                    </div>

                    {/* Financial Accounting Modules */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 items-stretch">
                        <div className="md:col-span-6 bg-slate-50 border border-slate-100 p-2 rounded-2xl text-[11px] text-slate-400 leading-relaxed flex flex-col justify-center">
                            <span className="font-bold uppercase text-slate-500 text-[9px] block mb-0.5">Agreement Matrix guidelines</span>
                            Please remit net corporate dues payable within contractual agreements. Standard terms apply. Late payments are subject to standard structured corporate processing penalties.
                        </div>

                        <div className="md:col-span-6 border border-slate-100 rounded-2xl divide-y divide-slate-100 bg-white overflow-hidden text-xs font-bold shadow-xs">
                            <div className="flex justify-between p-2 md:p-3 text-slate-500">
                                <span>Total Value</span>
                                <span className="font-mono text-slate-800">{formatCurrency(data.payment.total)}</span>
                            </div>
                            <div className="flex justify-between p-2 md:p-3 text-emerald-600 bg-emerald-50/10">
                                <span>Credited Amount</span>
                                <span className="font-mono">-{formatCurrency(data.payment.paid)}</span>
                            </div>
                            <div className="flex justify-between items-center p-2.5 md:p-3.5 bg-linear-to-r from-orange-500 to-amber-500 text-white font-black">
                                <span className="uppercase text-[9px] tracking-wider">Net Settlement Due</span>
                                <span className="text-base font-mono">{formatCurrency(data.payment.remaining)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                        <div>© {new Date().getFullYear()} {data.shop.name}</div>
                        <div className="text-orange-500">Secure Live Citrus Transaction Log</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}