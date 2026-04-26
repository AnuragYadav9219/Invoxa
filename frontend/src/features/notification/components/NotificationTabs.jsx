import { cn } from "@/lib/utils";
import { useGetUnreadCountQuery } from "@/features/notification/notificationApi";

export default function NotificationTabs({
    tab,
    setTab,
    all = [],
    failed = [],
    retrying = [],
    sent = [],
}) {
    const { data: unread = 0 } = useGetUnreadCountQuery();

    const tabs = [
        { id: "all", label: "All", count: all.length },
        { id: "failed", label: "Failed", count: failed.length },
        { id: "retrying", label: "Retrying", count: retrying.length },
        { id: "sent", label: "Sent", count: sent.length },
    ];

    return (
        <div className="w-full">

            <div className="flex overflow-x-auto no-scrollbar sm:hidden">
                {tabs.map((t) => {
                    const isActive = tab === t.id;

                    const showDot =
                        unread > 0 &&
                        (t.id === "all" || t.id === "failed" || t.id === "retrying");

                    return (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={cn(
                                "relative flex cursor-pointer items-center",
                                "px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",

                                isActive
                                    ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            {t.label}

                            <span
                                className={cn(
                                    "text-[11px] px-2 py-0.5 rounded-full transition",
                                    isActive
                                        ? "bg-white/20 text-white"
                                        : "bg-gray-100 text-gray-700"
                                )}
                            >
                                {t.count}
                            </span>

                            {!isActive && showDot && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="hidden sm:grid grid-cols-4 gap-2 px-2">
                {tabs.map((t) => {
                    const isActive = tab === t.id;

                    const showDot =
                        unread > 0 &&
                        (t.id === "all" || t.id === "failed" || t.id === "retrying");

                    return (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={cn(
                                "relative flex items-center cursor-pointer justify-center gap-2",
                                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",

                                isActive
                                    ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            {t.label}

                            <span
                                className={cn(
                                    "text-[11px] px-2 py-0.5 rounded-full transition",
                                    isActive
                                        ? "bg-white/20 text-white"
                                        : "bg-gray-200 text-gray-700"
                                )}
                            >
                                {t.count}
                            </span>

                            {!isActive && showDot && (
                                <span className="absolute top-1 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                            )}
                        </button>
                    );
                })}
            </div>

        </div>
    );
}