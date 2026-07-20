import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, FileText } from "lucide-react";
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
        <Card className="w-full md:w-[210mm] mx-auto border-2 border-teal-500 rounded-none shadow-lg bg-slate-950 font-sans text-slate-300">
            <CardContent className="p-3 md:p-6 space-y-6">

                {/* Clean Top Grid Split Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
                    <div className="space-y-1">
                        <h1 className="text-lg font-black tracking-wider uppercase text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-400" />
                            {data.shop.name}
                        </h1>
                        <p className="text-xs text-teal-400 font-mono font-bold">{data.shop.owner}</p>
                    </div>

                    <div className="text-left sm:text-right font-mono text-xs">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Digital Manifest</div>
                        <div className="text-base font-bold text-teal-400">#{data.invoiceInfo.number}</div>
                    </div>
                </div>

                {/* Meta Panel Stripe */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/60 border border-slate-800 p-3 font-mono text-[11px]">
                    <div>
                        <span className="text-slate-500 block uppercase text-[9px]">Issued On</span>
                        <span className="text-slate-200">{formatDate(data.invoiceInfo.createdAt)}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block uppercase text-[9px]">Due Target</span>
                        <span className="text-slate-200">{formatDate(data.invoiceInfo.dueDate)}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block uppercase text-[9px]">Core State</span>
                        <div className="mt-0.5">
                            <Badge className="rounded-none bg-transparent text-orange-400 border border-orange-500/40 text-[10px] px-1.5 py-0 font-bold">
                                {status}
                            </Badge>
                        </div>
                    </div>
                    <div>
                        <span className="text-teal-400 block uppercase text-[9px] font-bold">Balance Value</span>
                        <span className="text-white font-bold">{formatCurrency(data.payment.remaining)}</span>
                    </div>
                </div>

                {/* Forced Side-by-Side Clean Grid Blocks */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                    {/* Source Block */}
                    <div className="border-l-4 border-l-teal-500 bg-slate-900/30 p-4 space-y-2 min-w-0">
                        <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest block">01 / Source</span>
                        <div className="space-y-0.5">
                            <p className="font-bold text-white truncate">{data.shop.name}</p>
                            <p className="text-slate-400 flex items-start gap-1 pt-1 leading-tight text-[11px]">
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-600 mt-0.5" />
                                <span className="line-clamp-2">{data.shop.address}</span>
                            </p>
                            <p className="text-slate-500 text-[10px] pt-1 font-mono truncate">T: {data.shop.phone}</p>
                        </div>
                    </div>

                    {/* Destination Block */}
                    <div className="border-l-4 border-l-orange-500 bg-slate-900/30 p-4 space-y-2 min-w-0">
                        <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest block">02 / Target</span>
                        <div className="space-y-0.5">
                            <p className="font-bold text-white truncate">{data.customer.name}</p>
                            <p className="text-slate-400 flex items-start gap-1 pt-1 leading-tight text-[11px]">
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-600 mt-0.5" />
                                <span className="line-clamp-2">{data.customer.address}</span>
                            </p>
                            {data.customer.phone ? (
                                <p className="text-slate-500 text-[10px] pt-1 font-mono truncate">T: {data.customer.phone}</p>
                            ) : (
                                <p className="text-transparent select-none text-[10px] pt-1 font-mono">Placeholder</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ledger Block */}
                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase font-mono tracking-wider">
                        <FileText className="w-4 h-4 text-teal-400" />
                        <span>03 / Core Allocation Table</span>
                    </div>
                    <div className="overflow-x-auto border border-slate-800 bg-slate-900/20">
                        <InvoiceItemsTable items={data.items} variant="neonDark" />
                    </div>
                </div>

                {/* Financial Math Block */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 items-stretch font-mono">
                    <div className="md:col-span-6 border border-slate-800 p-4 text-[10px] text-slate-500 leading-relaxed flex flex-col justify-center">
                        <span className="text-slate-400 text-[9px] block mb-0.5 font-bold">// TRANSACTION FRAMEWORK</span>
                        Please remit net corporate dues payable within contractual agreements. Standard terms apply. Late payments are subject to standard structured corporate processing penalties.
                    </div>

                    <div className="md:col-span-6 border border-slate-800 divide-y divide-slate-900 bg-slate-900/40 text-xs">
                        <div className="flex justify-between p-3">
                            <span className="text-slate-300">Gross Vol</span>
                            <span className="text-slate-300">{formatCurrency(data.payment.total)}</span>
                        </div>
                        <div className="flex justify-between p-3 text-emerald-400">
                            <span>Settled Vol</span>
                            <span>-{formatCurrency(data.payment.paid)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3.5 bg-teal-500 text-slate-950 font-black">
                            <span className="text-[10px] uppercase">Net Account Due</span>
                            <span className="text-sm">{formatCurrency(data.payment.remaining)}</span>
                        </div>
                    </div>
                </div>

                {/* Mini Footer */}
                <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-[9px] font-mono text-slate-600 font-bold">
                    <div>© {new Date().getFullYear()} {data.shop.name}</div>
                    <div>STATE: SECURE TRANSMISSION</div>
                </div>

            </CardContent>
        </Card>
    );
}