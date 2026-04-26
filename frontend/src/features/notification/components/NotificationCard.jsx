import {
    AlertCircle,
    CheckCircle,
    RefreshCcw,
    Mail,
    CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/formatters";

const STATUS_CONFIG = {
    FAILED: {
        icon: AlertCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-100",
        label: "Failed",
    },
    RETRYING: {
        icon: RefreshCcw,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        label: "Retrying",
        animate: "animate-spin",
    },
    SENT: {
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        label: "Sent",
    },
};

export default function NotificationCard({ notification }) {
    const navigate = useNavigate();

    const {
        id,
        status,
        message,
        recipient,
        sentAt,
        lastTriedAt,
        isRead,
    } = notification;

    const config = STATUS_CONFIG[status] || STATUS_CONFIG.FAILED;
    const Icon = config.icon;
    const date = status === "SENT" ? sentAt : lastTriedAt;

    const handleClick = () => {
        navigate(`/notifications/${id}`);
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "group relative overflow-hidden rounded-xl border p-4 bg-white",
                "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
                "cursor-pointer select-none",
                config.border,
                !isRead && "bg-indigo-50 border-indigo-200 shadow-sm"
            )}
        >
            {/* LEFT BAR */}
            <div className={cn("absolute left-0 top-0 h-full w-1", config.bg)} />

            {/* UNREAD DOT */}
            {!isRead && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            )}

            <div className="space-y-3">

                {/* STATUS */}
                <div className="flex items-center justify-between">
                    <div
                        className={cn(
                            "flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full",
                            config.bg,
                            config.color
                        )}
                    >
                        <Icon size={13} className={config.animate} />
                        {config.label}
                    </div>
                </div>

                {/* MESSAGE */}
                <p
                    className={cn(
                        "text-sm leading-relaxed",
                        !isRead ? "text-gray-900 font-medium" : "text-gray-700"
                    )}
                >
                    {message}
                </p>

                {/* META */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">

                    <div className="flex items-center gap-1 truncate">
                        <Mail size={12} className="text-gray-400" />
                        <span className="truncate">{recipient}</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-400">
                        <CalendarDays size={12} />
                        <span>{date ? formatDate(date) : "—"}</span>
                    </div>

                </div>
            </div>
        </div>
    );
}