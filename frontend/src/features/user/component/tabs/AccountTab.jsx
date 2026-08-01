import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User,
    Mail,
    ArrowRight,
    Loader2,
    Shield,
    AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DeleteAccountDialog } from "../DeleteAccountDialog";
import { ChangePasswordDialog } from "../ChangePasswordDialog";
import { useGetProfileQuery } from "../../userApi";
import { motion } from "framer-motion";

export default function AccountTab() {
    const navigate = useNavigate();

    const { data, isLoading } = useGetProfileQuery();

    const user = data?.data;

    const initials = user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "U";

    if (isLoading) {
        return (
            <div className="flex h-72 items-center justify-center bg-white rounded-3xl border border-slate-200/80 shadow-xl w-full">
                <div className="space-y-3 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
                    <p className="text-xs font-semibold text-slate-500">
                        Loading account details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* ================= ACCOUNT OVERVIEW ================= */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all">

                {/* Top Accent Gradient Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-indigo-100 shadow-md">
                            <AvatarImage
                                src={user?.profileImage}
                                alt={user?.name || user?.fullName}
                            />
                            <AvatarFallback className="bg-indigo-50 text-indigo-700 font-black text-lg">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Workspace Account
                            </h3>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {user?.name || "User Profile"}
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">
                                Manage your identity credentials and personal configuration.
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="cursor-pointer group h-11 px-5 rounded-xl border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 font-semibold text-xs transition-all shadow-sm active:scale-95 shrink-0"
                        onClick={() => navigate("/profile")}
                    >
                        <span>Manage Full Profile</span>
                        <ArrowRight
                            size={14}
                            className="ml-2 transition-transform group-hover:translate-x-1"
                        />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <ProfileRow icon={<User size={16} />} label="Full Name" value={user?.name || "Not added"} />
                    <ProfileRow icon={<Mail size={16} />} label="Email Address" value={user?.email || "Not added"} />
                </div>
            </div>

            {/* ================= SECURITY ================= */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                        <Shield className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Authentication
                        </h3>
                        <h2 className="text-base font-black text-slate-900 tracking-tight">
                            Security Credentials
                        </h2>
                    </div>
                </div>

                <div className="border rounded-xl border-slate-400">
                    <ChangePasswordDialog />
                </div>
            </div>

            {/* ================= DANGER ZONE ================= */}
            <div className="bg-white rounded-3xl border border-rose-200/80 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">

                {/* Top Destructive Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-rose-500 via-red-600 to-rose-700" />

                <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
                    <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                            Irreversible Actions
                        </h3>
                        <h2 className="text-base font-black text-slate-900 tracking-tight">
                            Danger Zone
                        </h2>
                    </div>
                </div>

                <div className="border rounded-xl border-slate-400">
                    <DeleteAccountDialog />
                </div>
            </div>

        </div>
    );
}

/* ================= REUSABLE ================= */

export function ProfileRow({ icon, label, value, action }) {
    return (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-300 transition-all hover:bg-slate-50 hover:border-slate-200 group">
            <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-white text-indigo-600 shadow-sm border border-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                    {icon}
                </div>

                <div className="space-y-0.5 min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        {label}
                    </p>
                    <p className="text-sm font-bold text-slate-800 truncate tracking-tight">
                        {value}
                    </p>
                </div>
            </div>

            {action && (
                <div className="shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}