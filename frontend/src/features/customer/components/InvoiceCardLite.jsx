import { formatCurrency } from "@/utils/formatters";
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";

export default function InvoiceCardLite({ inv, navigate, isMobile }) {
  const total = Number(inv.totalAmount || 0);
  const paid = Number(inv.paidAmount || 0);
  const pending = total - paid;

  const progress = total ? (paid / total) * 100 : 0;
  const isPaid = pending === 0;

  return (
    <div
      onClick={() => navigate(`/invoices/${inv.id}`)}
      className="group cursor-pointer p-4 md:p-5 rounded-2xl bg-white border border-slate-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-100 to-purple-100 opacity-0 group-hover:opacity-40 transition"></div>

      <div className="relative z-10">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition">
              {inv.invoiceNumber}
            </h2>
            <p className="text-xs text-slate-400">
              {inv.items?.length || 0} items
            </p>
          </div>

          <span
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isPaid
                ? "bg-emerald-100 text-emerald-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            {isPaid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
            {isPaid ? "Paid" : "Pending"}
          </span>
        </div>

        {/* Amount */}
        <div className="mt-4">
          <p className="text-emerald-600 font-bold text-lg">
            {formatCurrency(total)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>Paid {formatCurrency(paid)}</span>
            <span>Pending {formatCurrency(pending)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 flex justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Wallet size={12} />
            Total
          </span>

          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {inv.dueDate}
          </span>
        </div>
      </div>
    </div>
  );
}