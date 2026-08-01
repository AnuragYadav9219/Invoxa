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
        if (notification && !notification.isRead && !hasMarked.current) {
            hasMarked.current = true;
            markAsRead(id);
        }
    }, [notification, id, markAsRead]);

    if (isLoading) return <PageLoader text="Fetching details..." />;

    if (!notification) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100 shadow-2xs">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-600">Notification not found</p>
                <Button 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    className="rounded-xl border-slate-200 text-xs font-semibold text-indigo-600 hover:bg-indigo-50/50"
                >
                    Go back
                </Button>
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
        FAILED: { 
            color: "bg-red-50 text-red-700 border-red-200/60", 
            icon: <AlertCircle className="h-3.5 w-3.5 shrink-0" />, 
            label: "Failed" 
        },
        RETRYING: { 
            color: "bg-amber-50 text-amber-700 border-amber-200/60", 
            icon: <RefreshCcw className="h-3.5 w-3.5 animate-spin shrink-0" />, 
            label: "Retrying" 
        },
        SENT: { 
            color: "bg-emerald-50 text-emerald-700 border-emerald-200/60", 
            icon: <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />, 
            label: "Sent" 
        },
    };

    const currentStatus = statusConfig[status];

    return (
        <main className="relative min-h-[calc(100vh-4rem)] w-full bg-slate-50/50 sm:px-6 py-6 md:py-10 flex flex-col items-center justify-start overflow-x-hidden">
            {/* Background Decorative Gradient Elements */}
            <div className="absolute top-0 left-1/4 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full max-w-md md:max-w-3xl space-y-4 sm:space-y-6 mx-auto"
            >
                {/* Back Button */}
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 rounded-xl border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-2xs transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-600 active:scale-98"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                    <span>Back</span>
                </Button>

                <div className="w-89 max-w-full sm:w-full mx-auto overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                    {/* Header */}
                    <div className="border-b border-slate-200/60 bg-linear-to-r from-indigo-50/70 via-slate-50 to-violet-50/60 px-4 sm:px-6 py-4 sm:py-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="min-w-0 flex-1">
                                <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium tracking-wide text-indigo-600 mb-1.5 border border-indigo-100/80 shadow-2xs">
                                    <Mail className="h-3 w-3 shrink-0" />
                                    <span>Notification Log</span>
                                </div>
                                <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-800 truncate">
                                    Notification Details
                                </h1>

                                <div className="text-xs text-slate-400 flex items-center gap-2 mt-1 font-mono flex-wrap">
                                    <span className="truncate max-w-45 sm:max-w-none">ID: {id}</span>
                                    <button 
                                        onClick={() => handleCopy(id)}
                                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition-colors shrink-0"
                                        aria-label="Copy ID"
                                    >
                                        {copied ? (
                                            <span className="text-emerald-600 font-semibold font-sans">Copied</span>
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className={cn(
                                "inline-flex w-fit items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border shadow-2xs shrink-0 self-start sm:self-auto",
                                currentStatus.color
                            )}>
                                {currentStatus.icon}
                                <span>{currentStatus.label}</span>
                            </div>
                        </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-2 sm:p-6 space-y-5 sm:space-y-6 bg-white w-full">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full overflow-x-auto rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 sm:p-4 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap wrap-break-word leading-relaxed shadow-2xs"
                        >
                            {message}
                        </motion.div>

                        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                            <InfoTile icon={<Mail className="h-4 w-4" />} label="Recipient" value={recipient} />
                            <InfoTile icon={<CalendarDays className="h-4 w-4" />} label="Date" value={date ? formatDate(date) : "—"} />

                            {invoiceNumber && (
                                <div className="sm:col-span-2">
                                    <InfoTile icon={<Hash className="h-4 w-4" />} label="Invoice" value={"# " + invoiceNumber} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

function InfoTile({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border border-slate-200/70 bg-white transition-all duration-200 hover:border-indigo-300 hover:shadow-xs w-full min-w-0">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 border border-indigo-100/80 shrink-0">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{label}</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 break-all mt-0.5">{value}</p>
            </div>
        </div>
    );
}