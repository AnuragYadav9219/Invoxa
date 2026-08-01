import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/* ================= SHIMMER ================= */
function Shimmer({ className }) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-lg bg-slate-200/70",
                className
            )}
        />
    );
}

/* ================= STAGGER LOGIC ================= */
const listVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

/* ================= DESKTOP ================= */
function DesktopSkeleton() {
    return (
        <div className="hidden lg:block rounded-3xl border border-white/60 bg-white/50 p-6 shadow-lg backdrop-blur-xl transition-all">

            <p className="mb-4 text-sm font-medium text-slate-400 animate-pulse">
                Loading invoices...
            </p>

            <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-2">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        variants={itemVariants}
                        key={i}
                        className="grid grid-cols-8 gap-4 items-center rounded-2xl p-2.5 transition-colors duration-300 hover:bg-white/60"
                    >
                        <Shimmer className="h-4 w-24" />

                        <div className="flex items-center gap-3 col-span-2">
                            <Shimmer className="h-10 w-10 shrink-0 rounded-full" />
                            <div className="space-y-2.5">
                                <Shimmer className="h-4 w-32" />
                                <Shimmer className="h-3 w-20 opacity-70" />
                            </div>
                        </div>

                        <Shimmer className="h-4 w-20" />
                        <Shimmer className="h-4 w-24" />
                        <Shimmer className="h-6 w-20 rounded-full" />
                        <Shimmer className="h-4 w-20" />

                        <div className="flex justify-end">
                            <Shimmer className="h-8 w-16 rounded-lg" />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

/* ================= TABLET ================= */
function TabletSkeleton() {
    return (
        <motion.div variants={listVariants} initial="hidden" animate="show" className="hidden md:grid lg:hidden grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
                <motion.div
                    variants={itemVariants}
                    key={i}
                    className="rounded-3xl border border-white/60 bg-white/50 p-5 shadow-md backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-lg hover:bg-white/60 space-y-4"
                >
                    <div className="flex justify-between items-center">
                        <Shimmer className="h-4 w-24" />
                        <Shimmer className="h-6 w-16 rounded-full" />
                    </div>

                    <div className="flex gap-4">
                        <Shimmer className="h-12 w-12 shrink-0 rounded-full" />
                        <div className="space-y-2.5 w-full">
                            <Shimmer className="h-4 w-3/4" />
                            <Shimmer className="h-3 w-1/2 opacity-70" />
                        </div>
                    </div>

                    <div className="pt-2 space-y-2.5 border-t border-slate-200/50">
                        <Shimmer className="h-4 w-full" />
                        <Shimmer className="h-9 w-full rounded-xl" />
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

/* ================= MOBILE ================= */
function MobileSkeleton() {
    return (
        <motion.div variants={listVariants} initial="hidden" animate="show" className="block md:hidden space-y-4">
            {[...Array(4)].map((_, i) => (
                <motion.div
                    variants={itemVariants}
                    key={i}
                    className="rounded-3xl border border-white/60 bg-white/50 p-5 shadow-sm backdrop-blur-xl transition-all hover:bg-white/60 space-y-4"
                >
                    <div className="flex justify-between items-center">
                        <Shimmer className="h-4 w-28" />
                        <Shimmer className="h-6 w-16 rounded-full" />
                    </div>

                    <div className="flex gap-3">
                        <Shimmer className="h-10 w-10 shrink-0 rounded-full" />
                        <div className="space-y-2.5 w-full">
                            <Shimmer className="h-4 w-2/3" />
                            <Shimmer className="h-3 w-1/3 opacity-70" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200/50">
                        <Shimmer className="h-6 w-full rounded-md" />
                        <Shimmer className="h-6 w-full rounded-md" />
                        <Shimmer className="h-6 w-full rounded-md" />
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

/* ================= EXPORT ================= */
export default function InvoiceTableSkeleton() {
    return (
        <>
            <DesktopSkeleton />
            <TabletSkeleton />
            <MobileSkeleton />
        </>
    );
}