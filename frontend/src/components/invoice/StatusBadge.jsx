import { cn } from "@/lib/utils";

export default function StatusBadge({ status }) {
    const styles = {
        PAID: "bg-green-50 text-green-700 border border-green-200",
        PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        PARTIALLY_PAID: "bg-blue-50 text-blue-700 border border-blue-200",
        OVERDUE: "bg-red-50 text-red-700 border border-red-200",
    };

    const labels = {
        PAID: "✔ Paid",
        PENDING: "⏳ Pending",
        PARTIALLY_PAID: "🔵 Partial",
        OVERDUE: "⚠ Overdue",
    };

    return (
        <span className={cn(
            "px-3 py-1 text-xs font-medium rounded-full shadow-sm",
            styles[status] || "bg-gray-100 text-gray-600"
        )}>
            {labels[status] || status}
        </span>
    );
}