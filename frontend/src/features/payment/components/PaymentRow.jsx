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
            <TableCell className="pl-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                        <Receipt size={16} />
                    </div>

                    <div>
                        <p className="font-bold text-slate-900 leading-none">
                            {p.paymentNumber || "PAY-001"}
                        </p>

                        <p className="text-[11px] text-slate-400 mt-1">
                            Ref: {p.referenceNumber || "N/A"}
                        </p>
                    </div>
                </div>
            </TableCell>

            {/* 2. CUSTOMER */}
            <TableCell>
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white",
                            color
                        )}
                    >
                        {p.customerName?.charAt(0) || <User size={14} />}
                    </div>

                    <div className="flex flex-col">
                        <p className="font-semibold text-slate-700 leading-tight">
                            {p.customerName}
                        </p>

                        <p className="text-xs text-slate-400 truncate max-w-35">
                            {p.customerEmail || "No email"}
                        </p>
                    </div>
                </div>
            </TableCell>

            {/* 3. AMOUNT */}
            <TableCell className="font-bold text-emerald-600">
                {formatCurrency(p.amount)}
            </TableCell>

            {/* 4. METHOD */}
            <TableCell>
                <div className="flex items-center gap-2 text-slate-600">
                    <CreditCard size={14} className="text-slate-400" />
                    <span className="text-sm font-medium">{p.method}</span>
                </div>
            </TableCell>

            {/* 5. INVOICE LINK */}
            <TableCell>
                <span className="text-blue-600 font-semibold text-sm">
                    #{p.invoiceNumber}
                </span>
            </TableCell>

            {/* 6. DATE */}
            <TableCell>
                <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                    <Calendar size={14} className="text-slate-300" />
                    <span className="text-sm font-medium">
                        {formatDate(p.paymentDate)}
                    </span>
                </div>
            </TableCell>

            {/* 7. STATUS */}
            <TableCell>
                <span
                    className={cn(
                        "px-2 py-1 rounded-md text-xs font-bold",
                        p.status === "SUCCESS"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-amber-100 text-amber-600"
                    )}
                >
                    {p.status || "Completed"}
                </span>
            </TableCell>

            {/* 8. ACTIONS */}
            <TableCell
                className={cn(
                    "text-right pr-6",
                    !showActions && "hidden"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end gap-2">

                    {/* UPDATE */}
                    <Button
                        variant="secondary"
                        className="h-9 px-3 bg-white cursor-pointer hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl text-xs font-bold border shadow-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(p);
                        }}
                    >
                        <Edit2 size={14} className="mr-1" />
                        Update
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
                            variant="secondary"
                            className="h-9 px-3 bg-white cursor-pointer text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold border shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Trash2 size={14} className="mr-1" />
                            Remove
                        </Button>
                    </ConfirmDialog>

                </div>
            </TableCell>
        </TableRow>
    );
}