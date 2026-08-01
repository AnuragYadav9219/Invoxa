import ItemRow from "./ItemRow";
import ItemCard from "./ItemCard";
import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";

export default function ItemTable({ items = [], isLoading, onEdit }) {

    // Animation variants for staggered rendering on mobile
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    /* ================= LOADING STATE ================= */
    if (isLoading) {
        return (
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="relative h-24 md:h-16 w-full overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shadow-sm"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/60 dark:via-white/5 to-transparent" />
                    </div>
                ))}
            </div>
        );
    }

    /* ================= EMPTY STATE ================= */
    if (!items.length) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20"
            >
                <div className="flex max-w-sm flex-col items-center text-center">
                    
                    {/* Floating Animated Icon */}
                    <motion.div 
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="relative mb-6 flex h-24 w-24 items-center justify-center"
                    >
                        <div className="absolute inset-0 rounded-full bg-indigo-100/60 dark:bg-indigo-900/20 blur-xl" />
                        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:rotate-3 transition-transform">
                            <PackageSearch className="h-10 w-10 text-indigo-400" strokeWidth={1.5} />
                        </div>
                    </motion.div>

                    <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        No items found
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        Your inventory is currently empty. Add your first item to start creating invoices and billing customers.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full">
            
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-slate-200/75 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
                <div className="w-full overflow-x-auto no-scrollbar">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-5 py-4 font-semibold">Name</th>
                                <th className="px-5 py-4 font-semibold">Price</th>
                                <th className="px-5 py-4 font-semibold">Units</th>
                                <th className="px-5 py-4 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>

                        {/* 
                            ItemRow handles its own entrance animations via motion.tr 
                            so mapping them naturally creates a staggered effect on mount 
                        */}
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {items.map((item) => (
                                <ItemRow
                                    key={item.id}
                                    item={item}
                                    onEdit={onEdit}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid md:hidden gap-3 sm:gap-4"
            >
                {items.map((item) => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        onEdit={onEdit}
                    />
                ))}
            </motion.div>
            
        </div>
    );
}