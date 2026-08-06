import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, RefreshCw, Lightbulb } from "lucide-react";

import { dashboardApi } from "@/features/dashboard/dashboardApi";
import { invoiceApi } from "@/features/invoice/invoiceApi";
import { subscriptionApi } from "@/features/subscription/subscriptionApi";
import { notificationApi } from "@/features/notification/notificationApi";
import { userApi } from "@/features/user/userApi";

const TIPS = [
    "Your dashboard is being preloaded so everything opens instantly.",
    "You can manage team permissions and roles directly from settings.",
    "Real-time analytics update automatically every time you log in.",
    "Need help? Check out our documentation in the support menu.",
];

export default function LoadingPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    // Rotate tips every 4 seconds for interactivity
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const bootstrap = async () => {
        setError(null);
        try {
            await Promise.all([
                dispatch(
                    userApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true })
                ).unwrap(),
                dispatch(
                    dashboardApi.endpoints.getDashboard.initiate(undefined, { forceRefetch: true })
                ).unwrap(),
                dispatch(
                    dashboardApi.endpoints.getRevenueTrend.initiate(undefined, { forceRefetch: true })
                ).unwrap(),
                dispatch(
                    invoiceApi.endpoints.getCustomerSummary.initiate(undefined, { forceRefetch: true })
                ).unwrap(),
                dispatch(
                    invoiceApi.endpoints.getRecentInvoice.initiate(5, { forceRefetch: true })
                ).unwrap(),
                dispatch(
                    subscriptionApi.endpoints.getDashboard.initiate(undefined, { forceRefetch: true })
                ).unwrap(),
                dispatch(
                    notificationApi.endpoints.getUnreadCount.initiate(undefined, { forceRefetch: true })
                ).unwrap(),
            ]);

            navigate("/dashboard", { replace: true });
        } catch (err) {
            console.error(err);
            setError(err?.data?.message || "Failed to load workspace data. Please try again.");
        }
    };

    useEffect(() => {
        bootstrap();
    }, [dispatch, navigate]);

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 selection:bg-indigo-500 selection:text-white">
            {/* Background Glow Mesh */}
            <div className="absolute left-1/2 top-1/2 h-162.5 w-162.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-tr from-indigo-600/15 via-violet-600/10 to-cyan-500/10 blur-[160px] pointer-events-none" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] pointer-events-none" />

            <div className="relative z-10 flex max-w-md flex-col items-center text-center">
                {/* Animated Brand Logo */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-indigo-500/30 bg-slate-900/80 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl"
                >
                    <Sparkles className="h-10 w-10 text-indigo-400" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                >
                    {error ? "Initialization Paused" : "Preparing your workspace"}
                </motion.h1>

                {/* Subtitle / Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 text-base text-slate-400 sm:text-lg"
                >
                    {error
                        ? "We encountered an issue while connecting to your server."
                        : "Fetching your invoices, dashboard analytics, and notifications..."}
                </motion.p>

                {/* Conditional Content: Error State vs Loading State */}
                {error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 flex flex-col items-center gap-4"
                    >
                        <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-400 backdrop-blur-md">
                            {error}
                        </div>
                        <button
                            onClick={bootstrap}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
                        >
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Try Again
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* Animated Progress Bar */}
                        <div className="mt-10 h-2 w-72 overflow-hidden rounded-full bg-slate-800/80 shadow-inner">
                            <motion.div
                                animate={{ x: ["-100%", "300%"] }}
                                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                                className="h-full w-24 rounded-full bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-400 shadow-md shadow-indigo-500/50"
                            />
                        </div>

                        {/* Secure Loading Status Indicator */}
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="mt-6 flex items-center gap-2 text-xs font-medium tracking-wide text-slate-400 uppercase"
                        >
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            <span>Encrypted & secure connection</span>
                        </motion.div>

                        {/* Interactive Rotating Tips Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-10 w-full rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 backdrop-blur-xl shadow-xl transition-all hover:border-slate-700/80"
                        >
                            <div className="flex items-start gap-3 text-left">
                                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400 mt-0.5">
                                    <Lightbulb className="h-4 w-4" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                                            Workspace Tip
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                            {currentTipIndex + 1} / {TIPS.length}
                                        </span>
                                    </div>
                                    <div className="relative mt-1 h-10">
                                        <AnimatePresence mode="wait">
                                            <motion.p
                                                key={currentTipIndex}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{ duration: 0.25 }}
                                                className="absolute inset-0 text-xs text-slate-300 leading-relaxed"
                                            >
                                                {TIPS[currentTipIndex]}
                                            </motion.p>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}