import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { COLORS, formatCurrency, formatDate } from "@/utils/formatters";
import { Edit2, Trash2, ChevronRight, User } from "lucide-react";
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
      ? (inv.paidAmount / inv.totalAmount) * 100
      : 0;

  const barColor =
    inv.status === "PAID"
      ? "bg-emerald-500"
      : inv.status === "OVERDUE"
      ? "bg-rose-500"
      : "bg-amber-500";

  const handleNavigation = () => navigate(`/invoices/${inv.id}`);

  return (
    <div className="group bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">

      {/* CLICK AREA */}
      <div
        onClick={handleNavigation}
        className="p-4 sm:p-6 cursor-pointer active:bg-slate-50 transition-colors"
      >
        {/* HEADER */}
        <div className="flex justify-between items-start gap-3 mb-4 sm:mb-5">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-white shadow-inner ring-4 ring-slate-50 transition-transform group-hover:scale-105 shrink-0",
                color
              )}
            >
              {inv.customerName?.charAt(0) || <User size={18} />}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="font-semibold sm:font-bold text-slate-900 truncate max-w-35 sm:max-w-50">
                  {inv.customerName}
                </h4>
                <ChevronRight
                  size={14}
                  className="text-slate-300 group-hover:text-blue-500 transition-colors"
                />
              </div>

              <p className="text-[10px] sm:text-[11px] font-bold text-blue-600 tracking-widest uppercase mt-0.5">
                #{inv.invoiceNumber}
              </p>
            </div>
          </div>

          <StatusBadge status={inv.status} />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 bg-slate-50/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border mb-4 sm:mb-5">
          
          <Stat label="Total" value={formatCurrency(inv.totalAmount)} />

          <Stat
            label="Paid"
            value={formatCurrency(inv.paidAmount)}
            className="sm:border-x sm:px-3 border-slate-200/50"
            valueClass="text-emerald-600"
          />

          {/* Hide on very small screens */}
          <Stat
            label="Balance"
            value={formatCurrency(inv.remainingAmount)}
            valueClass="text-rose-600"
            className="col-span-2 sm:col-span-1"
          />
        </div>

        {/* PROGRESS */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">
              Payment Progress
            </span>
            <span className="font-bold text-slate-900">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                barColor
              )}
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-[10px] sm:text-[11px] text-slate-400 pt-1">
            Due on{" "}
            <span className="text-slate-600 font-semibold">
              {formatDate(inv.dueDate)}
            </span>
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      {showActions && (
        <div className="flex flex-col sm:flex-row p-3 gap-2 bg-slate-50/50 border-t border-slate-100">
          
          {inv.remainingAmount > 0 && (
            <Button
              variant="secondary"
              className="w-full sm:flex-1 bg-white cursor-pointer hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl h-10 text-xs font-semibold transition-all border shadow-sm active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(inv);
              }}
            >
              <Edit2 size={14} className="mr-2" />
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
                  "#{inv.invoiceNumber}"
                </span>{" "}
                to trash?
              </>
            }
          >
            <Button
              variant="secondary"
              className="w-full sm:flex-1 bg-white text-rose-600 rounded-xl h-10 text-xs font-semibold border shadow-sm active:scale-95"
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

/* ================= REUSABLE ================= */

function Stat({ label, value, className, valueClass }) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-tight">
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-semibold text-slate-800",
          valueClass
        )}
      >
        {value}
      </span>
    </div>
  );
}