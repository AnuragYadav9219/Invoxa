import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useItemActions } from "@/features/item/hooks/useItemActions";
import { formatCurrency, formatUnit } from "@/utils/formatters";
import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";

export default function ItemRow({ item, onEdit }) {
    const { handleDelete } = useItemActions();

    return (
        <motion.tr
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="group border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-200"
        >
            {/* NAME */}
            <td className="px-5 py-4">
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {item.name}
                </span>
            </td>

            {/* PRICE + UNIT */}
            <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(item.price)}
                    </span>
                    {item.defaultUnit && (
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            / {formatUnit(item.defaultUnit)}
                        </span>
                    )}
                </div>
            </td>

            {/* ALLOWED UNITS */}
            <td className="px-5 py-4 max-w-50 sm:max-w-none">
                <div className="flex flex-wrap gap-1.5">
                    {item.allowedUnits?.map((unit) => {
                        const isDefault = unit === item.defaultUnit;
                        return (
                            <span
                                key={unit}
                                className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-md transition-colors ${
                                    isDefault
                                        ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/20"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                }`}
                            >
                                {formatUnit(unit)}
                            </span>
                        );
                    })}
                </div>
            </td>

            {/* ACTIONS */}
            <td className="px-5 py-4 text-right">
                <div className="flex justify-end gap-2 transition-opacity duration-300">
                    
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 dark:text-slate-300 hover:bg-indigo-50 text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                        <Edit2 size={13} strokeWidth={2.5} />
                        <span className="text-xs font-semibold hidden sm:inline">Update</span>
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
                            size="sm"
                            className="h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                            <Trash2 size={13} strokeWidth={2.5} />
                            <span className="text-xs font-semibold hidden sm:inline">Remove</span>
                        </Button>
                    </ConfirmDialog>

                </div>
            </td>
        </motion.tr>
    );
}