import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
    Edit2,
    Trash2,
    CreditCard,
    Calendar,
    User,
    Receipt,
} from "lucide-react";

import { COLORS, formatCurrency, formatDate } from "@/utils/formatters";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { usePaymentActions } from "../hooks/usePaymentActions";

export default function PaymentRow({
    p,
    navigate,
    showActions = false,
    onEdit,
}) {
    const { handleDelete, handleMarkAsPaid } = usePaymentActions();

    const color = COLORS[(p.customerName?.charCodeAt(0) || 0) % COLORS.length];

    const handleNavigation = () => navigate(`/payments/${p.id}`);

    return (
        <TableRow
            onClick={handleNavigation}
            className="group hover:bg-slate-50/50 transition-colors cursor-pointer border-b border-slate-100"
        >
            {/* 1. PAYMENT */}
            <TableCell className="py-4">
                <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-slate-100/80 rounded-xl text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50/80 transition-all shadow-2xs">
                        <Receipt size={17} />
                    </div>

                    <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-900 transition-colors leading-tight">
                            {p.paymentNumber || "PAY-001"}
                        </p>

                        <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate max-w-35">
                            Ref: {p.referenceNumber || "N/A"}
                        </p>
                    </div>
                </div>
            </TableCell>

            {/* 2. CUSTOMER */}
            <TableCell className="py-4">
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold text-white shadow-sm ring-4 ring-slate-50/50 group-hover:scale-105 transition-transform shrink-0",
                            color
                        )}
                    >
                        {p.customerName?.charAt(0) || <User size={15} />}
                    </div>

                    <div className="flex flex-col min-w-0">
                        <p className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors leading-tight truncate">
                            {p.customerName}
                        </p>

                        <p className="text-xs text-slate-400 truncate max-w-40 mt-0.5 font-medium">
                            {p.customerEmail || "No email provided"}
                        </p>
                    </div>
                </div>
            </TableCell>

            {/* 3. AMOUNT */}
            <TableCell className="py-4 font-extrabold text-emerald-600 text-sm sm:text-base">
                {formatCurrency(p.amount)}
            </TableCell>

            {/* 4. METHOD */}
            <TableCell className="py-4">
                <div className="flex items-center gap-2 text-slate-600">
                    <div className="p-1.5 rounded-lg bg-slate-100/60 text-slate-400">
                        <CreditCard size={13} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{p.method}</span>
                </div>
            </TableCell>

            {/* 5. INVOICE LINK */}
            <TableCell className="py-4">
                <span className="text-indigo-600 font-bold text-xs bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-100/60 inline-block">
                    #{p.invoiceNumber}
                </span>
            </TableCell>

            {/* 6. DATE */}
            <TableCell className="py-4">
                <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                    <div className="p-1.5 rounded-lg bg-slate-100/50 text-slate-400">
                        <Calendar size={13} />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                        {formatDate(p.paymentDate)}
                    </span>
                </div>
            </TableCell>

            {/* 7. STATUS */}
            <TableCell className="py-4">
                <span
                    className={cn(
                        "px-3 py-1 rounded-xl text-xs font-bold tracking-tight border inline-block",
                        p.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                            : "bg-amber-50 text-amber-700 border-amber-200/80"
                    )}
                >
                    {p.status || "Completed"}
                </span>
            </TableCell>

            {/* 8. ACTIONS */}
            <TableCell
                className={cn(
                    "text-right pr-6 py-4",
                    !showActions && "hidden"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end gap-1.5">

                    {/* UPDATE */}
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 p-0 cursor-pointer border-slate-200/80 bg-white text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 rounded-xl transition-all shadow-2xs active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(p);
                        }}
                        title="Update Payment"
                    >
                        <Edit2 size={14} />
                    </Button>

                    {/* DELETE */}
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
                            size="icon"
                            variant="outline"
                            className="h-9 w-9 p-0 cursor-pointer border-slate-200/80 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 rounded-xl transition-all shadow-2xs active:scale-95"
                            onClick={(e) => e.stopPropagation()}
                            title="Remove Payment"
                        >
                            <Trash2 size={14} />
                        </Button>
                    </ConfirmDialog>

                </div>
            </TableCell>
        </TableRow>
    );
}