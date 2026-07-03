import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowRight, FileText, ChevronDown, CheckCircle2, AlertCircle, HelpCircle, Mail, Phone } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import InvoiceItemsTable from "../shared/InvoiceItemsTable";

export default function MinimalInvoice({ data }) {
    const [isNoteExpanded, setIsNoteExpanded] = useState(false);
    
    const balance = data.payment.remaining;
    const total = data.payment.total;
    const paid = data.payment.paid;

    const status =
        balance === 0
            ? "PAID"
            : balance === total
                ? "PENDING"
                : "PARTIALLY PAID";

    const statusConfig = {
        PAID: { color: "text-emerald-600 bg-emerald-50/50 border-emerald-100", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
        PENDING: { color: "text-amber-600 bg-amber-50/50 border-amber-100", icon: <AlertCircle className="w-3.5 h-3.5" /> },
        "PARTIALLY PAID": { color: "text-blue-600 bg-blue-50/50 border-blue-100", icon: <HelpCircle className="w-3.5 h-3.5" /> }
    };

    return (
        <Card className="w-full md:w-[210mm] border border-slate-100 rounded-2xl md:rounded-none shadow-xs bg-white transition-all duration-500 hover:shadow-xl hover:border-slate-200/60 select-none overflow-hidden mx-auto">
            <CardContent className="p-5 sm:p-10 md:p-16 space-y-10 md:space-y-14">
                
                {/* ================= HIGH-END EDITORIAL HEADER ================= */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-slate-100">
                    <div className="space-y-3 max-w-md">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-xl md:text-2xl font-light tracking-tight text-slate-900 wrap-break-word">
                                {data.shop.name}
                            </h2>
                            <div className="group relative inline-block">
                                <Badge
                                    className={`rounded-full px-2.5 py-0.5 border text-[10px] font-medium tracking-wider flex items-center gap-1 cursor-help transition-all duration-300 shadow-none ${statusConfig[status].color}`}
                                    variant="outline"
                                >
                                    {statusConfig[status].icon}
                                    {status}
                                </Badge>
                                
                                {/* POP-UP LEDGER OVERLAY */}
                                <div className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-52 bg-slate-900/95 backdrop-blur-md text-slate-200 text-[11px] p-3.5 rounded-xl shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-300 z-20 font-sans space-y-2 border border-white/10">
                                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                        <span className="text-slate-400">Total Bill:</span>
                                        <span className="font-mono text-white font-medium">{formatCurrency(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-400">
                                        <span>Paid Amount:</span>
                                        <span className="font-mono font-medium">-{formatCurrency(paid)}</span>
                                    </div>
                                    <div className="flex justify-between text-amber-400 pt-0.5 border-t border-dashed border-slate-800">
                                        <span className="font-medium">Due Balance:</span>
                                        <span className="font-mono font-bold">{formatCurrency(balance)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed wrap-break-word">
                            {data.shop.address}
                        </p>
                    </div>

                    <div className="flex flex-col sm:items-end space-y-1 sm:text-right shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400/80">Invoice No.</span>
                        <span className="text-xl font-mono font-light text-slate-900 tracking-tight">#{data.invoiceInfo.number}</span>
                    </div>
                </div>

                {/* ================= INTERACTIVE DUAL-LAYER METRICS BAR ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50/40 rounded-xl p-4 md:p-0 md:bg-transparent border border-slate-100 md:border-0">
                    <div className="space-y-1 pl-2 border-l-2 border-slate-200 md:border-l md:pl-4 transition-all duration-300 hover:border-slate-900">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date Issued</span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />
                            <span>{formatDate(data.invoiceInfo.createdAt)}</span>
                        </div>
                    </div>
                    <div className="space-y-1 pl-2 border-l-2 border-slate-200 md:border-l md:pl-4 transition-all duration-300 hover:border-slate-900">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Payment Due</span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span>{formatDate(data.invoiceInfo.dueDate)}</span>
                        </div>
                    </div>
                    <div className="sm:col-span-2 space-y-0.5 sm:text-left md:text-right md:ml-auto">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Amount Due</span>
                        <span className="text-2xl font-light text-slate-900 font-mono tracking-tight transition-transform duration-300 inline-block hover:scale-105 origin-right">
                            {formatCurrency(balance)}
                        </span>
                    </div>
                </div>

                {/* ================= SMART RESPONSIVE PARTY CARD ================= */}
                <div className="group rounded-2xl border border-slate-100 p-5 md:p-6 bg-white shadow-3xs hover:shadow-md transition-all duration-500 hover:border-slate-200/70">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        
                        {/* Issued From */}
                        <div className="space-y-1.5 min-w-0 flex-1">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Issued From</span>
                            <h4 className="text-xs font-semibold text-slate-800 truncate">{data.shop.owner}</h4>
                            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                                <Phone className="w-3 h-3 text-slate-300 shrink-0" />
                                <span className="truncate">{data.shop.phone}</span>
                            </div>
                        </div>

                        {/* Interactive Flow Axis Line */}
                        <div className="flex md:flex-col items-center gap-2 text-slate-300 w-full md:w-auto">
                            <div className="h-px bg-slate-100 flex-1 md:hidden" />
                            <div className="p-1.5 rounded-full bg-slate-50 text-slate-400 transition-transform duration-500 group-hover:rotate-180">
                                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5] rotate-90 md:rotate-0" />
                            </div>
                            <div className="h-px bg-slate-100 flex-1 md:hidden" />
                        </div>

                        {/* Bill To */}
                        <div className="space-y-1.5 min-w-0 flex-1 md:text-right">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 flex items-center md:justify-end gap-1">
                                <User className="w-3 h-3 text-indigo-400 shrink-0" /> Bill To
                            </span>
                            <h3 className="text-sm font-semibold text-slate-900 truncate">
                                {data.customer.name}
                            </h3>
                            <p className="text-xs text-slate-500 truncate">
                                {data.customer.address}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= ITEMIZATION SUB-GRID ================= */}
                <div className="space-y-3">
                    <div className="flex items-baseline justify-between border-b border-slate-100 pb-2.5">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">Line Breakdown</h3>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                            {data.items.length} Component{data.items.length > 1 ? "s" : ""}
                        </span>
                    </div>
                    
                    {/* Responsive table envelope wrapper with tailored system styles */}
                    <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 [&_table]:w-full [&_th]:text-slate-400 [&_th]:font-semibold [&_th]:text-[10px] [&_th]:uppercase [&_th]:tracking-widest [&_td]:py-4 [&_td]:border-b [&_td]:border-slate-100/60 [&_tr:hover]:bg-slate-50/40 [&_tr]:transition-colors">
                        <InvoiceItemsTable items={data.items} variant="minimal" />
                    </div>
                </div>

                {/* ================= BOTTOM METRICS & ACCORDION DISCLOSURE ================= */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2 items-start">
                    
                    {/* Collapsible notes block */}
                    <div className="md:col-span-7 space-y-2 order-2 md:order-1">
                        <button 
                            onClick={() => setIsNoteExpanded(!isNoteExpanded)}
                            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors focus:outline-hidden group"
                        >
                            <FileText className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            <span>Payment Terms & Disclosures</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isNoteExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isNoteExpanded ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                            <p className="text-xs text-slate-400 leading-relaxed pl-4 border-l border-slate-200 italic">
                                Please remit net payments within your designated schedule. Transaction updates propagate automatically onto live synchronization ledgers upon validation.
                            </p>
                        </div>
                    </div>

                    {/* Clean financial alignment matrix */}
                    <div className="md:col-span-5 space-y-3 text-xs font-sans order-1 md:order-2 bg-slate-50/50 p-4 rounded-xl md:p-0 md:bg-transparent">
                        <div className="flex justify-between text-slate-400">
                            <span>Subtotal</span>
                            <span className="font-mono text-slate-600">{formatCurrency(total)}</span>
                        </div>
                        {paid > 0 && (
                            <div className="flex justify-between text-slate-400">
                                <span>Paid Credit</span>
                                <span className="font-mono text-emerald-600">-{formatCurrency(paid)}</span>
                            </div>
                        )}
                        <div className="border-t border-slate-200/60 pt-3 flex justify-between items-baseline">
                            <span className="font-semibold text-slate-800">Balance Owed</span>
                            <span className="text-2xl font-light tracking-tight text-slate-900 font-mono">
                                {formatCurrency(balance)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ================= COMPACT ECOSYSTEM FOOTER ================= */}
                <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400/80 tracking-wide">
                    <div className="flex flex-col sm:flex-row items-center gap-y-1 sm:gap-x-3 text-center sm:text-left">
                        <span className="text-slate-700 font-semibold">{data.shop.name}</span>
                        <span className="text-slate-200 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1.5 font-mono break-all">
                            <Mail className="w-3 h-3 text-slate-300 shrink-0" />
                            <span>{data.shop.email}</span>
                        </div>
                    </div>
                    <p className="italic text-center sm:text-right text-slate-400">
                        System documentation • Verified Digital Record
                    </p>
                </div>

            </CardContent>
        </Card>
    );
}