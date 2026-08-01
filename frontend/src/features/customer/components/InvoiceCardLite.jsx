import { formatCurrency } from "@/utils/formatters";
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  Package,
} from "lucide-react";

export default function InvoiceCardLite({ inv, navigate, isMobile }) {
  const total = Number(inv.totalAmount || 0);
  const paid = Number(inv.paidAmount || 0);
  const pending = total - paid;

  const progress = total ? Math.min(Math.max((paid / total) * 100, 0), 100) : 0;
  const isPaid = pending <= 0;

  return (
    <div
      onClick={() => navigate(`/invoices/${inv.id}`)}
      className={`group cursor-pointer bg-white rounded-2xl border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-6px_rgba(79,70,229,0.12)] hover:border-indigo-100/80 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        isMobile ? 'p-4' : 'p-6'
      }`}
    >
      {/* Background Ambient Glow on Hover */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 w-full space-y-4">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1 min-w-0">
            <h2 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-indigo-600 transition-colors duration-200 truncate flex items-center gap-2">
              {inv.invoiceNumber}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Package size={12} className="text-slate-300" />
              <span>{inv.items?.length || 0} {(inv.items?.length === 1) ? 'item' : 'items'}</span>
            </p>
          </div>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs shrink-0 select-none transition-transform duration-300 group-hover:scale-105 ${
              isPaid
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : "bg-amber-50 text-amber-700 border border-amber-200/60"
            }`}
          >
            {isPaid ? <CheckCircle2 size={13} className="text-emerald-500" /> : <AlertCircle size={13} className="text-amber-500" />}
            <span>{isPaid ? "Paid" : "Pending"}</span>
          </span>
        </div>

        {/* FINANCIAL MAIN DISPLAY */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Total Amount</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(total)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-2xs">
            <ArrowUpRight size={16} />
          </div>
        </div>

        {/* PROGRESS BAR SECTION */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] font-medium text-slate-400">
            <span className="text-emerald-600 font-semibold">Paid: {formatCurrency(paid)}</span>
            <span className={pending > 0 ? "text-rose-600 font-semibold" : "text-slate-400"}>
              Due: {formatCurrency(pending)}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/40">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isPaid ? 'bg-emerald-500' : 'bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* FOOTER SECTION */}
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <Wallet size={12} className="text-indigo-500" />
            <span className="text-slate-600 font-medium">Invoice Total</span>
          </div>

          {inv.dueDate && (
            <div className="flex items-center gap-1 text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              <Calendar size={12} className="text-slate-400" />
              <span>{inv.dueDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}