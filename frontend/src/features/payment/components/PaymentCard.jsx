import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COLORS, formatCurrency, formatDate } from "@/utils/formatters";
import { Edit2, Trash2, ChevronRight, User, CreditCard, Calendar, FileText, Copy, Check } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { usePaymentActions } from "../hooks/usePaymentActions";
import { useState } from "react";

export default function PaymentCard({
    p,
    navigate,
    showActions = false,
    onEdit,
}) {
    const { handleDelete } = usePaymentActions();
    const [copied, setCopied] = useState(false);

    const color = COLORS[(p.customerName?.charCodeAt(0) || 0) % COLORS.length];

    const handleNavigation = () => navigate(`/payments/${p.id}`);

    const copyReference = (e, text) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group bg-slate-50 border border-slate-500 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 overflow-hidden w-full min-w-0 relative">

            {/* Left Accent Bar on Hover */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-r" />

            {/* MAIN CLICK AREA */}
            <div
                onClick={handleNavigation}
                className="p-2 sm:p-5 cursor-pointer active:bg-slate-100/70 transition-colors"
            >

                {/* TOP SECTION */}
                <div className="flex justify-between items-start gap-3 mb-4">

                    {/* CUSTOMER */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                            className={cn(
                                "w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ring-4 ring-white transition-transform group-hover:scale-105 shrink-0 text-sm sm:text-base",
                                color
                            )}
                        >
                            {p.customerName?.charAt(0) || <User size={16} />}
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                    {p.customerName}
                                </h4>
                                <ChevronRight
                                    size={14}
                                    className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0"
                                />
                            </div>

                            <p className="text-[10px] sm:text-[11px] font-bold text-indigo-600 uppercase tracking-wider mt-0.5 truncate">
                                #{p.paymentNumber || "PAY-001"}
                            </p>
                        </div>
                    </div>

                    {/* AMOUNT */}
                    <div className="text-right shrink-0 bg-white px-3 py-1.5 rounded-2xl border border-slate-200/70 shadow-2xs">
                        <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                            Amount
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-emerald-600 mt-0.5">
                            {formatCurrency(p.amount)}
                        </p>
                    </div>
                </div>

                {/* PAYMENT DETAILS GRID */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs mb-3.5">

                    {/* METHOD */}
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-tight">
                            Method
                        </span>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <div className="p-1 rounded-lg bg-slate-100 text-slate-500">
                                <CreditCard size={12} />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                                {p.method}
                            </span>
                        </div>
                    </div>

                    {/* DATE */}
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-tight">
                            Date
                        </span>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <div className="p-1 rounded-lg bg-slate-100 text-slate-500">
                                <Calendar size={12} />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                                {formatDate(p.paymentDate)}
                            </span>
                        </div>
                    </div>

                    {/* INVOICE */}
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-tight">
                            Invoice
                        </span>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
                                <FileText size={12} />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-indigo-600 truncate">
                                #{p.invoiceNumber}
                            </span>
                        </div>
                    </div>

                    {/* REFERENCE */}
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-tight">
                            Reference
                        </span>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate pl-0.5">
                                {p.referenceNumber || "N/A"}
                            </span>
                            {p.referenceNumber && (
                                <button
                                    type="button"
                                    onClick={(e) => copyReference(e, p.referenceNumber)}
                                    className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0 cursor-pointer"
                                    title="Copy Reference"
                                >
                                    {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* STATUS STRIP */}
                <div className="flex justify-between items-center text-[11px] sm:text-xs bg-white px-3.5 py-2.5 rounded-2xl border border-slate-200/70 shadow-2xs">
                    <span className="text-slate-500 font-semibold">Payment Status</span>

                    <span
                        className={cn(
                            "px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-bold tracking-tight border",
                            p.status === "SUCCESS"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                                : "bg-amber-50 text-amber-700 border-amber-200/80"
                        )}
                    >
                        {p.status || "Completed"}
                    </span>
                </div>
            </div>

            {/* ACTION STRIP */}
            {showActions && (
                <div className="flex items-center p-2.5 gap-2 bg-white border-t border-slate-200/80">

                    <Button
                        variant="outline"
                        className="flex-1 bg-indigo-50 text-indigo-600 rounded-xl h-9 text-xs font-semibold border border-slate-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(p);
                        }}
                    >
                        <Edit2 size={13} className="mr-1.5 shrink-0" />
                        Update
                    </Button>

                    <ConfirmDialog
                        type="delete"
                        onConfirm={() => handleDelete(p)}
                        description={
                            <>
                                Move payment{" "}
                                <span className="font-bold text-slate-900">
                                    "#{p.paymentNumber}"
                                </span>{" "}
                                to trash?
                            </>
                        }
                    >
                        <Button
                            variant="outline"
                            className="flex-1 bg-rose-50 text-rose-600 rounded-xl h-9 text-xs font-semibold border border-slate-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Trash2 size={13} className="mr-1.5 shrink-0" />
                            Remove
                        </Button>
                    </ConfirmDialog>
                </div>
            )}
        </div>
    );
}