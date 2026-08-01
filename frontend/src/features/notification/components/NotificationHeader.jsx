import {
    Bell,
    AlertTriangle,
    CheckCircle,
    RefreshCcw,
    Activity,
    CheckCheck,
} from "lucide-react";
import { motion } from "framer-motion";
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
    const [markAllAsRead, { isLoading: isMarkingRead }] = useMarkAllAsReadMutation();

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-br from-indigo-50/60 via-white to-purple-50/40 p-5 sm:p-7 shadow-sm backdrop-blur-xl"
        >
            {/* Ambient background glow elements */}
            <div className="absolute -top-12 -right-12 h-32 w-32 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 h-32 w-32 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative space-y-6">

                {/* HEADER SECTION */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <motion.div
                            whileHover={{ rotate: 12, scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        >
                            <Bell size={20} />
                        </motion.div>

                        <div className="space-y-0.5">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                                Notifications
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Track invoice activity and delivery status in real-time
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                        {/* STATUS BADGE */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className={cn(
                                "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs border transition-colors",
                                hasIssues
                                    ? "bg-red-50/80 text-red-700 border-red-200/60"
                                    : "bg-emerald-50/80 text-emerald-700 border-emerald-200/60"
                            )}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className={cn(
                                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                                    hasIssues ? "bg-red-400" : "bg-emerald-400"
                                )} />
                                <span className={cn(
                                    "relative inline-flex rounded-full h-2 w-2",
                                    hasIssues ? "bg-red-500" : "bg-emerald-500"
                                )} />
                            </span>
                            {hasIssues ? "Attention Needed" : "All Systems Healthy"}
                        </motion.div>

                        {/* MARK ALL AS READ ACTION */}
                        {unread > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={markAllAsRead}
                                disabled={isMarkingRead}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                <CheckCheck size={14} />
                                Mark read ({unread})
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* STATS GRID */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.08
                            }
                        }
                    }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
                >
                    <Stat
                        icon={Activity}
                        label="Total Activity"
                        value={total}
                        color="text-indigo-600"
                        bg="bg-indigo-50/80"
                        border="border-indigo-100/50"
                    />

                    <Stat
                        icon={AlertTriangle}
                        label="Failed Deliveries"
                        value={failed}
                        color="text-red-600"
                        bg="bg-red-50/80"
                        border="border-red-100/50"
                    />

                    <Stat
                        icon={RefreshCcw}
                        label="Retrying"
                        value={retrying}
                        color="text-amber-600"
                        bg="bg-amber-50/80"
                        border="border-amber-100/50"
                    />

                    <Stat
                        icon={CheckCircle}
                        label="Successfully Sent"
                        value={sent}
                        color="text-emerald-600"
                        bg="bg-emerald-50/80"
                        border="border-emerald-100/50"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}

function Stat({ icon: Icon, label, value, color, bg, border }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={cn(
                "flex items-center gap-3.5 rounded-xl p-3.5 sm:p-4 border bg-white/80 shadow-xs backdrop-blur-xs transition-all",
                border
            )}
        >
            <div className={cn("p-2.5 rounded-lg shrink-0", bg)}>
                <Icon size={18} className={color} />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 truncate">{label}</p>
                <p className={cn("text-base sm:text-lg font-bold tracking-tight", color)}>
                    {value.toLocaleString()}
                </p>
            </div>
        </motion.div>
    );
}