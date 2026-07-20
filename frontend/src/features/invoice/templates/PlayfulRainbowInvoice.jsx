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
        <Card className="w-full md:w-[210mm] mx-auto border-4 border-slate-900 rounded-2xl shadow-xl bg-white font-sans text-slate-800 overflow-hidden">
            <CardContent className="p-0">
                {/* Header Row - Bright Purple/Indigo */}
                <div className="bg-indigo-600 text-white p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-slate-900">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-yellow-300" />
                            <h1 className="text-xl font-black uppercase tracking-wide">{data.shop.name}</h1>
                        </div>
                        <p className="text-xs text-indigo-100 font-medium">{data.shop.owner}</p>
                    </div>

                    <div className="text-left sm:text-right">
                        <div className="text-[11px] font-extrabold uppercase tracking-widest text-yellow-300">Invoice Statement</div>
                        <div className="text-xl font-mono font-black">#{data.invoiceInfo.number}</div>
                    </div>
                </div>

                <div className="p-2 md:p-8 mt-2 space-y-4">
                    {/* Meta Stripe - Yellow/Amber Accent */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-amber-50 border-2 border-slate-900 p-3 rounded-xl text-xs font-bold shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                        <div className="space-y-0.5">
                            <span className="text-amber-700 uppercase text-[10px]">Date Issued</span>
                            <span className="text-slate-900 block">{formatDate(data.invoiceInfo.createdAt)}</span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-amber-700 uppercase text-[10px]">Due Date</span>
                            <span className="text-slate-900 block">{formatDate(data.invoiceInfo.dueDate)}</span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-amber-700 uppercase text-[10px]">Status</span>
                            <div>
                                <Badge className="rounded-md px-1.5 py-0 text-[10px] font-black border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                                    {status}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-rose-600 uppercase text-[10px]">Amount Due</span>
                            <span className="text-rose-600 font-black text-sm block">{formatCurrency(data.payment.remaining)}</span>
                        </div>
                    </div>

                    {/* Parties Section - Forced Side-by-Side with Blue and Pink Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Vendor - Soft Blue */}
                        <div className="border-2 border-slate-900 bg-sky-50 p-2.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between min-w-0">
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-wider text-sky-800 border-b-2 border-sky-200 pb-1 mb-2 truncate">
                                    From System
                                </h2>
                                <p className="font-extrabold text-slate-900 text-sm truncate">{data.shop.name}</p>
                                {data.shop.owner && <p className="text-xs text-slate-600 truncate">{data.shop.owner}</p>}
                            </div>
                            <div className="mt-2 pt-1.5 border-t border-slate-200 text-[11px] space-y-1 text-slate-700 font-medium">
                                <p className="flex items-start gap-1 leading-tight">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-sky-600 mt-0.5" />
                                    <span className="line-clamp-2">{data.shop.address}</span>
                                </p>
                                <p className="truncate font-mono text-[10px]">P: {data.shop.phone}</p>
                            </div>
                        </div>

                        {/* Client - Soft Pink */}
                        <div className="border-2 border-slate-900 bg-pink-50 p-2.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between min-w-0">
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-wider text-pink-800 border-b-2 border-pink-200 pb-1 mb-2 truncate">
                                    Bill To Client
                                </h2>
                                <p className="font-extrabold text-slate-900 text-sm truncate">{data.customer.name}</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] space-y-1 text-slate-700 font-medium">
                                <p className="flex items-start gap-1 leading-tight">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-pink-600 mt-0.5" />
                                    <span className="line-clamp-2">{data.customer.address || 'Not available'}</span>
                                </p>
                                {data.customer.phone ? (
                                    <p className="truncate font-mono text-[10px]">P: {data.customer.phone || 'Not available'}</p>
                                ) : (
                                    <p className="text-transparent select-none text-[10px]">Placeholder</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table Block */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs uppercase">
                            <FileText className="w-4 h-4 text-indigo-600" />
                            <span>Itemized Breakdown</span>
                        </div>
                        <div className="overflow-x-auto border-2 border-slate-900 rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                            <InvoiceItemsTable items={data.items} variant="rainbow" />
                        </div>
                    </div>

                    {/* Financial Summary - Bright Emerald Total */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 items-center">
                        <div className="md:col-span-6 text-[11px] text-slate-500 font-medium leading-relaxed">
                            <span className="font-bold uppercase text-slate-400 text-[9px] block">Standard Disclaimer</span>
                            Please remit payments according to active terms. Late actions invoke operational standard interest fees.
                        </div>

                        <div className="md:col-span-6 border-2 border-slate-900 rounded-xl divide-y-2 divide-slate-900 bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-xs font-bold">
                            <div className="flex justify-between p-2.5">
                                <span className="text-slate-500">Gross Total</span>
                                <span>{formatCurrency(data.payment.total)}</span>
                            </div>
                            <div className="flex justify-between p-2 text-emerald-600">
                                <span>Total Settled</span>
                                <span>-{formatCurrency(data.payment.paid)}</span>
                            </div>
                            <div className="flex justify-between items-center p-2.5 bg-emerald-500 text-white">
                                <span className="uppercase text-[10px] font-black">Net Remaining</span>
                                <span className="text-base font-mono font-black">{formatCurrency(data.payment.remaining)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t-2 border-slate-100 flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                        <div>© {new Date().getFullYear()} {data.shop.name}</div>
                        <div className="text-indigo-500">Vibrant Ledger System</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}