import { motion } from "framer-motion";
import { CheckCircle2, Heart, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeedbackSuccess() {
    const handleClose = () => {
        window.location.href = "/";
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-950/60 p-8 text-center shadow-2xl backdrop-blur-xl md:p-10"
        >
            {/* Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
                <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-[90px]" />
            </div>

            <div className="relative z-10 max-w-md mx-auto">
                {/* Icon with Spring Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 15,
                    }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                >
                    <CheckCircle2 size={40} className="text-emerald-400" />
                </motion.div>

                {/* Floating Sparkles */}
                <motion.div
                    animate={{ y: [-3, 3, -3], rotate: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5 }}
                    className="absolute left-8 top-6 text-indigo-400/80"
                >
                    <Sparkles size={16} />
                </motion.div>

                <motion.div
                    animate={{ y: [3, -3, 3], rotate: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5 }}
                    className="absolute right-8 top-12 text-cyan-400/80"
                >
                    <Sparkles size={14} />
                </motion.div>

                <h2 className="mt-6 text-2xl font-bold tracking-tight text-white md:text-3xl">
                    Thank You!
                </h2>

                <p className="mt-2 text-sm font-medium text-slate-300">
                    We've received your feedback successfully.
                </p>

                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Every insight helps us continuously refine Invoxa. We truly appreciate 
                    you taking the time to shape our platform.
                </p>

                {/* Rating Hearts */}
                <div className="mt-6 flex justify-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 * i, type: "spring", stiffness: 300 }}
                        >
                            <Heart size={18} className="fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                        </motion.div>
                    ))}
                </div>

                <p className="mt-2 text-[11px] text-slate-500">
                    Your contribution makes a difference ❤️
                </p>

                <div className="mt-8">
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                            onClick={handleClose}
                            className="group h-11 w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-indigo-500 hover:to-cyan-500"
                        >
                            Back to Dashboard
                            <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}