import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Mail, CalendarDays, Hash,
    CheckCircle2, AlertCircle, RefreshCcw, Copy
} from "lucide-react";
import { motion } from "framer-motion";
import PageLoader from "@/components/loaders/PageLoader";
import { cn } from "@/lib/utils";
import { useGetNotificationsQuery, useMarkAsReadMutation } from "../notificationApi";
import { useState, useEffect, useRef } from "react";
import { formatDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";

export default function NotificationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const { data = [], isLoading } = useGetNotificationsQuery();
    const [markAsRead] = useMarkAsReadMutation();

    const hasMarked = useRef(false);

    const notification = data.find((n) => n.id === id);

    useEffect(() => {
        if (!notification) return;

        if (!notification.isRead && !hasMarked.current) {
            setTimeout(() => {
                markAsRead(id);
            }, 400); 

            hasMarked.current = true;
        }
    }, [notification, id, markAsRead]);

    if (isLoading) return <PageLoader text="Fetching details..." />;

    if (!notification) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="p-4 bg-red-50 rounded-full text-red-500">
                    <AlertCircle size={40} />
                </div>
                <p className="text-gray-500 font-medium">Notification not found</p>
                <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline">
                    Go back
                </button>
            </div>
        );
    }

    const { status, message, recipient, sentAt, lastTriedAt, invoiceNumber } = notification;
    const date = status === "SENT" ? sentAt : lastTriedAt;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const statusConfig = {
        FAILED: { color: "bg-red-100 text-red-700", icon: <AlertCircle size={14} />, label: "Failed" },
        RETRYING: { color: "bg-amber-100 text-amber-700", icon: <RefreshCcw size={14} className="animate-spin" />, label: "Retrying" },
        SENT: { color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 size={14} />, label: "Sent" },
    };

    const currentStatus = statusConfig[status];

    return (
        <main className="relative min-h-screen bg-linear-to-br from-indigo-100 to-purple-300">

            <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200/30 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200/30 blur-3xl rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-10 space-y-6"
            >

                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
                    Back
                </Button>

                <div className="relative rounded-2xl overflow-hidden shadow-md">

                    <div className="absolute inset-0 bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100" />

                    <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl">

                        {/* HEADER */}
                        <div className="p-5 sm:p-6 border-b bg-linear-to-r from-indigo-50 via-white to-purple-50">

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                <div>
                                    <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                                        Notification Details
                                    </h1>

                                    <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                                        ID: {id.slice(0, 8)}...
                                        <button onClick={() => handleCopy(id)}>
                                            {copied ? (
                                                <span className="text-emerald-500 font-semibold">Copied</span>
                                            ) : (
                                                <Copy size={12} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className={cn(
                                    "inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm",
                                    currentStatus.color
                                )}>
                                    {currentStatus.icon}
                                    {currentStatus.label}
                                </div>

                            </div>
                        </div>

                        {/* BODY */}
                        <div className="p-5 sm:p-6 space-y-6">

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-linear-to-r from-gray-50 to-gray-100 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line"
                            >
                                {message}
                            </motion.div>

                            <div className="grid gap-4 sm:grid-cols-2">

                                <InfoTile icon={<Mail size={16} />} label="Recipient" value={recipient} />

                                <InfoTile icon={<CalendarDays size={16} />} label="Date" value={date ? formatDate(date) : "—"} />

                                {invoiceNumber && (
                                    <div className="sm:col-span-2">
                                        <InfoTile icon={<Hash size={16} />} label="Invoice" value={"# " + invoiceNumber} />
                                    </div>
                                )}

                            </div>

                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

function InfoTile({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 p-4 rounded-xl border bg-white hover:shadow-sm transition">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                {icon}
            </div>
            <div>
                <p className="text-[11px] text-gray-400 uppercase">{label}</p>
                <p className="text-sm font-medium text-gray-800 break-all">{value}</p>
            </div>
        </div>
    );
}