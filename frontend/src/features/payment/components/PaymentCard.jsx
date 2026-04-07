import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COLORS, formatCurrency, formatDate } from "@/utils/formatters";
import { Edit2, Trash2, ChevronRight, User, CreditCard } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { usePaymentActions } from "../hooks/usePaymentActions";

export default function PaymentCard({
    p,
    navigate,
    showActions = false,
    onEdit,
}) {
    const { handleDelete } = usePaymentActions();

    const color = COLORS[(p.customerName?.charCodeAt(0) || 0) % COLORS.length];

    const handleNavigation = () => navigate(`/payments/${p.id}`);

    return (
        <div className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">

            {/* MAIN CLICK AREA */}
            <div
                onClick={handleNavigation}
                className="p-6 cursor-pointer active:bg-slate-50 transition-colors"
            >

                {/* TOP SECTION */}
                <div className="flex justify-between items-start mb-5">

                    {/* CUSTOMER */}
                    <div className="flex items-center gap-4">
                        <div
                            className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-inner ring-4 ring-slate-50 group-hover:scale-105 transition-transform",
                                color
                            )}
                        >
                            {p.customerName?.charAt(0) || <User size={20} />}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <h4 className="font-bold text-slate-900 truncate max-w-32">
                                    {p.customerName}
                                </h4>
                                <ChevronRight
                                    size={14}
                                    className="text-slate-300 group-hover:text-blue-500"
                                />
                            </div>

                            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                                #{p.paymentNumber || "PAY-001"}
                            </p>
                        </div>
                    </div>

                    {/* AMOUNT */}
                    <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase font-bold">
                            Amount
                        </p>
                        <p className="text-lg font-bold text-emerald-600">
                            {formatCurrency(p.amount)}
                        </p>
                    </div>
                </div>

                {/* PAYMENT DETAILS GRID */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-white/60 mb-5">

                    {/* METHOD */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                            Method
                        </span>
                        <div className="flex items-center gap-2">
                            <CreditCard size={14} className="text-slate-400" />
                            <span className="text-sm font-bold text-slate-800">
                                {p.method}
                            </span>
                        </div>
                    </div>

                    {/* DATE */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                            Date
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                            {formatDate(p.paymentDate)}
                        </span>
                    </div>

                    {/* INVOICE */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                            Invoice
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                            #{p.invoiceNumber}
                        </span>
                    </div>

                    {/* REFERENCE */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                            Reference
                        </span>
                        <span className="text-sm font-semibold text-slate-700 truncate">
                            {p.referenceNumber || "N/A"}
                        </span>
                    </div>
                </div>

                {/* STATUS STRIP */}
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Payment Status</span>

                    <span
                        className={cn(
                            "px-3 py-1 rounded-full font-bold",
                            p.status === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-amber-100 text-amber-600"
                        )}
                    >
                        {p.status || "Completed"}
                    </span>
                </div>
            </div>

            {/* ACTION STRIP */}
            {showActions && (
                <div className="flex p-3 gap-2 bg-slate-50/50 border-t border-slate-100">

                    <Button
                        variant="secondary"
                        className="flex-1 bg-white cursor-pointer hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl h-10 text-xs font-bold border shadow-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(p);
                        }}
                    >
                        <Edit2 size={14} className="mr-2" />
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
                                </span>{" "} to trash?
                            </>
                        }
                    >
                        <Button
                            variant="secondary"
                            className="flex-1 bg-white cursor-pointer text-rose-600 rounded-xl h-10 text-xs font-bold border shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Trash2 size={14} className="mr-2" />
                            Remove
                        </Button>
                    </ConfirmDialog>
                </div>
            )}
        </div>
    );
}