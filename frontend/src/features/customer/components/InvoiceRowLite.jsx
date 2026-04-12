import { TableRow, TableCell } from "@/components/ui/table";
import StatusBadge from "@/features/invoice/components/StatusBadge";
import { formatCurrency } from "@/utils/formatters";
import { Calendar } from "lucide-react";

export default function InvoiceRowLite({ inv, navigate }) {
    const pending =
        Number(inv.totalAmount || 0) - Number(inv.paidAmount || 0);

    return (
        <TableRow
            onClick={() => navigate(`/invoices/${inv.id}`)}
            className="cursor-pointer hover:bg-purple-50/60 transition border-b"
        >
            {/* Invoice */}
            <TableCell className="pl-6 py-4">
                <div>
                    <p className="font-semibold">{inv.invoiceNumber}</p>
                    <p className="text-xs text-gray-400">
                        {inv.items?.length || 0} items
                    </p>
                </div>
            </TableCell>

            {/* Total */}
            <TableCell className="font-semibold text-emerald-600">
                {formatCurrency(inv.totalAmount)}
            </TableCell>

            {/* Paid */}
            <TableCell className="text-blue-600 font-medium">
                {formatCurrency(inv.paidAmount)}
            </TableCell>

            {/* Pending */}
            <TableCell>
                <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${pending > 0
                            ? "bg-rose-100 text-rose-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                >
                    {formatCurrency(pending)}
                </span>
            </TableCell>

            {/* Status */}
            <TableCell>
                <StatusBadge status={inv.status} />
            </TableCell>

            {/* Due Date */}
            <TableCell className="text-gray-500">
                <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {inv.dueDate}
                </div>
            </TableCell>
        </TableRow>
    );
}