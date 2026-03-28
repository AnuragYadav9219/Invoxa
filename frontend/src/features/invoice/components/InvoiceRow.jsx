import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, FileText, Calendar, User } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { COLORS, formatCurrency, formatDate } from "@/utils/formatters";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

export default function InvoiceRow({
  inv,
  navigate,
  showActions = false,
  onEdit,
  onDelete,
}) {
  const [openDelete, setOpenDelete] = useState(false);

  const color = COLORS[(inv.customerName?.charCodeAt(0) || 0) % COLORS.length];

  return (
    <>
      <TableRow
        onClick={() => navigate(`/invoices/${inv.id}`)}
        className="group hover:bg-slate-50/50 transition-colors cursor-pointer border-b border-slate-100"
      >
        {/* 1. INVOICE NUMBER */}
        <TableCell className="pl-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
              <FileText size={16} />
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-none">
                {inv.invoiceNumber}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {inv.items?.length || 0} {inv.items?.length === 1 ? 'item' : 'items'}
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
              {inv.customerName?.charAt(0) || <User size={14} />}
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-slate-700 leading-tight">
                {inv.customerName}
              </p>
              <p className="text-xs text-slate-400 truncate max-w-35">
                {inv.customerEmail || "No email"}
              </p>
            </div>
          </div>
        </TableCell>

        {/* 3. AMOUNTS */}
        <TableCell className="font-semibold text-slate-700">
          {formatCurrency(inv.totalAmount)}
        </TableCell>

        <TableCell className="font-bold text-emerald-600">
          {formatCurrency(inv.paidAmount)}
        </TableCell>

        <TableCell>
          <span className={cn(
            "font-bold px-2 py-1 rounded-md text-sm whitespace-nowrap",
            inv.remainingAmount > 0 
              ? "text-rose-600 bg-rose-50/50" 
              : "text-slate-500 bg-slate-100"
          )}>
            {formatCurrency(inv.remainingAmount)}
          </span>
        </TableCell>

        {/* 4. STATUS */}
        <TableCell>
          <StatusBadge status={inv.status} />
        </TableCell>

        {/* 5. DUE DATE */}
        <TableCell>
          <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
            <Calendar size={14} className="text-slate-300" />
            <span className="text-sm font-medium">{formatDate(inv.dueDate)}</span>
          </div>
        </TableCell>

        {/* 6. ACTIONS (ALWAYS VISIBLE) */}
        <TableCell
          className={cn(
            "text-right pr-6",
            !showActions && "hidden"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-9 w-9 p-0 cursor-pointer border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all shadow-sm active:scale-90"
              onClick={() => onEdit(inv)}
              title="Edit Invoice"
            >
              <Edit2 size={15} />
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-9 w-9 p-0 cursor-pointer border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm active:scale-90"
              onClick={() => setOpenDelete(true)}
              title="Delete Invoice"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {/* DELETE MODAL */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="rounded-[2rem] max-w-100">
          <AlertDialogHeader>
            <div className="mx-auto p-3 bg-rose-50 rounded-full w-fit mb-2">
              <Trash2 className="text-rose-600 h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-center font-bold text-xl">Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-500">
              Are you sure you want to delete invoice <span className="font-bold text-slate-900">{inv.invoiceNumber}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3 mt-4">
            <AlertDialogCancel className="rounded-xl font-bold flex-1 cursor-pointer border-slate-200" onClick={(e) => e.stopPropagation()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 cursor-pointer hover:bg-rose-700 rounded-xl font-bold flex-1 shadow-lg shadow-rose-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(inv.id);
                setOpenDelete(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}