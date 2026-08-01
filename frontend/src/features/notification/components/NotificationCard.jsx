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
        color: "text-rose-600",
        bg: "bg-rose-50/80",
        border: "border-rose-100",
        label: "Failed",
        gradient: "from-rose-500 to-red-600",
    },

    RETRYING: {
        icon: RefreshCcw,
        color: "text-amber-600",
        bg: "bg-amber-50/80",
        border: "border-amber-100",
        label: "Retrying",
        animate: "animate-spin",
        gradient: "from-amber-500 to-orange-600",
    },

    SENT: {
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-50/80",
        border: "border-emerald-100",
        label: "Sent",
        gradient: "from-emerald-500 to-teal-600",
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
                "group relative overflow-hidden rounded-2xl border p-4 sm:p-5 bg-white",
                "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                "cursor-pointer select-none backdrop-blur-sm",
                !isRead
                    ? "bg-linear-to-r from-indigo-50/60 via-purple-50/20 to-white border-indigo-200 shadow-md shadow-indigo-100/40"
                    : "border-slate-200/80 hover:border-indigo-200"
            )}
        >
            {/* LEFT VIBRANT GRADIENT ACCENT BAR */}
            <div
                className={cn(
                    "absolute left-0 top-0 h-full w-1.5 transition-all duration-300 group-hover:w-2",
                    `bg-linear-to-b ${config.gradient}`
                )}
            />

            {/* DELETE BUTTON */}
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={deleting}
                className="absolute top-3 right-3 h-8 w-8 rounded-xl cursor-pointer text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Notification"
            >
                {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </Button>

            <div className="space-y-3.5 pl-2">

                {/* STATUS + NEW BADGES */}
                <div className="flex items-start justify-between gap-3 pr-10">

                    <div className="flex items-center gap-2 flex-wrap">

                        {/* STATUS BADGE */}
                        <div
                            className={cn(
                                "flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-xs",
                                config.bg,
                                config.color,
                                config.border
                            )}
                        >
                            <Icon
                                size={14}
                                className={config.animate}
                            />

                            <span>{config.label}</span>
                        </div>

                        {/* NEW BADGE */}
                        {!isRead && (
                            <div
                                className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-100/70 border border-indigo-200 px-2.5 py-0.5 rounded-full shadow-xs"
                            >
                                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                                Unread
                            </div>
                        )}

                    </div>
                </div>

                {/* MESSAGE TEXT */}
                <p
                    className={cn(
                        "text-sm leading-relaxed pr-2 transition-colors",
                        !isRead
                            ? "text-slate-900 font-semibold"
                            : "text-slate-600 font-normal"
                    )}
                >
                    {message}
                </p>

                {/* META INFO (RECIPIENT & DATE) */}
                <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500"
                >
                    {/* RECIPIENT */}
                    <div className="flex items-center gap-1.5 truncate">
                        <div className="p-1 rounded-md bg-slate-100 text-slate-500">
                            <Mail size={12} />
                        </div>
                        <span className="truncate font-medium text-slate-700">
                            {recipient}
                        </span>
                    </div>

                    {/* DATE */}
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <div className="p-1 rounded-md bg-slate-100 text-slate-400">
                            <CalendarDays size={12} />
                        </div>
                        <span>
                            {date ? formatDate(date) : "—"}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}