import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";
import { Phone } from "lucide-react";

export default function CustomerRow({ customer, navigate }) {
  const pending = Number(customer.pendingAmount || 0);

  return (
    <TableRow
      onClick={() =>
        navigate(`/customers/${encodeURIComponent(customer.name)}`)
      }
      className="group cursor-pointer border-b border-slate-100 transition-all hover:bg-purple-50/60 hover:shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
    >
      {/* CUSTOMER */}
      <TableCell className="pl-6 py-4">
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-md ring-2 ring-white group-hover:scale-105 transition">
              {customer.name?.charAt(0)}
            </div>

            {/* Glow */}
            <div className="absolute inset-0 rounded-xl bg-purple-400/20 blur-md opacity-0 group-hover:opacity-100 transition"></div>
          </div>

          {/* Name + Phone */}
          <div className="flex flex-col">
            <p className="font-semibold text-slate-800 leading-tight group-hover:text-indigo-600 transition">
              {customer.name}
            </p>
          </div>
        </div>
      </TableCell>

      {/* PHONE */}
      <TableCell className="text-slate-600 font-medium">
        <span className="bg-slate-50 w-fit px-2 py-0.5 flex items-center gap-1.5 rounded-md border border-slate-100">
          <Phone size={13} className="text-indigo-600" />
          {customer.phone || "—"}
        </span>
      </TableCell>

      {/* TOTAL */}
      <TableCell>
        <span className="font-bold text-slate-800 text-sm">
          {formatCurrency(customer.totalAmount)}
        </span>
      </TableCell>

      <TableCell>
        <span className="font-bold text-emerald-600 text-sm">
          {formatCurrency(customer.paidAmount)}
        </span>
      </TableCell>

      <TableCell>
        <span
          className={`px-3 py-1 text-xs rounded-full font-semibold ${
            pending > 0
              ? "bg-rose-100 text-rose-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {formatCurrency(pending)}
        </span>
      </TableCell>

      {/* INVOICES */}
      <TableCell>
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600 font-medium group-hover:bg-indigo-200 transition">
          {customer.invoiceCount}
        </span>
      </TableCell>
    </TableRow>
  );
}