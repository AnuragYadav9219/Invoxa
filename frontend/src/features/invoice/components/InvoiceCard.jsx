import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { COLORS, formatCurrency, formatDate } from "@/utils/formatters";
import { Edit2, Trash2, ChevronRight, User, CalendarDays } from "lucide-react";
import { useInvoiceActions } from "../hooks/useInvoiceActions";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function InvoiceCard({
  inv,
  navigate,
  showActions = false,
  onEdit,
}) {
  const { handleDelete } = useInvoiceActions();

  const color = COLORS[(inv.customerName?.charCodeAt(0) || 0) % COLORS.length];

  const progress =
    inv.totalAmount > 0
      ? Math.min(Math.max((inv.paidAmount / inv.totalAmount) * 100, 0), 100)
      : 0;

  const barColor =
    inv.status === "PAID"
      ? "bg-emerald-500"
      : inv.status === "OVERDUE"
        ? "bg-rose-500"
        : "bg-indigo-600";

  const handleNavigation = () => navigate(`/invoices/${inv.id}`);

  return (
    <div className="group bg-white rounded-2xl sm:rounded-[24px] border border-slate-200/90 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(79,70,229,0.08)] hover:border-indigo-300 transition-all duration-300 overflow-hidden w-full min-w-0 relative flex flex-col justify-between">

      {/* Decorative top status stripe */}
      <div className={`h-1 w-full ${
        inv.status === "PAID" 
          ? "bg-emerald-500" 
          : inv.status === "OVERDUE" 
            ? "bg-rose-500" 
            : "bg-indigo-600"
      }`} />

      {/* CLICK AREA */}
      <div
        onClick={handleNavigation}
        className="p-4 sm:p-5 cursor-pointer relative z-10 space-y-4"
      >
        {/* HEADER */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={cn(
                "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-sm transition-transform group-hover:scale-105 shrink-0 text-sm sm:text-base",
                color
              )}
            >
              {inv.customerName?.charAt(0) || <User size={18} />}
            </div>

            <div className="flex flex-col min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors truncate tracking-tight">
                  {inv.customerName}
                </h4>
                <ChevronRight
                  size={14}
                  className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0"
                />
              </div>

              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-flex items-center w-fit border border-indigo-100 truncate">
                #{inv.invoiceNumber}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <StatusBadge status={inv.status} />
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-center">
          <Stat
            label="Total"
            value={formatCurrency(inv.totalAmount)}
          />

          <Stat
            label="Paid"
            value={formatCurrency(inv.paidAmount)}
            className="border-x border-slate-200/60 px-1"
            valueClass="text-emerald-600 font-semibold"
          />

          <Stat
            label="Balance"
            value={formatCurrency(inv.remainingAmount)}
            valueClass={inv.remainingAmount > 0 ? "text-rose-600 font-semibold" : "text-slate-500"}
          />
        </div>

        {/* PROGRESS BAR SECTION */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">
              Payment Progress
            </span>
            <span className="font-bold text-slate-900">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                barColor
              )}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center pt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <CalendarDays size={13} className="text-slate-400 shrink-0" /> Due Date
            </span>
            <span className="text-slate-700 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60 truncate">
              {formatDate(inv.dueDate)}
            </span>
          </div>
        </div>
      </div>

      {/* ACTIONS ROW */}
      {showActions && (
        <div className="flex items-center p-3 gap-2.5 bg-slate-50/70 border-t border-slate-100 relative z-10">
          {inv.remainingAmount > 0 && (
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl h-10 text-xs font-semibold transition-all border-slate-200 shadow-2xs active:scale-95 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(inv);
              }}
            >
              <Edit2 size={13} className="mr-1.5 shrink-0 text-slate-500" />
              Update
            </Button>
          )}

          <ConfirmDialog
            type="delete"
            onConfirm={() => handleDelete(inv)}
            description={
              <>
                Move invoice{" "}
                <span className="font-bold text-slate-900">
                  #{inv.invoiceNumber}
                </span>{" "}
                to trash?
              </>
            }
          >
            <Button
              type="button"
              variant="outline"
              className={cn(
                "bg-white hover:bg-rose-50 hover:text-rose-600 text-rose-600 rounded-xl h-10 text-xs font-semibold border-slate-200 shadow-2xs active:scale-95 cursor-pointer",
                inv.remainingAmount > 0 ? "flex-1" : "w-full"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 size={13} className="mr-1.5 shrink-0 text-rose-500" />
              Delete
            </Button>
          </ConfirmDialog>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE STAT COMPONENT ================= */

function Stat({ label, value, className, valueClass }) {
  return (
    <div className={cn("flex flex-col min-w-0 space-y-0.5", className)}>
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
        {label}
      </span>
      <span
        className={cn(
          "text-xs sm:text-sm font-bold text-slate-800 truncate",
          valueClass
        )}
      >
        {value}
      </span>
    </div>
  );
}