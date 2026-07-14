import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { FileText, Mail, MapPin, Phone, Store, User } from "lucide-react";
import InvoiceItemsTable from "../shared/InvoiceItemsTable";

export default function ClassicInvoice({ data }) {

    return (
        <>
            <div className="bg-slate-50 min-h-screen md:py-5 px-0 sm:px-2">
                <div className="max-w-[210mm] mx-auto overflow-x-auto">
                    <div>
                        <Card className="w-full min-w-[320px] md:w-[210mm] bg-white shadow-lg border-none rounded-none overflow-hidden">
                            <CardContent className="p-0 flex flex-col h-full">

                                {/* ================= HEADER ================= */}
                                <div className="px-2 md:px-6 pt-5 md:pt-7 pb-6 border-b">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                        <div className="max-w-xs">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0e8388]/10">
                                                    <Store className="h-5 w-5 text-[#0e8388]" />
                                                </div>

                                                <div>
                                                    <h2 className="text-xl md:text-2xl font-bold text-[#0e8388] leading-tight">
                                                        {data?.shop?.name}
                                                    </h2>

                                                    <div className="mt-1 flex items-center gap-1.5 text-[11px] md:text-sm text-gray-600">
                                                        <User className="h-3.5 w-3.5 text-[#0e8388]" />
                                                        <span>{data?.shop?.owner || "N/A"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* RIGHT -> INVOICE META */}
                                        <div className="w-full sm:w-auto border border-[#0e8388]/20 rounded-md p-2 md:p-3 sm:p-4 bg-[#0e8388]/5 text-[11px] md:text-sm text-gray-700 space-y-1">
                                            <div className="flex justify-between gap-4">
                                                <span className="font-medium text-gray-500">Invoice No</span>
                                                <span className="font-semibold text-[#0e8388]">
                                                    #{data?.invoiceInfo?.number}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="font-medium text-gray-500">Issued Date</span>
                                                <span>{formatDate(data?.invoiceInfo?.createdAt)}</span>
                                            </div>

                                            <div className="flex justify-between gap-6">
                                                <span className="font-medium text-gray-500">Due Date</span>
                                                <span>{formatDate(data?.invoiceInfo?.dueDate)}</span>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="mt-3 md:mt-6 h-0.5 w-full bg-[#0e8388]/20"></div>

                                    {/* CUSTOMER */}
                                    <div className="mt-2 md:mt-4 grid grid-cols-2 gap-2">

                                        <div className="border-2 p-2.5 rounded-xl flex flex-col justify-between min-w-0">
                                            <div>
                                                <h2 className="text-[10px] font-black uppercase tracking-wider text-sky-800 border-b-2 border-sky-200 pb-1 mb-2 truncate">
                                                    Issued From
                                                </h2>
                                                <p className="font-extrabold text-slate-900 text-sm truncate">{data.shop.name}</p>
                                                {data.shop.owner && <p className="text-xs text-slate-600 truncate">{data.shop.owner}</p>}
                                            </div>
                                            <div className="mt-2 pt-1.5 border-t border-slate-200 text-[11px] space-y-1 text-slate-700 font-medium">
                                                <p className="flex items-start gap-1 leading-tight">
                                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-sky-600" />
                                                    <span className="line-clamp-2">{data.shop.address}</span>
                                                </p>
                                                <p className="truncate font-mono text-[10px]">P: {data.shop.phone}</p>
                                            </div>
                                        </div>

                                        <div className="border-2 p-2.5 rounded-xl flex flex-col justify-between min-w-0">
                                            <div>
                                                <h2 className="text-[10px] text-sky-800 font-black uppercase tracking-wider border-b-2 border-pink-200 pb-1 mb-2 truncate">
                                                    Bill To Client
                                                </h2>
                                                <p className="font-extrabold text-slate-900 text-sm truncate">{data.customer.name}</p>
                                            </div>
                                            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] space-y-1 text-slate-700 font-medium">
                                                <p className="flex items-start gap-1 leading-tight">
                                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-pink-600" />
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

                                </div>

                                {/* ================= TABLE ================= */}
                                <div className="px-1 md:px-4 mt-4 grow overflow-hidden">

                                    <div className="flex items-center mb-2 md:mb-4 gap-1.5 text-slate-900 font-extrabold text-xs uppercase">
                                        <FileText className="w-4 h-4 text-[#0e8388]" />
                                        <span>Itemized Breakdown</span>
                                    </div>

                                    <InvoiceItemsTable
                                        items={data.items}
                                        variant="classic"
                                    />

                                    {/* ================= TOTAL ================= */}
                                    <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">

                                        {/* LEFT */}
                                        <div className="order-2 sm:order-1 flex items-end">
                                            <p className="text-[#0e8388] font-semibold text-[12px] md:text-sm tracking-wide">
                                                THANK YOU FOR YOUR BUSINESS
                                            </p>
                                        </div>

                                        {/* RIGHT SUMMARY CARD */}
                                        <div className="order-1 sm:order-2 w-full sm:w-60">

                                            <div className="bg-gray-50 border rounded-lg p-2.5 shadow-sm space-y-3">

                                                {/* SUBTOTAL */}
                                                <div className="flex justify-between text-[12px] md:text-sm">
                                                    <span className="text-gray-600 font-medium">Subtotal</span>
                                                    <span className="font-semibold text-gray-800">
                                                        {formatCurrency(data?.payment?.total)}
                                                    </span>
                                                </div>

                                                {/* PAID */}
                                                <div className="flex justify-between text-[12px] md:text-sm">
                                                    <span className="text-green-600 font-medium">Paid</span>
                                                    <span className="font-semibold text-green-600">
                                                        + {formatCurrency(data?.payment?.paid)}
                                                    </span>
                                                </div>

                                                {/* DIVIDER */}
                                                <div className="border-t my-2"></div>

                                                {/* BALANCE */}
                                                <div className="flex justify-between items-center text-[13px] md:text-base font-bold">
                                                    <span className="text-red-600 uppercase">Balance</span>
                                                    <span className="text-red-600 text-lg">
                                                        {formatCurrency(data?.payment?.remaining)}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ================= TERMS + SIGNATURE ================= */}
                                <div className="px-2 md:px-12 py-5 md:py-8 border-t flex flex-col sm:flex-row justify-between gap-6">

                                    {/* TERMS */}
                                    <div className="max-w-sm space-y-2">
                                        <h4 className="font-semibold text-[12px] md:text-sm uppercase tracking-wide text-gray-700">
                                            Terms & Conditions
                                        </h4>

                                        <p className="text-[10px] md:text-[11px] text-gray-500 leading-relaxed">
                                            Thank you for doing business with us. Please ensure payment is made by the due date.
                                            Late payments may be subject to additional charges.
                                        </p>
                                    </div>

                                </div>

                                {/* ================= FOOTER ================= */}
                                <div className="bg-[#e0f2f1] px-4 md:px-8 py-5 border-t">

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] md:text-[11px] text-gray-700">

                                        {/* PHONE */}
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-[#0e8388]" />
                                            <span className="truncate">{data?.shop?.phone || "N/A"}</span>
                                        </div>

                                        {/* EMAIL */}
                                        <div className="flex items-center gap-2 break-all justify-start sm:justify-center">
                                            <Mail size={14} className="text-[#0e8388]" />
                                            <span>{data?.shop?.email || "N/A"}</span>
                                        </div>

                                        {/* ADDRESS */}
                                        <div className="flex items-center gap-2 justify-start sm:justify-end">
                                            <MapPin size={14} className="text-[#0e8388]" />
                                            <span className="truncate">{data?.shop?.address || "N/A"}</span>
                                        </div>

                                    </div>

                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}