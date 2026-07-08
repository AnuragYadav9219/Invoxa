import {
    useGetSessionsQuery,
    useLogoutDeviceMutation,
    useLogoutAllMutation,
} from "@/features/auth/authApi";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Loader2, Monitor, Smartphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/utils/formatters";
import { useEffect, useState } from "react";
import { deviceService } from "@/services/deviceService";
import { tokenService } from "@/services/tokenService";

export default function SessionsCard() {
    const [isTabActive, setIsTabActive] = useState(!document.hidden);

    /* ================= QUERY ================= */
    const {
        data,
        isLoading,
        refetch,
    } = useGetSessionsQuery(undefined, {
        pollingInterval: isTabActive ? 10000 : 0,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const [logoutDevice] = useLogoutDeviceMutation();
    const [logoutAll, { isLoading: logoutAllLoading }] = useLogoutAllMutation();

    const sessions = data?.data || [];

    /* ================= TAB VISIBILITY ================= */
    useEffect(() => {
        const handleVisibility = () => {
            const active = !document.hidden;
            setIsTabActive(active);

            if (active) {
                refetch();
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);

        return () =>
            document.removeEventListener("visibilitychange", handleVisibility);
    }, [refetch]);

    /* ================= AUTO LOGOUT ================= */
    useEffect(() => {
        if (!isLoading) {
            const currentDeviceId = deviceService.getDeviceId();

            const stillLoggedIn = sessions.some(
                (s) => s.deviceId === currentDeviceId
            );


            if (window.location.pathname.startsWith("/pdf")) {
                return;
            }

            if (!stillLoggedIn) {
                tokenService.clear();
                localStorage.removeItem("shopId");

                window.location.replace("/login");
            }
        }
    }, [sessions, isLoading]);

    /* ================= LOADING ================= */
    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow p-6 space-y-5">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold">Active Sessions</h2>
                    <p className="text-xs text-gray-500">
                        Manage devices where you are logged in
                    </p>
                </div>

                {/* LOGOUT ALL */}
                {sessions.length > 1 && (
                    <ConfirmDialog
                        type="logout"
                        description="Logout from all devices?"
                        onConfirm={async () => {
                            await logoutAll();
                            refetch();
                        }}
                    >
                        <Button
                            size="sm"
                            variant="destructive"
                            className="cursor-pointer"
                            disabled={logoutAllLoading}
                        >
                            Logout All
                        </Button>
                    </ConfirmDialog>
                )}
            </div>

            {/* EMPTY STATE */}
            {sessions.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-10">
                    No active sessions found
                </div>
            )}

            {/* LIST */}
            <div className="space-y-3">
                {sessions.map((s) => {
                    const isMobile =
                        s.deviceName?.toLowerCase().includes("mobile");

                    return (
                        <div
                            key={s.id}
                            className={`flex justify-between items-center border rounded-xl p-4 transition ${s.current
                                ? "bg-green-50 border-green-200"
                                : "hover:bg-gray-50"
                                }`}
                        >
                            {/* LEFT */}
                            <div className="flex items-center gap-3">
                                {isMobile ? (
                                    <Smartphone className="text-gray-400" size={18} />
                                ) : (
                                    <Monitor className="text-gray-400" size={18} />
                                )}

                                <div>
                                    <p className="font-medium flex items-center gap-2">
                                        {s.deviceName}

                                        {s.current && (
                                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                                                This device
                                            </span>
                                        )}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {s.current
                                            ? "This device"
                                            : `Last active: ${formatTime(s.lastActive)}`}
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT */}
                            {!s.current && (
                                <ConfirmDialog
                                    type="logout"
                                    description={
                                        <>
                                            Logout from <b>{s.deviceName}</b>?
                                        </>
                                    }
                                    onConfirm={async () => {
                                        await logoutDevice(s.deviceId);
                                        refetch();
                                    }}
                                >
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="flex items-center cursor-pointer gap-1 text-red-500 text-sm hover:underline">
                                        <LogOut size={14} />
                                        Logout
                                    </Button>
                                </ConfirmDialog>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}