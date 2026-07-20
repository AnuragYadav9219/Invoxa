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
        <Card className="w-full md:w-[210mm] mx-auto border-2 border-pink-500 rounded-2xl shadow-2xl bg-zinc-950 font-sans text-zinc-300 overflow-hidden">
            <CardContent className="p-0">
                {/* Neon High-Contrast Header */}
                <div className="bg-linear-to-r from-zinc-900 via-purple-950 to-zinc-900 p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-pink-500/40 relative">
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-cyan-400 via-pink-500 to-purple-600" />
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-cyan-400" />
                            <h1 className="text-xl font-black tracking-wider uppercase bg-linear-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">{data.shop.name}</h1>
                        </div>
                        <p className="text-xs font-mono font-bold text-zinc-500">// HOST_NODE: {data.shop.owner}</p>
                    </div>

                    <div className="text-left sm:text-right font-mono text-xs">
                        <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">SYS_MANIFEST_RECORD</div>
                        <div className="text-base font-black text-white tracking-wider">#{data.invoiceInfo.number}</div>
                    </div>
                </div>

                <div className="p-3 md:p-6 space-y-6">
                    {/* Meta Stripe - Cyber Grid Elements */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl font-mono text-[11px]">
                        <div>
                            <span className="text-zinc-600 uppercase text-[9px] font-bold block">GEN_TIMESTAMP</span>
                            <span className="text-zinc-200 font-medium">{formatDate(data.invoiceInfo.createdAt)}</span>
                        </div>
                        <div>
                            <span className="text-zinc-600 uppercase text-[9px] font-bold block">DEADLINE_LIMIT</span>
                            <span className="text-zinc-200 font-medium">{formatDate(data.invoiceInfo.dueDate)}</span>
                        </div>
                        <div>
                            <span className="text-zinc-600 uppercase text-[9px] font-bold block">LEDGER_STATE</span>
                            <div className="mt-0.5">
                                <Badge className="rounded-md bg-transparent text-pink-400 border border-pink-500/40 text-[9px] font-black tracking-wide px-2 py-0">
                                    {status}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <span className="text-cyan-400 uppercase text-[9px] font-bold block">NET_REQUIRED</span>
                            <span className="text-white font-black text-xs block">{formatCurrency(data.payment.remaining)}</span>
                        </div>
                    </div>

                    {/* Forced Side-by-Side Neon Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Source Block - Cyan Accents */}
                        <div className="border border-zinc-800 bg-zinc-900/20 p-4 rounded-xl border-t-4 border-t-cyan-400 flex flex-col justify-between min-w-0">
                            <div>
                                <h2 className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400 border-b border-zinc-800/80 pb-1 mb-2 truncate">
                                    SND_ADDRESS
                                </h2>
                                <p className="font-extrabold text-zinc-100 text-sm truncate">{data.shop.name}</p>
                                {data.shop.owner && <p className="text-xs font-mono text-zinc-500 truncate">{data.shop.owner}</p>}
                            </div>
                            <div className="mt-4 pt-2 border-t border-zinc-900 text-[11px] space-y-1 text-zinc-400 font-light">
                                <p className="flex items-start gap-1 leading-normal">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-400/40 mt-0.5" />
                                    <span className="line-clamp-2">{data.shop.address}</span>
                                </p>
                                <p className="truncate font-mono text-[10px] text-zinc-500">P: {data.shop.phone}</p>
                            </div>
                        </div>

                        {/* Destination Block - Pink Accents */}
                        <div className="border border-zinc-800 bg-zinc-900/20 p-4 rounded-xl border-t-4 border-t-pink-500 flex flex-col justify-between min-w-0">
                            <div>
                                <h2 className="text-[9px] font-mono font-bold uppercase tracking-widest text-pink-400 border-b border-zinc-800/80 pb-1 mb-2 truncate">
                                    RCV_TARGET
                                </h2>
                                <p className="font-extrabold text-zinc-100 text-sm truncate">{data.customer.name}</p>
                            </div>
                            <div className="mt-4 pt-2 border-t border-zinc-900 text-[11px] space-y-1 text-zinc-400 font-light">
                                <p className="flex items-start gap-1 leading-normal">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-pink-500/40 mt-0.5" />
                                    <span className="line-clamp-2">{data.customer.address}</span>
                                </p>
                                {data.customer.phone ? (
                                    <p className="truncate font-mono text-[10px] text-zinc-500">P: {data.customer.phone}</p>
                                ) : (
                                    <p className="text-transparent select-none text-[10px]">Placeholder</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table Allocation */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-zinc-400 font-bold text-xs uppercase font-mono tracking-widest">
                            <FileText className="w-4 h-4 text-cyan-400" />
                            <span>[03] ALLOCATION_MATRIX</span>
                        </div>
                        <div className="overflow-x-auto border border-zinc-800 bg-[#0A0B0D] rounded-xl overflow-hidden">
                            <InvoiceItemsTable items={data.items} variant="cyberpunk" />
                        </div>
                    </div>

                    {/* Lower Balance Matrix Modules */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 items-stretch font-mono">
                        <div className="md:col-span-6 border border-zinc-800/60 p-4 rounded-xl text-[10px] text-zinc-500 leading-relaxed flex flex-col justify-center">
                            <span className="font-bold uppercase text-zinc-600 text-[9px] block mb-0.5">// DISCL_FRAMEWORK</span>
                            Please remit net corporate dues payable within contractual agreements. Standard terms apply. Late payments are subject to standard structured corporate processing penalties.
                        </div>

                        <div className="md:col-span-6 border border-zinc-800 bg-zinc-900/30 rounded-xl divide-y divide-zinc-900 overflow-hidden text-xs">
                            <div className="flex justify-between p-3">
                                <span className="text-zinc-500">GROSS_SUM</span>
                                <span className="text-zinc-300 font-bold">{formatCurrency(data.payment.total)}</span>
                            </div>
                            <div className="flex justify-between p-3 text-emerald-400/80 bg-emerald-950/10">
                                <span>AMORTIZED_VAL</span>
                                <span className="font-bold">-{formatCurrency(data.payment.paid)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3.5 bg-linear-to-r from-cyan-500 to-purple-600 text-black font-black text-xs">
                                <span className="uppercase tracking-wider">NET_PAYABLE_DUE</span>
                                <span className="text-sm font-black">{formatCurrency(data.payment.remaining)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Terminal System Footer */}
                    <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-[9px] font-mono text-zinc-600 font-bold">
                        <div>© {new Date().getFullYear()} {data.shop.name}</div>
                        <div className="text-pink-500/60">LEDGER // DATA_VALIDATED</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}