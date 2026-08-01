import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetUnreadCountQuery } from "../notificationApi";

export default function NotificationBell() {
    const navigate = useNavigate();
    const { data: unreadCount = 0 } = useGetUnreadCountQuery();

    return (
        <div
            onClick={() => navigate("/notifications")}
            className="relative cursor-pointer group p-2 rounded-2xl bg-white/40 backdrop-blur-md border border-indigo-100/40 hover:bg-white hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100/50 transition-all duration-300"
            title="Notifications"
        >
            <Bell
                size={22}
                className="transition-transform duration-300 group-hover:scale-110 text-slate-700 group-hover:text-indigo-600"
            />

            {unreadCount > 0 && (
                <>
                    {/* Subtle pulse background ping */}
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-full px-1.5 shadow-sm shadow-indigo-200 border-2 border-white animate-scale-up">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    </span>

                    {/* Badge Counter */}

                </>
            )}
        </div>
    );
}