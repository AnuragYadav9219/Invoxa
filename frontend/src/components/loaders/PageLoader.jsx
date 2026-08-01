import { motion } from "framer-motion";
import Spinner from "./Spinner";

export default function PageLoader({ text = "Loading dashboard..." }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">

            <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 animate-pulse rounded-full bg-purple-300/30 blur-[80px] will-change-transform duration-1000" />
            <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-indigo-300/30 blur-[80px] will-change-transform duration-1000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group relative z-10 flex flex-col items-center gap-6 rounded-3xl border border-white/60 bg-white/40 px-12 py-10 shadow-2xl shadow-indigo-100/50 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-indigo-200/50 hover:bg-white/50 cursor-default"
            >
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-white/40 to-transparent" />

                <div className="relative z-10 flex items-center justify-center">

                    <div className="absolute inset-0 animate-ping rounded-full bg-indigo-400/20 blur-xl duration-1000" />
                    <div className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl" />

                    <Spinner size={42} className="relative z-10 text-indigo-600 drop-shadow-sm" />

                    <div className="absolute flex h-6 w-6 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white opacity-90">
                        I
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-800">
                        Invoxa
                    </h2>
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                        </span>
                        <p className="text-sm font-medium text-slate-500 animate-pulse">
                            {text}
                        </p>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}