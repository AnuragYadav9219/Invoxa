
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Calendar, Phone, MapPin, Mail, FileText } from "lucide-react";
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
        <Card className="w-full md:w-[210mm] mx-auto border-t-10 border-t-orange-500 border-x border-b border-orange-100 rounded-2xl shadow-xl bg-white font-sans text-slate-700 overflow-hidden">
            <CardContent className="p-0">
                {/* Header Banner with Rich Gradient */}
                <div className="bg-linear-to-r from-orange-500 via-pink-500 to-indigo-600 text-white p-3 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
                                <Briefcase className="w-5 h-5 text-yellow-300" />
                            </div>
                            <h1 className="text-xl font-black tracking-wide uppercase text-white">{data.shop.name}</h1>
                        </div>
                        <p className="text-xs text-orange-100/90 font-medium tracking-wider">{data.shop.owner}</p>
                    </div>

                    <div className="text-left sm:text-right space-y-1">
                        <div className="text-[10px] font-black tracking-widest text-yellow-300 uppercase">Commercial Document No.</div>
                        <div className="text-xl font-mono font-black tracking-tight text-white">#{data.invoiceInfo.number}</div>
                    </div>
                </div>

                <div className="p-3 md:p-8 space-y-6">
                    {/* Meta Stripe - Clean Soft Orange Block */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-orange-50/50 border border-orange-100 p-3 rounded-xl text-xs font-bold">
                        <div className="space-y-0.5">
                            <span className="text-orange-600/80 uppercase text-[10px] block">Date Issued</span>
                            <span className="text-slate-900 font-semibold">{formatDate(data.invoiceInfo.createdAt)}</span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-orange-600/80 uppercase text-[10px] block">Due Date</span>
                            <span className="text-slate-900 font-semibold">{formatDate(data.invoiceInfo.dueDate)}</span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-orange-600/80 uppercase text-[10px] block">Settlement State</span>
                            <div className="mt-0.5">
                                <Badge className="rounded-md px-2 py-0 text-[10px] font-extrabold bg-indigo-600 text-white hover:bg-indigo-700">
                                    {status}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-pink-600 uppercase text-[10px] block">Balance Due</span>
                            <span className="text-pink-600 font-black text-sm font-mono">{formatCurrency(data.payment.remaining)}</span>
                        </div>
                    </div>

                    {/* Forced Side-by-Side Clean Layout Cards */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        {/* Issued From */}
                        <div className="border border-slate-100 bg-white p-2 rounded-xl shadow-xs border-l-4 border-l-orange-500 flex flex-col justify-between min-w-0">
                            <div>
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-orange-600 border-b border-slate-100 pb-1 mb-1 truncate">
                                    Issued From
                                </h2>
                                <p className="font-extrabold text-slate-900 text-sm truncate">{data.shop.name || 'Not available'}</p>
                                {data.shop.owner && <p className="text-xs font-medium text-slate-500 truncate">{data.shop.owner || 'Not available'}</p>}
                            </div>
                            <div className="mt-4 pt-2 border-t border-slate-100/70 text-[11px] space-y-1 text-slate-600">
                                <p className="flex items-start gap-1 leading-tight">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-orange-400 mt-0.5" />
                                    <span className="line-clamp-2">{data.shop.address || 'Not available'}</span>
                                </p>
                                <p className="truncate font-mono text-[10px] text-slate-500">P: {data.shop.phone || 'Not available'}</p>
                            </div>
                        </div>

                        {/* Prepared For */}
                        <div className="border border-slate-100 bg-white p-2 rounded-xl shadow-xs border-l-4 border-l-indigo-500 flex flex-col justify-between min-w-0">
                            <div>
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 border-b border-slate-100 pb-1 mb-1 truncate">
                                    Prepared For
                                </h2>
                                <p className="font-extrabold text-slate-900 text-sm truncate">{data.customer.name || 'Not available'}</p>
                            </div>
                            <div className="mt-4 pt-2 border-t border-slate-100/70 text-[11px] space-y-1 text-slate-600">
                                <p className="flex items-start gap-1 leading-tight">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-indigo-400 mt-0.5" />
                                    <span className="line-clamp-2">{data.customer.address || 'Not available'}</span>
                                </p>
                                {data.customer.phone ? (
                                    <p className="truncate font-mono text-[10px] text-slate-500">P: {data.customer.phone || 'Not available'}</p>
                                ) : (
                                    <p className="text-transparent select-none text-[10px]">Placeholder</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Table Segment */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs uppercase tracking-wider">
                            <FileText className="w-4 h-4 text-orange-500" />
                            <span>Statement Items Allocation</span>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
                            <InvoiceItemsTable items={data.items} variant="sunrise" />
                        </div>
                    </div>

                    {/* Totals Calculation Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 items-stretch">
                        <div className="md:col-span-6 bg-slate-50 border border-slate-100 p-4 rounded-xl text-[11px] text-slate-400 leading-relaxed flex flex-col justify-center">
                            <span className="font-bold uppercase text-slate-500 text-[9px] block mb-0.5">Agreement Guidelines</span>
                            Please remit net corporate dues payable within contractual agreements. Standard terms apply. Late payments are subject to standard structured corporate processing penalties.
                        </div>

                        <div className="md:col-span-6 border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white overflow-hidden text-xs font-bold">
                            <div className="flex justify-between p-2.5 text-slate-500">
                                <span>Gross Assessment</span>
                                <span className="font-mono text-slate-800">{formatCurrency(data.payment.total)}</span>
                            </div>
                            <div className="flex justify-between p-2.5 text-emerald-600 bg-emerald-50/20">
                                <span>Credits Settled</span>
                                <span className="font-mono">-{formatCurrency(data.payment.paid)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-linear-to-r from-orange-500 to-pink-500 text-white font-black">
                                <span className="uppercase text-[9px] tracking-wider">Net Payable Due</span>
                                <span className="text-base font-mono">{formatCurrency(data.payment.remaining)}</span>
                            </div>
                        </div>
                    </div>

                    {/* System Footer */}
                    <div className="md:pt-4 pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                        <div>© {new Date().getFullYear()} {data.shop.name}</div>
                        <div className="text-pink-500">Automated Financial Record</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}