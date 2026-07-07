
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
        <Card className="w-full md:w-[210mm] mx-auto border-4 border-purple-950 rounded-none shadow-[6px_6px_0px_0px_rgba(59,7,100,1)] bg-[#FFFDF9] font-sans text-purple-950 overflow-hidden">
            <CardContent className="p-0">
                {/* Header Banner - Mint Green Pop */}
                <div className="bg-[#A3E635] p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-purple-950">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white border-2 border-purple-950 shadow-[2px_2px_0px_0px_rgba(59,7,100,1)]">
                                <Briefcase className="w-5 h-5 text-purple-950" />
                            </div>
                            <h1 className="text-xl font-black uppercase tracking-tight">{data.shop.name}</h1>
                        </div>
                        <p className="text-xs font-extrabold text-purple-900 bg-white/40 inline-block px-1.5 border border-purple-950/20">{data.shop.owner}</p>
                    </div>

                    <div className="text-left sm:text-right bg-white border-2 border-purple-950 p-1.5 shadow-[3px_3px_0px_0px_rgba(59,7,100,1)]">
                        <div className="text-[9px] font-black uppercase tracking-widest text-purple-400">Statement ID</div>
                        <div className="text-base font-mono font-black text-purple-950">#{data.invoiceInfo.number}</div>
                    </div>
                </div>

                <div className="p-2 md:p-8 space-y-6 mt-1.5">
                    {/* Meta Block Panel - Sunny Yellow Background */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#FACC15] border-2 border-purple-950 p-2.5 shadow-[4px_4px_0px_0px_rgba(59,7,100,1)] text-xs font-black">
                        <div>
                            <span className="text-purple-900/60 uppercase text-[9px] block">Date Created</span>
                            <span>{formatDate(data.invoiceInfo.createdAt)}</span>
                        </div>
                        <div>
                            <span className="text-purple-900/60 uppercase text-[9px] block">Payment Due</span>
                            <span>{formatDate(data.invoiceInfo.dueDate)}</span>
                        </div>
                        <div>
                            <span className="text-purple-900/60 uppercase text-[9px] block">Core Status</span>
                            <div className="mt-0.5">
                                <Badge className="rounded-none bg-purple-950 text-white font-black text-[9px] px-2 py-0 border-0">
                                    {status}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <span className="text-purple-900/60 uppercase text-[9px] block">Net Required</span>
                            <span className="text-purple-950 text-sm underline decoration-2">{formatCurrency(data.payment.remaining)}</span>
                        </div>
                    </div>

                    {/* Forced Side-by-Side Solid Blocks */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Source Address Box - Clean Pink */}
                        <div className="border-2 border-purple-950 bg-[#FBCFE8] p-2.5 shadow-[4px_4px_0px_0px_rgba(59,7,100,1)] flex flex-col justify-between min-w-0">
                            <div>
                                <h2 className="text-[9px] font-black uppercase tracking-wider bg-white px-1.5 py-0.5 border border-purple-950 inline-block mb-3">
                                    Owner Details
                                </h2>
                                <p className="font-black text-sm text-purple-950 truncate">{data.shop.name}</p>
                                {data.shop.owner && <p className="text-xs font-bold text-purple-800 truncate">{data.shop.owner}</p>}
                            </div>
                            <div className="mt-4 pt-2 border-t border-purple-950/20 text-[11px] font-bold space-y-1">
                                <p className="flex items-start gap-1 leading-snug">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-purple-900 mt-0.5" />
                                    <span className="line-clamp-2 text-purple-900">{data.shop.address || 'Not available'}</span>
                                </p>
                                <p className="truncate font-mono text-[10px] text-purple-800">P: {data.shop.phone || 'Not available'}</p>
                            </div>
                        </div>

                        {/* Customer Address Box - Clean Cyan */}
                        <div className="border-2 border-purple-950 bg-[#A5F3FC] p-2.5 shadow-[4px_4px_0px_0px_rgba(59,7,100,1)] flex flex-col justify-between min-w-0">
                            <div>
                                <h2 className="text-[9px] font-black uppercase tracking-wider bg-white px-1.5 py-0.5 border border-purple-950 inline-block mb-3">
                                    Customer Details
                                </h2>
                                <p className="font-black text-sm text-purple-950 truncate">{data.customer.name || 'Not available'}</p>
                                <p className="text-xs text-transparent select-none hidden sm:block">Placeholder</p>
                            </div>
                            <div className="mt-4 pt-2 border-t border-purple-950/20 text-[11px] font-bold space-y-1">
                                <p className="flex items-start gap-1 leading-snug">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-purple-900 mt-0.5" />
                                    <span className="line-clamp-2 text-purple-900">{data.customer.address || 'Not available'}</span>
                                </p>
                                {data.customer.phone ? (
                                    <p className="truncate font-mono text-[10px] text-purple-800">P: {data.customer.phone}</p>
                                ) : (
                                    <p className="text-transparent select-none text-[10px]">Placeholder</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Layout Manifest */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-purple-950 font-black text-xs uppercase tracking-wide">
                            <FileText className="w-4 h-4" />
                            <span>Detailed Value Assessment</span>
                        </div>
                        <div className="overflow-x-auto border-2 border-purple-950 bg-white shadow-[4px_4px_0px_0px_rgba(59,7,100,1)]">
                            <InvoiceItemsTable items={data.items} variant="popRetro" />
                        </div>
                    </div>

                    {/* Lower Allocation Summary Module */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 items-center">
                        <div className="md:col-span-6 text-[10px] font-bold text-purple-900/60 leading-relaxed border-l-2 border-purple-950 pl-3">
                            <span className="font-black uppercase text-[9px] block mb-0.5">// LEGAL REMITMENT CODE</span>
                            Please remit net corporate dues payable within contractual agreements. Standard terms apply. Late payments are subject to standard structured corporate processing penalties.
                        </div>

                        <div className="md:col-span-6 border-2 border-purple-950 bg-white divide-y-2 divide-purple-950 text-xs font-black shadow-[4px_4px_0px_0px_rgba(59,7,100,1)]">
                            <div className="flex justify-between p-2.5 bg-purple-50/40">
                                <span>Total Amount</span>
                                <span className="font-mono">{formatCurrency(data.payment.total)}</span>
                            </div>
                            <div className="flex justify-between p-2 text-emerald-600 bg-emerald-50/20">
                                <span>Deductions Applied</span>
                                <span className="font-mono">-{formatCurrency(data.payment.paid)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-[#F43F5E] text-white">
                                <span className="text-[9px] font-black uppercase">Remaining Amount</span>
                                <span className="text-base font-mono font-black">{formatCurrency(data.payment.remaining)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Retro System Footer */}
                    <div className="pt-4 border-t-2 border-purple-950 flex justify-between items-center text-[9px] font-black uppercase text-purple-900/40 tracking-wider">
                        <div>© {new Date().getFullYear()} {data.shop.name}</div>
                        <div>SYS_LOG: CANDY_FLAT_RECORD</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}