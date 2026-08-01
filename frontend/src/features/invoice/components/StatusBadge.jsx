import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle, AlertTriangle } from "lucide-react";

export default function StatusBadge({ status }) {
    const config = {
        PAID: {
            style: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-emerald-500/5",
            label: "Paid",
            icon: CheckCircle2,
        },
        PENDING: {
            style: "bg-amber-50 text-amber-700 border border-amber-200/80 shadow-amber-500/5",
            label: "Pending",
            icon: Clock,
        },
        PARTIALLY_PAID: {
            style: "bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-indigo-500/5",
            label: "Partial",
            icon: AlertCircle,
        },
        OVERDUE: {
            style: "bg-rose-50 text-rose-700 border border-rose-200/80 shadow-rose-500/5",
            label: "Overdue",
            icon: AlertTriangle,
        },
    };

    const current = config[status] || {
        style: "bg-slate-100 text-slate-600 border border-slate-200",
        label: status || "Unknown",
        icon: null,
    };

    const Icon = current.icon;

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-1.5 py-1 text-xs font-bold tracking-tight rounded-full shadow-2xs transition-all",
            current.style
        )}>
            {Icon && <Icon size={12} className="shrink-0" />}
            <span>{current.label}</span>
        </span>
    );
}