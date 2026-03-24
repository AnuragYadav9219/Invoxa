import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDate, COLORS } from "@/utils/invoiceUtils";

export default function InvoiceCard({ inv, navigate, isMobile, showActions = false }) {
    const color = COLORS[(inv.customerName?.charCodeAt(0) || 0) % COLORS.length];

    return (
        <div className="bg-white p-4 rounded-2xl shadow-md border space-y-3">
            <div className="flex justify-between items-center">
                <span className="font-semibold">{inv.invoiceNumber}</span>
                <StatusBadge status={inv.status} />
            </div>

            <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", color)}>
                    {inv.customerName?.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold">{inv.customerName}</p>
                    <p className="text-xs text-gray-500">{inv.customerEmail || "No email"}</p>
                </div>
            </div>

            {isMobile ? (
                <div className="grid grid-cols-3 text-sm text-center">
                    <div><p>Total</p><p>{formatCurrency(inv.totalAmount)}</p></div>
                    <div><p>Paid</p><p className="text-green-600">{formatCurrency(inv.paidAmount)}</p></div>
                    <div><p>Due</p><p className="text-red-600">{formatCurrency(inv.remainingAmount)}</p></div>
                </div>
            ) : (
                <div className="text-sm space-y-1">
                    <p>Total: {formatCurrency(inv.totalAmount)}</p>
                    <p className="text-green-600">Paid: {formatCurrency(inv.paidAmount)}</p>
                    <p className="text-red-600">Due: {formatCurrency(inv.remainingAmount)}</p>
                </div>
            )}

            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{formatDate(inv.dueDate)}</span>

                {showActions && (
                    <div className="flex gap-2">

                        {/* EDIT */}
                        <Button
                            size="lg"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => navigate(`/invoices/edit/${inv.id}`)}
                        >
                            Edit
                        </Button>

                        {/* PAY */}
                        {inv.remainingAmount > 0 && (
                            <Button
                                size="lg"
                                className="bg-green-600 cursor-pointer hover:bg-green-700 text-white"
                                onClick={() => navigate(`/invoices/pay/${inv.id}`)}
                            >
                                Pay
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}