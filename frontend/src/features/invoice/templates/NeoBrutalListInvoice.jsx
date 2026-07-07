
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
        <Card className="w-full md:w-[210mm] mx-auto border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-amber-50 font-mono text-black">
            <CardContent className="p-0">
                {/* Header Banner */}
                <div className="bg-cyan-300 border-b-4 border-black p-3 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <Briefcase className="w-6 h-6 text-black" />
                            </div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-black">{data.shop.name}</h1>
                        </div>
                        <p className="text-xs font-bold bg-white/60 inline-block px-1 border border-black">{data.shop.owner}</p>
                    </div>

                    <div className="text-left sm:text-right bg-white p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="text-xs font-black uppercase tracking-wider text-black">Bill Reference</div>
                        <div className="text-xl font-bold">#{data.invoiceInfo.number}</div>
                    </div>
                </div>

                <div className="p-2 md:p-6 space-y-6">
                    {/* Meta Info Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs font-bold">
                        <div className="space-y-1">
                            <span className="text-neutral-500 uppercase block">Date Issued</span>
                            <span className="text-black">{formatDate(data.invoiceInfo.createdAt)}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-neutral-500 uppercase block">Due Date</span>
                            <span className="text-black">{formatDate(data.invoiceInfo.dueDate)}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-neutral-500 uppercase block">Status</span>
                            <div>
                                <Badge
                                    className="rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black text-[10px]"
                                    variant={status === "PAID" ? "default" : status === "PARTIALLY PAID" ? "secondary" : "destructive"}
                                >
                                    {status}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-neutral-500 uppercase block">Amount Due</span>
                            <span className="text-red-500 font-black text-sm underline decoration-2">{formatCurrency(data.payment.remaining)}</span>
                        </div>
                    </div>

                    {/* Billing Parties Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                    <h2 className="text-xs font-black uppercase tracking-wider">Remit To</h2>
                                    <span className="text-[10px] font-bold bg-yellow-300 border border-black px-1.5 py-0.5">Vendor</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black text-sm">{data.shop.name}</p>
                                    {data.shop.owner && <p className="text-xs text-neutral-600">{data.shop.owner}</p>}
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-black/20 text-xs font-bold space-y-1.5">
                                <p className="flex items-start gap-2 leading-tight">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <span>{data.shop.address}</span>
                                </p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                                    <p className="flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 shrink-0" /> {data.shop.phone}
                                    </p>
                                    {data.shop.email && (
                                        <p className="flex items-center gap-1.5 truncate">
                                            <Mail className="w-3.5 h-3.5 shrink-0" /> {data.shop.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                                    <h2 className="text-xs font-black uppercase tracking-wider">Invoice To</h2>
                                    <span className="text-[10px] font-bold bg-purple-300 border border-black px-1.5 py-0.5">Client</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black text-sm">{data.customer.name}</p>
                                    <p className="text-xs text-transparent select-none hidden sm:block">Placeholder</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-black/20 text-xs font-bold space-y-1.5">
                                <p className="flex items-start gap-2 leading-tight">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <span>{data.customer.address}</span>
                                </p>
                                {data.customer.phone ? (
                                    <p className="flex items-center gap-1.5 pt-0.5">
                                        <Phone className="w-3.5 h-3.5 shrink-0" /> {data.customer.phone}
                                    </p>
                                ) : (
                                    <p className="text-transparent select-none pt-0.5">Placeholder</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-1.5 text-black font-black text-xs uppercase tracking-wider">
                            <FileText className="w-4 h-4" />
                            <span>Manifest Breakdown</span>
                        </div>
                        <div className="overflow-x-auto border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <InvoiceItemsTable items={data.items} variant="neoBrutal" />
                        </div>
                    </div>

                    {/* Summary Block */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 pt-2">
                        <div className="flex-1 border-2 border-black bg-white p-4 text-xs font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <span className="font-black uppercase text-[10px] block mb-1">Stipulations & Agreements</span>
                            <p className="leading-relaxed text-neutral-700">
                                Please remit net corporate dues payable within contractual agreements. Standard terms apply. Late payments are subject to standard structured corporate processing penalties.
                            </p>
                        </div>

                        <div className="w-full md:w-72 border-2 border-black bg-white divide-y-2 divide-black text-xs font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex justify-between p-3 bg-neutral-50">
                                <span>Subtotal</span>
                                <span>{formatCurrency(data.payment.total)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-red-50 text-red-600">
                                <span>Total Paid</span>
                                <span>-{formatCurrency(data.payment.paid)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-yellow-300 text-black">
                                <span className="font-black uppercase text-[10px]">Net Balance Due</span>
                                <span className="text-base font-black underline decoration-2">{formatCurrency(data.payment.remaining)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-black uppercase text-neutral-600">
                        <div>© {new Date().getFullYear()} {data.shop.name}.</div>
                        <div>Internal Accounting Record</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}