import NotificationCard from "./NotificationCard";
import { BellOff } from "lucide-react";
import { useMarkAsReadMutation } from "@/features/notification/notificationApi";
import { useEffect, useRef } from "react";

const Skeleton = () => (
    <div className="flex flex-col gap-3 animate-pulse">
        {[1, 2, 3].map((i) => (
            <div
                key={i}
                className="h-24 rounded-xl bg-linear-to-r from-gray-100 via-gray-50 to-gray-100 border"
            />
        ))}
    </div>
);

export default function NotificationList({ data = [], isLoading }) {
    const [markAsRead] = useMarkAsReadMutation();

    const processedRef = useRef(new Set());

    useEffect(() => {
        data.forEach((n) => {
            if (!n.isRead && !processedRef.current.has(n.id)) {
                processedRef.current.add(n.id);
                markAsRead(n.id);
            }
        });
    }, [data, markAsRead]);

    if (isLoading) return <Skeleton />;

    if (!data.length) {
        return (
            <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 rounded-full bg-linear-to-br from-indigo-50 to-purple-50 p-4">
                    <BellOff className="h-7 w-7 text-gray-400" />
                </div>

                <h3 className="text-sm font-semibold text-gray-700">
                    No notifications yet
                </h3>

                <p className="mt-1 text-xs text-gray-500 max-w-xs">
                    You’ll see updates here when invoices are sent, failed, or retried.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">

            <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                    Recent Activity ({data.length})
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {data.map((n, i) => (
                    <div
                        key={n.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${i * 40}ms` }}
                    >
                        <NotificationCard notification={n} />
                    </div>
                ))}
            </div>

        </div>
    );
}