import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2, ArchiveX } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import { motion } from "framer-motion";

export default function TrashPage({
    title = "Trash",
    items = [],
    isLoading,
    onRestore,
    onPermanentDelete,
    onDeleteAll,
    deleteAllLoading = false,
    renderItem,
    getLabel = (item) => item.name,
}) {
    // Animation variants for staggered list rendering
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
    };

    /* ================= LOADING STATE ================= */
    if (isLoading) {
        return (
            <div className="h-full overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-3.5 pb-4"
                >
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="relative h-24 sm:h-20 w-full overflow-hidden rounded-[20px] border border-slate-200/70 bg-white shadow-2xs"
                        >
                            {/* Modern Shimmer Effect */}
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-slate-100/80 to-transparent" />
                        </motion.div>
                    ))}
                </motion.div>
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
                className="flex h-full min-h-[60vh] flex-col items-center justify-center px-6"
            >
                <div className="flex max-w-sm flex-col items-center text-center">

                    {/* Floating Animated Icon */}
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="relative mb-5 flex h-24 w-24 items-center justify-center"
                    >
                        <div className="absolute inset-0 rounded-full bg-indigo-50 blur-xl" />
                        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                            <ArchiveX className="h-9 w-9 text-indigo-500" strokeWidth={1.75} />
                        </div>
                    </motion.div>

                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                        Trash is Empty
                    </h2>

                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500">
                        You don't have any deleted <span className="font-semibold text-slate-700 lowercase">{title}</span> at the moment.
                    </p>

                    <p className="mt-5 rounded-xl bg-slate-50 border border-slate-200/60 px-4 py-2.5 text-xs font-medium text-slate-400">
                        Items stay here safely until restored or permanently cleared.
                    </p>
                </div>
            </motion.div>
        );
    }

    /* ================= DATA LIST ================= */
    return (
        <div className="h-full overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-3.5 pb-20"
            >
                {onDeleteAll && (
                    <div className="flex items-center justify-between px-1 mb-1">
                        <span className="text-xs font-medium text-slate-500">
                            Showing <span className="font-bold text-slate-800">{items.length}</span> deleted items
                        </span>
                        
                        <ConfirmDialog
                            type="delete"
                            onConfirm={onDeleteAll}
                            description={
                                <>
                                    This will permanently erase all items in <span className="font-semibold text-slate-900">{title}</span>. This action cannot be undone.
                                </>
                            }
                        >
                            <Button
                                variant="outline"
                                disabled={deleteAllLoading || items.length === 0}
                                className="rounded-xl cursor-pointer h-9 text-xs font-semibold border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 active:scale-95 shadow-2xs transition-all"
                            >
                                <Trash2 size={13} className="mr-1.5 shrink-0" />
                                {deleteAllLoading ? "Deleting..." : "Clear Trash"}
                            </Button>
                        </ConfirmDialog>
                    </div>
                )}

                {items.map((item) => (
                    <motion.div
                        variants={itemVariants}
                        key={`${item.type}-${item.id}`}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-[20px] border border-slate-200/80 bg-white shadow-[0_2px_12px_rgb(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_8px_24px_rgba(79,70,229,0.06)]"
                    >
                        {/* --- Left: Rendered Item Info --- */}
                        <div className="min-w-0 flex-1 w-full text-slate-700">
                            {renderItem(item)}
                        </div>

                        {/* --- Right: Actions --- */}
                        <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t border-slate-100 sm:border-none shrink-0">

                            {/* Restore Button */}
                            <ConfirmDialog
                                type="restore"
                                onConfirm={() => onRestore(item)}
                                description={
                                    <>
                                        Do you want to restore{" "}
                                        <b className="text-slate-900 font-semibold">"{getLabel(item)}"</b>?
                                    </>
                                }
                            >
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 sm:flex-none cursor-pointer h-9 px-3.5 gap-1.5 rounded-xl border-slate-200 font-medium text-slate-700 bg-white hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-2xs active:scale-95"
                                >
                                    <RotateCcw size={14} className="shrink-0 text-slate-400 group-hover:text-indigo-500" />
                                    <span className="truncate text-xs font-semibold">Restore</span>
                                </Button>
                            </ConfirmDialog>

                            {/* Permanent Delete Button */}
                            <ConfirmDialog
                                type="delete"
                                onConfirm={() => onPermanentDelete(item)}
                                description={
                                    <>
                                        This action cannot be undone. Delete{" "}
                                        <b className="text-rose-600 font-semibold">"{getLabel(item)}"</b> permanently?
                                    </>
                                }
                            >
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 sm:flex-none cursor-pointer h-9 px-3.5 gap-1.5 rounded-xl border-rose-200/80 font-medium text-rose-600 bg-white hover:bg-rose-50 hover:border-rose-300 transition-all shadow-2xs active:scale-95"
                                >
                                    <Trash2 size={14} className="shrink-0 text-rose-500" />
                                    <span className="truncate text-xs font-semibold">Delete</span>
                                </Button>
                            </ConfirmDialog>

                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}