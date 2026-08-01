import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Tag } from "lucide-react";
import { useItemActions } from "@/features/item/hooks/useItemActions";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { formatCurrency, formatUnit } from "@/utils/formatters";
import { motion } from "framer-motion";

export default function ItemCard({ item, onEdit }) {
    const { handleDelete } = useItemActions();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/75 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
        >
            <div className="flex justify-between items-start gap-4">
                
                {/* Title */}
                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate pr-2">
                        {item.name}
                    </h3>
                </div>

                <div className="flex gap-2 shrink-0 md:opacity-40 md:group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-slate-300 hover:bg-indigo-50 text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                        <Edit2 size={4} strokeWidth={2.5} />
                    </Button>

                    <ConfirmDialog
                        type="delete"
                        onConfirm={() => handleDelete(item)}
                        description={
                            <>
                                Move{" "}
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    "{item.name}"
                                </span>{" "}
                                to trash?
                            </>
                        }
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors cursor-pointer"
                        >
                            <Trash2 size={14} strokeWidth={2.5} />
                        </Button>
                    </ConfirmDialog>
                </div>
            </div>

            <div className="mt-3 mb-5 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                    {formatCurrency(item.price)}
                </span>
                
                {item.defaultUnit && (
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                        / {formatUnit(item.defaultUnit)}
                    </span>
                )}
            </div>

            <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:items-center gap-3 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                    <Tag size={12} />
                    Units
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {item.allowedUnits?.map((unit) => {
                        const isDefault = unit === item.defaultUnit;
                        return (
                            <span
                                key={unit}
                                className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                                    isDefault
                                        ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/20"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                }`}
                            >
                                {formatUnit(unit)}
                                {isDefault && <span className="ml-1 opacity-75 font-normal">(Default)</span>}
                            </span>
                        );
                    })}
                </div>
            </div>

        </motion.div>
    );
}