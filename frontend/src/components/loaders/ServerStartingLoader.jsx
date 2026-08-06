import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, CheckCircle2, RefreshCw, ShieldCheck, AlertCircle } from "lucide-react";

const startupStages = [
    { threshold: 10, label: "SYS_INIT", message: "Booting container orchestrator..." },
    { threshold: 25, label: "NET_CONFIG", message: "Allocating edge routing paths..." },
    { threshold: 45, label: "DB_POOL", message: "Establishing zero-latency connection pool..." },
    { threshold: 70, label: "CACHE_WARM", message: "Hydrating global memory nodes..." },
    { threshold: 90, label: "HEALTH_CHECK", message: "Verifying secure handshake protocols..." },
    { threshold: 99, label: "FINALIZING", message: "Awaiting final server response heartbeat..." }
];

export default function ServerStartingLoader({ onRetry, estimatedSeconds = 45 }) {
    const [progress, setProgress] = useState(3);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPinging, setIsPinging] = useState(false);
    const [pingCount, setPingCount] = useState(0);

    // Realistic Asymptotic Progress Timer (Takes ~estimatedSeconds to reach 95-99%)
    useEffect(() => {
        const intervalMs = 300;
        const totalTicks = (estimatedSeconds * 1000) / intervalMs;
        const incrementPerTick = 95 / totalTicks;

        const timer = setInterval(() => {
            setProgress((prev) => {
                // Asymptotically slow down as it gets closer to 99% so it never gets stuck at 100 prematurely
                if (prev >= 98.5) return 98.5;
                const remaining = 98 - prev;
                const dynamicInc = Math.max(incrementPerTick, remaining * 0.04);
                return Math.min(98.5, prev + dynamicInc);
            });
            setElapsedTime((t) => Math.round((t + 0.3) * 10) / 10);
        }, intervalMs);

        return () => clearInterval(timer);
    }, [estimatedSeconds]);

    // Determine current active log based on real progress percentage
    const currentStageIndex = startupStages.reduce((acc, stage, idx) => {
        return progress >= stage.threshold ? idx : acc;
    }, 0);

    // Handle Manual Health Check Ping Button
    const handleManualPing = async () => {
        if (isPinging) return;
        setIsPinging(true);
        setPingCount((c) => c + 1);

        // Optional external callback if passed from parent
        if (onRetry) {
            try {
                await onRetry();
            } catch (e) {
                console.error(e);
            }
        }

        setTimeout(() => {
            setIsPinging(false);
        }, 1200);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#09090b] px-4 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">

            {/* Subtle Engineering Grid Backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            <div className="relative z-10 w-full max-w-lg">

                {/* Main SaaS Card */}
                <div className="rounded-2xl border border-white/8 bg-[#121215]/80 p-8 shadow-2xl backdrop-blur-xl">

                    {/* Header Branding & Status Badge */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/3 shadow-inner">
                                <Cpu className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold tracking-wide text-white">INVOXA CLUSTER</h2>
                                <p className="text-xs font-mono text-slate-400">us-east-cluster-01</p>
                            </div>
                        </div>

                        {/* Live Pulsing Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
                            </span>
                            <span>Cold Booting</span>
                        </div>
                    </div>

                    {/* Main Context */}
                    <div className="py-6">
                        <h1 className="text-xl font-medium tracking-tight text-white">
                            Waking up infrastructure...
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Our serverless instances scale to zero during inactivity. Provisioning resources for your session.
                        </p>
                    </div>

                    {/* Accurate Progress Bar Component */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-slate-400">
                            <span>PROVISIONING PROGRESS</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/6">
                            <motion.div
                                className="h-full rounded-full bg-linear-to-r from-indigo-500 to-cyan-400"
                                style={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                            />
                        </div>
                    </div>

                    {/* Mini Terminal / Live Event Log Window */}
                    <div className="mt-6 rounded-xl border border-white/6 bg-[#09090b] p-4 font-mono text-xs shadow-inner">
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/4 text-slate-400">
                            <div className="flex items-center gap-2">
                                <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                                <span>system_diagnostics.log</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Elapsed: {Math.floor(elapsedTime)}s</span>
                        </div>

                        <div className="space-y-2 min-h-18.75">
                            <AnimatePresence mode="popLayout">
                                {startupStages.slice(0, currentStageIndex + 1).map((stage, idx) => (
                                    <motion.div
                                        key={stage.label}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-between text-slate-300"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-indigo-400 font-bold">›</span>
                                            <span className="rounded bg-white/6 px-1.5 py-0.5 text-[10px] text-slate-300 font-medium">
                                                {stage.label}
                                            </span>
                                            <span className="text-slate-400 truncate max-w-60 sm:max-w-xs">{stage.message}</span>
                                        </div>
                                        {idx < currentStageIndex ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                        ) : (
                                            <span className="relative flex h-2 w-2 shrink-0">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                                            </span>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Interactive Feedback banner if pinged multiple times */}
                    {pingCount > 1 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-xs text-indigo-300"
                        >
                            <AlertCircle className="h-4 w-4 shrink-0 text-indigo-400" />
                            <span>Signal received! Still completing cluster container initialization. Hang tight.</span>
                        </motion.div>
                    )}

                    {/* Footer Actions & System Status Link */}
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/6">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <span className="hidden sm:inline">Encrypted handshake</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleManualPing}
                            disabled={isPinging}
                            className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/8 hover:text-white active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${isPinging ? "animate-spin text-indigo-400" : ""}`} />
                            <span>{isPinging ? "Pinging server..." : "Force Health Check"}</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}