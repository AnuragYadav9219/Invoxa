import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    RefreshCw,
    Home,
    ArrowLeft,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { variants } from "./variants";

export default function FallbackPage({
    variant = "server",
    title,
    description,
    retry,
    showRetry = true,
    showHome = true,
    homeLabel = "Dashboard",
    homePath = "/dashboard",
    actionLabel,
    onAction,
    showBack = true,
}) {
    const config = variants[variant] || variants.server;
    const Icon = config.icon;

    const [isRetrying, setIsRetrying] = useState(false);
    const [isOnline, setIsOnline] = useState(() =>
        typeof navigator !== "undefined" ? navigator.onLine : true
    );

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const handleRetry = async () => {
        if (!retry || isRetrying) return;

        setIsRetrying(true);

        try {
            await Promise.resolve(retry());
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => {
                setIsRetrying(false);
            }, 600);
        }
    };

    const goHome = () => {
        if (typeof window !== "undefined") {
            window.location.assign(homePath);
        }
    };

    const handleGoBack = () => {
        if (typeof window !== "undefined") {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.assign("/");
            }
        }
    };

    return (
        <div className={`relative flex min-h-screen items-center justify-center overflow-hidden p-4 font-sans antialiased ${config.pageBg}`}>
            {/* Background Ambient Glowing Orbs */}
            <div className={`pointer-events-none absolute left-1/3 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl ${config.orb1}`} />
            <div className={`pointer-events-none absolute bottom-1/4 right-1/3 h-64 w-64 translate-x-1/2 rounded-full blur-3xl ${config.orb2}`} />

            {/* Main Error Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`relative w-full max-w-md overflow-hidden rounded-2xl border bg-white/95 p-6 text-center shadow-xl backdrop-blur-md sm:p-8 ${config.borderColor}`}
            >
                {/* Colorful Gradient Accent Bar */}
                <div className={`absolute left-0 right-0 top-0 h-1.5 bg-linear-to-r ${config.accentBar}`} />

                {/* Header Bar: Back Button & Status Badge */}
                <div className="mb-5 flex items-center justify-between">
                    {showBack ? (
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 active:scale-95"
                            title="Go Back"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Back</span>
                        </button>
                    ) : (
                        <div />
                    )}

                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm ${config.borderColor} ${config.bgGlow} ${config.color}`}>
                        <span className="relative flex h-1.5 w-1.5">
                            <span
                                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.color.replace(
                                    "text-",
                                    "bg-"
                                )}`}
                            />
                            <span
                                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${config.color.replace(
                                    "text-",
                                    "bg-"
                                )}`}
                            />
                        </span>

                        {config.badge}
                    </span>
                </div>

                {/* Animated Icon Badge */}
                <motion.div
                    whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`relative mx-auto mb-4 flex h-16 w-16 cursor-pointer items-center justify-center rounded-2xl bg-linear-to-tr ${config.iconGradient} text-white shadow-lg`}
                >
                    <Icon
                        size={32}
                        className={`${config.iconColor} drop-shadow-sm ${variant === "network" && !isOnline ? "animate-pulse" : ""
                            }`}
                    />
                    <Sparkles className="absolute -right-1 -top-1 h-4 w-4 animate-pulse text-amber-300" />
                </motion.div>

                {/* Title */}
                <h2 className={`bg-linear-to-r ${config.titleGradient} bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl`}>
                    {title || config.title}
                </h2>

                {/* Network Status Badge */}
                {variant === "network" && (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3.5 py-1 text-xs font-medium shadow-sm backdrop-blur-md transition-all duration-300">
                        {/* Status Indicator Dot with Pulse Effect */}
                        <span className="relative flex h-2 w-2">
                            {isOnline && (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            )}
                            <span
                                className={`relative inline-flex h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-rose-500"
                                    }`}
                            />
                        </span>

                        {/* Status Text */}
                        <span className={isOnline ? "text-emerald-700" : "text-rose-700"}>
                            {isOnline ? "Connection Restored" : "Offline Mode"}
                        </span>
                    </div>
                )}

                {/* Description */}
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {description || config.description}
                </p>

                {/* Trust Signal Callout */}
                <div className={`mt-4 flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium text-slate-600 ${config.trustBorder} ${config.trustBg}`}>
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{config.trustMessage}</span>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                    {actionLabel && onAction && (
                        <Button
                            onClick={onAction}
                            className={`h-10 border text-xs font-medium text-white shadow-sm transition-all active:scale-[0.98] bg-linear-to-r ${config.buttonGradient}`}
                        >
                            {actionLabel}
                        </Button>
                    )}

                    {showRetry && retry && (
                        <Button
                            variant={actionLabel ? "outline" : "default"}
                            onClick={handleRetry}
                            disabled={isRetrying}
                            className={`h-10 text-xs font-medium transition-all active:scale-[0.98] ${actionLabel
                                ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                : `border text-white shadow-sm bg-linear-to-r ${config.buttonGradient}`
                                }`}
                        >
                            <RefreshCw
                                className={`mr-2 h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""
                                    }`}
                            />
                            {isRetrying ? "Retrying..." : "Try Again"}
                        </Button>
                    )}

                    {showHome && (
                        <Button
                            variant="outline"
                            onClick={goHome}
                            className="h-10 border-slate-200 cursor-pointer bg-white text-xs font-medium text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
                        >
                            <Home className="mr-2 h-3.5 w-3.5" />
                            {homeLabel}
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}