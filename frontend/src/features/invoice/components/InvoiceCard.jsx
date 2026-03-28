import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { COLORS, formatCurrency, formatDate } from "@/utils/formatters";
import { Edit2, Trash2, ChevronRight, User } from "lucide-react";

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

export default function InvoiceCard({
  inv,
  navigate,
  showActions = false,
  onEdit,
  onDelete,
}) {
  const [openDelete, setOpenDelete] = useState(false);

  const color = COLORS[(inv.customerName?.charCodeAt(0) || 0) % COLORS.length];

  const progress = inv.totalAmount > 0 ? (inv.paidAmount / inv.totalAmount) * 100 : 0;

  const barColor =
    inv.status === "PAID"
      ? "bg-emerald-500"
      : inv.status === "OVERDUE"
      ? "bg-rose-500"
      : "bg-amber-500";

  const handleNavigation = () => navigate(`/invoices/${inv.id}`);

  return (
    <>
      <div className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        
        {/* Header through Progress */}
        <div 
          onClick={handleNavigation}
          className="p-6 cursor-pointer active:bg-slate-50 transition-colors"
        >
          {/* TOP SECTION: Customer & Status */}
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-inner ring-4 ring-slate-50 transition-transform group-hover:scale-105",
                color
              )}>
                {inv.customerName?.charAt(0) || <User size={20} />}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-slate-900 leading-tight truncate max-w-30">
                    {inv.customerName}
                  </h4>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="text-[11px] font-bold text-blue-600 tracking-widest uppercase mt-0.5">
                  #{inv.invoiceNumber}
                </p>
              </div>
            </div>
            <StatusBadge status={inv.status} />
          </div>

          {/* STATS GRID: Modern Data Presentation */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-white/60 mb-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Total</span>
              <span className="text-sm font-bold text-slate-800 tracking-tight">{formatCurrency(inv.totalAmount)}</span>
            </div>
            <div className="flex flex-col gap-1 border-x border-slate-200/50 px-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Paid</span>
              <span className="text-sm font-bold text-emerald-600 tracking-tight">{formatCurrency(inv.paidAmount)}</span>
            </div>
            <div className="flex flex-col gap-1 pl-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Balance</span>
              <span className="text-sm font-bold text-rose-600 tracking-tight">{formatCurrency(inv.remainingAmount)}</span>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Payment Progress</span>
              <span className="font-bold text-slate-900">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-50">
              <div
                className={cn("h-full rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(0,0,0,0.05)]", barColor)}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Due on <span className="text-slate-600 font-semibold">{formatDate(inv.dueDate)}</span>
            </p>
          </div>
        </div>

        {/* ACTION STRIP: Fixed at bottom */}
        {showActions && (
          <div className="flex p-3 gap-2 bg-slate-50/50 border-t border-slate-100">
            {inv.remainingAmount > 0 && (
              <Button
                variant="secondary"
                className="flex-1 bg-white cursor-pointer hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl h-10 text-xs font-bold transition-all border border-slate-200 shadow-sm active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(inv);
                }}
              >
                <Edit2 size={14} className="mr-2" />
                Update
              </Button>
            )}
            <Button
              variant="secondary"
              className="flex-1 bg-white cursor-pointer hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl h-10 text-xs font-bold transition-all border border-slate-200 shadow-sm active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDelete(true);
              }}
            >
              <Trash2 size={14} className="mr-2" />
              Remove
            </Button>
          </div>
        )}
      </div>

      {/* DELETE DIALOG: Same logic, tighter styling */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="rounded-[2rem] w-[92vw] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900 text-center">Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-center px-2">
              Are you sure you want to delete <span className="font-bold text-slate-900">#{inv.invoiceNumber}</span>? This data cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <AlertDialogCancel 
              className="flex-1 rounded-2xl h-12 cursor-pointer border-slate-200 font-bold"
              onClick={(e) => e.stopPropagation()}
            >
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 rounded-2xl h-12 cursor-pointer bg-rose-600 hover:bg-rose-700 font-bold shadow-lg shadow-rose-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(inv.id);
                setOpenDelete(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}