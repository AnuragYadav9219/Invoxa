import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, CreditCard } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { COLORS, formatCurrency, formatDate } from "@/utils/formatters";

export default function InvoiceRow({
  inv,
  navigate,
  showActions = false,
  onEdit,
  onDelete,
}) {
  const color = COLORS[(inv.customerName?.charCodeAt(0) || 0) % COLORS.length];
  const isPaid = inv.status === "PAID";

  return (
    <TableRow
      onClick={() => navigate(`/invoices/${inv.id}`)}
      className="hover:bg-gray-50 transition cursor-pointer border-b"
    >
      {/* INVOICE */}
      <TableCell className="pl-6 py-4">
        <p className="font-semibold">{inv.invoiceNumber}</p>
        <p className="text-xs text-gray-400">
          {inv.items?.length || 0} items
        </p>
      </TableCell>

      {/* CUSTOMER */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm",
              color
            )}
          >
            {inv.customerName?.charAt(0)}
          </div>

          <div>
            <p className="font-semibold">{inv.customerName}</p>
            <p className="text-xs text-gray-500">
              {inv.customerEmail || "No email"}
            </p>
          </div>
        </div>
      </TableCell>

      {/* AMOUNTS */}
      <TableCell className="font-medium">
        {formatCurrency(inv.totalAmount)}
      </TableCell>

      <TableCell className="text-green-600 font-medium">
        {formatCurrency(inv.paidAmount)}
      </TableCell>

      <TableCell
        className={cn(
          "font-semibold",
          inv.remainingAmount > 0 ? "text-red-600" : "text-gray-500"
        )}
      >
        {formatCurrency(inv.remainingAmount)}
      </TableCell>

      {/* STATUS */}
      <TableCell>
        <StatusBadge status={inv.status} />
      </TableCell>

      {/* DATE */}
      <TableCell className="text-sm text-gray-600">
        {formatDate(inv.dueDate)}
      </TableCell>

      {/* ACTION (ALWAYS PRESENT → FIXED) */}
      <TableCell
        className={cn(
          "text-right pr-6",
          !showActions && "opacity-0 pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()} // prevent row click
      >
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(inv)}
            className="cursor-pointer"
          >
            Edit
          </Button>


          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(inv.id)}
            className="cursor-pointer"
          >
            Delete
          </Button>

        </div>
      </TableCell>
    </TableRow>
  );
}