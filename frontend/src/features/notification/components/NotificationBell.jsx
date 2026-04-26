import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetUnreadCountQuery } from "../notificationApi";

export default function NotificationBell() {
    const navigate = useNavigate();
    const { data: unreadCount } = useGetUnreadCountQuery();

    return (
        <div
            onClick={() => navigate("/notifications")}
            className="relative cursor-pointer group p-2 rounded-lg hover:bg-white/60 transition"
        >
            <Bell
                size={25}
                className="transition group-hover:scale-110 text-gray-700"
            />

            {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 flex items-center justify-center text-[10px] bg-red-500 text-white rounded-full px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                </span>
            )}
        </div>
    );
}