import {
    AlertCircle,
    CheckCircle,
    RefreshCcw,
    Mail,
    CalendarDays,
    Trash2,
    Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/formatters";

import { useDeleteNotificationMutation } from "../notificationApi";

import { Button } from "@/components/ui/button";

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

    const [deleteNotification, { isLoading: deleting }] =
        useDeleteNotificationMutation();

    const config =
        STATUS_CONFIG[status] || STATUS_CONFIG.FAILED;

    const Icon = config.icon;

    const date =
        status === "SENT"
            ? sentAt
            : lastTriedAt;

    const handleClick = () => {
        navigate(`/notifications/${id}`);
    };

    const handleDelete = async (e) => {

        e.stopPropagation();

        try {
            await deleteNotification(id).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "group relative overflow-hidden rounded-xl border p-4 bg-white",
                "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
                "cursor-pointer select-none",
                config.border,
                !isRead &&
                "bg-indigo-50 border-indigo-200 shadow-sm"
            )}
        >

            {/* LEFT ACCENT BAR */}
            <div
                className={cn(
                    "absolute left-0 top-0 h-full w-1",
                    config.bg
                )}
            />

            {/* DELETE BUTTON */}
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={deleting}
                className="absolute top-2 right-2 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
            >
                {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </Button>

            <div className="space-y-3">

                {/* STATUS + NEW */}
                <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-2 flex-wrap">

                        {/* STATUS BADGE */}
                        <div
                            className={cn(
                                "flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full",
                                config.bg,
                                config.color
                            )}
                        >
                            <Icon
                                size={13}
                                className={config.animate}
                            />

                            {config.label}
                        </div>

                        {/* NEW BADGE */}
                        {!isRead && (
                            <div
                                className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-full"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />

                                New
                            </div>
                        )}

                    </div>
                </div>

                {/* MESSAGE */}
                <p
                    className={cn(
                        "text-sm leading-relaxed pr-12",
                        !isRead
                            ? "text-gray-900 font-medium"
                            : "text-gray-700"
                    )}
                >
                    {message}
                </p>

                {/* META */}
                <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500"
                >

                    {/* RECIPIENT */}
                    <div className="flex items-center gap-1 truncate">

                        <Mail
                            size={12}
                            className="text-gray-400"
                        />

                        <span className="truncate">
                            {recipient}
                        </span>

                    </div>

                    {/* DATE */}
                    <div className="flex items-center gap-1 text-gray-400">

                        <CalendarDays size={12} />

                        <span>
                            {date ? formatDate(date) : "—"}
                        </span>

                    </div>

                </div>
            </div>
        </div>
    );
}