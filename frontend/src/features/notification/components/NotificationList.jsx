import NotificationCard from "./NotificationCard";
import { BellOff, Sparkles, CheckCheck } from "lucide-react";

const Skeleton = () => (
    <div className="flex flex-col gap-3.5 animate-pulse">
        {[1, 2, 3].map((i) => (
            <div
                key={i}
                className="h-24 rounded-2xl bg-linear-to-r from-indigo-50/50 via-slate-100/60 to-purple-50/50 border border-indigo-100/40"
            />
        ))}
    </div>
);

export default function NotificationList({ data = [], isLoading, onMarkAllRead }) {

    if (isLoading) return <Skeleton />;

    if (!data.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/60 backdrop-blur-sm border border-indigo-100/60 rounded-3xl shadow-sm">
                <div className="mb-4 rounded-2xl bg-linear-to-br from-indigo-50 to-purple-50 p-5 shadow-inner border border-indigo-100/50 text-indigo-500 animate-bounce-slow">
                    <BellOff className="h-8 w-8" />
                </div>

                <h3 className="text-base font-bold text-slate-800 tracking-tight">
                    All caught up!
                </h3>

                <p className="mt-1.5 text-xs text-slate-500 max-w-xs leading-relaxed">
                    You have no new notifications right now. Updates regarding invoices, retries, and system alerts will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">

            {/* LIST HEADER ACTIONS */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                        Recent Activity
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                        ({data.length} {data.length === 1 ? 'alert' : 'alerts'})
                    </span>
                </div>

                {onMarkAllRead && (
                    <button
                        onClick={onMarkAllRead}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition cursor-pointer bg-indigo-50/60 hover:bg-indigo-100/60 px-3 py-1 rounded-lg border border-indigo-100"
                    >
                        <CheckCheck size={14} /> Mark all read
                    </button>
                )}
            </div>

            {/* NOTIFICATION CARD ITEMS */}
            <div className="flex flex-col gap-3">
                {data.map((n, i) => (
                    <div
                        key={n.id || i}
                        className="transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-100/40 rounded-2xl animate-fade-in"
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        <NotificationCard notification={n} />
                    </div>
                ))}
            </div>

        </div>
    );
}