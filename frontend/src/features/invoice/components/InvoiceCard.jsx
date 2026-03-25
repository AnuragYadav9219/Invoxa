import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { COLORS, formatCurrency, formatDate } from "@/utils/formatters";

export default function InvoiceCard({
    inv,
    navigate,
    isMobile,
    showActions = false,
}) {
    const color =
        COLORS[(inv.customerName?.charCodeAt(0) || 0) % COLORS.length];

    const progress =
        inv.totalAmount > 0
            ? (inv.paidAmount / inv.totalAmount) * 100
            : 0;

    const barColor =
        inv.status === "PAID"
            ? "from-green-400 to-green-600"
            : inv.status === "OVERDUE"
                ? "from-red-400 to-red-600"
                : "from-yellow-400 to-yellow-500";

    return (
        <div
            onClick={() => navigate(`/invoices/${inv.id}`)}
            className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer space-y-4"
        >
            {/* Top */}
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-gray-500">Invoice No.</p>
                    <p className="font-semibold text-lg tracking-tight">
                        {inv.invoiceNumber}
                    </p>
                </div>

                <StatusBadge status={inv.status} />
            </div>

            {/* Customer */}
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "w-11 h-11 rounded-full flex items-center justify-center font-semibold text-white shadow-sm",
                        color
                    )}
                >
                    {inv.customerName?.charAt(0)}
                </div>

                <div>
                    <p className="font-medium">{inv.customerName}</p>
                    <p className="text-xs text-gray-500">
                        {inv.customerEmail || "No email"}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Amounts */}
            {isMobile ? (
                <div className="grid grid-cols-3 text-center">
                    <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-semibold">
                            {formatCurrency(inv.totalAmount)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Paid</p>
                        <p className="font-semibold text-green-600">
                            {formatCurrency(inv.paidAmount)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Due</p>
                        <p className="font-semibold text-red-600">
                            {formatCurrency(inv.remainingAmount)}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex justify-between">
                    <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-semibold">
                            {formatCurrency(inv.totalAmount)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Paid</p>
                        <p className="font-semibold text-green-600">
                            {formatCurrency(inv.paidAmount)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Due</p>
                        <p className="font-semibold text-red-600">
                            {formatCurrency(inv.remainingAmount)}
                        </p>
                    </div>
                </div>
            )}

            {/* Paid Progress Bar */}
            <div className="space-y-1">
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 bg-linear-to-r ${barColor}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex justify-between text-[10px] text-gray-500">
                    <span>{inv.status}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>


            {/* Bottom */}
            <div className="flex justify-between items-center pt-2">
                <p className="text-xs text-gray-500">
                    Due:{" "}
                    <span className="font-medium text-gray-700">
                        {formatDate(inv.dueDate)}
                    </span>
                </p>

                {showActions && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>

                        {/* EDIT only if not fully paid */}
                        {inv.remainingAmount > 0 && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg"
                                onClick={() => navigate(`/invoices/edit/${inv.id}`)}
                            >
                                Edit
                            </Button>
                        )}

                        {/* PAY / PAID */}
                        {inv.remainingAmount > 0 ? (
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                onClick={() => navigate(`/invoices/pay/${inv.id}`)}
                            >
                                Pay
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                disabled
                                className="rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
                            >
                                Paid
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}