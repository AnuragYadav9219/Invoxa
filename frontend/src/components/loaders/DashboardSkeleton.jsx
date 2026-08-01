import CardSkeleton from "./CardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function DashboardSkeleton() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* HEADER */}
            <motion.div variants={itemVariants} className="space-y-3">
                <Skeleton className="h-8 w-48 rounded-lg bg-slate-200/80" />
                <Skeleton className="h-4 w-72 rounded-md bg-slate-200/60" />
            </motion.div>

            {/* STATS */}
            {/* Changed length from 7 to 4 to perfectly fit a standard 4-column grid layout */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </motion.div>

            {/* TABLE */}
            <motion.div
                variants={itemVariants}
                className="rounded-3xl border border-white/60 bg-white/50 p-5 shadow-lg backdrop-blur-xl md:p-6 space-y-6"
            >
                {/* Table Header */}
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-40 rounded-md bg-slate-200/80" />
                    <Skeleton className="h-9 w-28 rounded-xl bg-slate-200/80" />
                </div>

                {/* Table Rows */}
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between rounded-2xl p-2.5 transition-colors duration-300 hover:bg-white/60"
                        >
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-11 w-11 rounded-full bg-slate-200/80" />
                                <div className="space-y-2.5">
                                    <Skeleton className="h-4 w-32 bg-slate-200/80" />
                                    <Skeleton className="h-3 w-20 bg-slate-200/60" />
                                </div>
                            </div>

                            <Skeleton className="hidden sm:block h-4 w-20 bg-slate-200/60" />
                            <Skeleton className="hidden md:block h-4 w-24 bg-slate-200/60" />
                            <Skeleton className="hidden lg:block h-4 w-16 bg-slate-200/60" />
                            <Skeleton className="h-7 w-20 rounded-full bg-slate-200/80" />
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}