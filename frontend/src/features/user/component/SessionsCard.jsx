import {
    useGetSessionsQuery,
    useLogoutDeviceMutation,
    useLogoutAllMutation,
} from "@/features/auth/authApi";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Loader2, Monitor, Smartphone, LogOut, ShieldCheck, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/utils/formatters";
import { useEffect, useState } from "react";
import { deviceService } from "@/services/deviceService";
import { tokenService } from "@/services/tokenService";
import { motion, AnimatePresence } from "framer-motion";

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
            <div className="flex justify-center items-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xl">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all">
            
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600" />

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Security & Devices
                    </h3>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                        Active Sessions
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        Manage and monitor devices where your account is currently signed in.
                    </p>
                </div>

                {/* LOGOUT ALL */}
                {sessions.length > 1 && (
                    <ConfirmDialog
                        type="logout"
                        description="Logout from all other devices?"
                        onConfirm={async () => {
                            await logoutAll();
                            refetch();
                        }}
                    >
                        <Button
                            size="sm"
                            variant="destructive"
                            className="cursor-pointer bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold border border-rose-200/60 rounded-xl h-10 px-4 transition-all shadow-sm active:scale-95 shrink-0"
                            disabled={logoutAllLoading}
                        >
                            <LogOut size={15} className="mr-2" />
                            Logout All Devices
                        </Button>
                    </ConfirmDialog>
                )}
            </div>

            {/* EMPTY STATE */}
            {sessions.length === 0 && (
                <div className="text-center py-12 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Laptop size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No active sessions found</p>
                    <p className="text-xs text-slate-400">Your signed-in devices will appear here.</p>
                </div>
            )}

            {/* LIST */}
            <div className="space-y-3">
                <AnimatePresence>
                    {sessions.map((s, index) => {
                        const isMobile = s.deviceName?.toLowerCase().includes("mobile") || s.deviceName?.toLowerCase().includes("iphone") || s.deviceName?.toLowerCase().includes("android");

                        return (
                            <motion.div
                                key={s.id || index}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-2xl p-4 transition-all ${
                                    s.current
                                        ? "bg-emerald-50/50 border-emerald-200/80 shadow-sm"
                                        : "bg-slate-50/50 border-slate-200/60 hover:bg-slate-50"
                                }`}
                            >
                                {/* LEFT */}
                                <div className="flex items-start sm:items-center gap-3.5">
                                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 sm:mt-0 ${
                                        s.current 
                                            ? "bg-emerald-100 text-emerald-700" 
                                            : "bg-slate-200/60 text-slate-600"
                                    }`}>
                                        {isMobile ? <Smartphone size={18} /> : <Monitor size={18} />}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-sm font-bold text-slate-900">
                                                {s.deviceName || "Unknown Device"}
                                            </p>

                                            {s.current && (
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                                                    <ShieldCheck size={12} />
                                                    Current Device
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs font-medium text-slate-500">
                                            {s.current
                                                ? "Active right now on this browser"
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
                                            variant="ghost"
                                            className="w-full sm:w-auto h-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold text-xs rounded-xl border border-rose-200/40 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <LogOut size={14} />
                                            Terminate Session
                                        </Button>
                                    </ConfirmDialog>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}