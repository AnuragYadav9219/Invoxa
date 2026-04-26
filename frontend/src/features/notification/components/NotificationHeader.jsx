import {
    Bell,
    AlertTriangle,
    CheckCircle,
    RefreshCcw,
    Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
    useGetUnreadCountQuery,
    useMarkAllAsReadMutation,
} from "@/features/notification/notificationApi";

export default function NotificationHeader({
    total = 0,
    failed = 0,
    retrying = 0,
    sent = 0,
}) {
    const hasIssues = failed > 0;

    const { data: unread = 0 } = useGetUnreadCountQuery();
    const [markAllAsRead] = useMarkAllAsReadMutation();

    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-r from-indigo-50 via-white to-purple-50 p-5 sm:p-6 shadow-sm">

            <div className="absolute -top-10 right-0 h-24 w-24 bg-indigo-200/30 rounded-full blur-2xl" />

            <div className="relative space-y-5">

                {/* HEADER */}
                <div className="flex items-start justify-between">

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                <Bell size={18} />
                            </div>

                            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                                Notifications
                            </h1>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-500">
                            Track invoice activity and delivery status
                        </p>
                    </div>

                    {/* STATUS */}
                    <div
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                            hasIssues
                                ? "bg-red-50 text-red-600"
                                : "bg-emerald-50 text-emerald-600"
                        )}
                    >
                        <span
                            className={cn(
                                "h-2 w-2 rounded-full",
                                hasIssues ? "bg-red-500" : "bg-emerald-500"
                            )}
                        />
                        {hasIssues ? "Issues" : "Healthy"}
                    </div>
                </div>

                {unread > 0 && (
                    <div className="flex justify-end">
                        <button
                            onClick={markAllAsRead}
                            className="text-xs font-medium text-indigo-600 hover:underline"
                        >
                            Mark all as read ({unread})
                        </button>
                    </div>
                )}

                {/* STATS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                    <Stat
                        icon={Activity}
                        label="Total"
                        value={total}
                        color="text-indigo-600"
                        bg="bg-indigo-50"
                    />

                    <Stat
                        icon={AlertTriangle}
                        label="Failed"
                        value={failed}
                        color="text-red-600"
                        bg="bg-red-50"
                    />

                    <Stat
                        icon={RefreshCcw}
                        label="Retrying"
                        value={retrying}
                        color="text-amber-600"
                        bg="bg-amber-50"
                    />

                    <Stat
                        icon={CheckCircle}
                        label="Sent"
                        value={sent}
                        color="text-emerald-600"
                        bg="bg-emerald-50"
                    />

                </div>
            </div>
        </div>
    );
}

function Stat({ icon: Icon, label, value, color, bg }) {
    return (
        <div
            className={cn(
                "flex items-center gap-3 rounded-xl p-3 border border-slate-100",
                "bg-white hover:shadow-sm transition"
            )}
        >
            <div className={cn("p-2 rounded-md", bg)}>
                <Icon size={16} className={color} />
            </div>

            <div>
                <p className="text-[11px] text-gray-500">{label}</p>
                <p className={cn("text-sm font-semibold", color)}>{value}</p>
            </div>
        </div>
    );
}