import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

export default function TrashPage({
    title = "Trash",
    items = [],
    isLoading,
    onRestore,
    onPermanentDelete,
    renderItem,
    getLabel = (item) => item.name,
}) {

    /* ================= LOADING ================= */
    if (isLoading) {
        return (
            <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-20 rounded-xl bg-gray-200 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    /* ================= EMPTY ================= */
    if (!items.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <div className="p-4 rounded-full bg-gray-100">
                    <Trash2 size={22} className="text-gray-400" />
                </div>
                <p className="text-sm sm:text-base font-medium text-gray-500">
                    No deleted {title.toLowerCase()}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                    Deleted items will appear here
                </p>
            </div>
        );
    }

    /* ================= UI ================= */
    return (
        <div className="grid gap-4">

            {items.map((item) => (
                <div
                    key={`${item.type}-${item.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-white hover:shadow-md transition"
                >

                    {/* LEFT */}
                    <div className="space-y-1">
                        {renderItem(item)}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

                        {/* RESTORE */}
                        <ConfirmDialog
                            type="restore"
                            onConfirm={() => onRestore(item)}
                            description={
                                <>
                                    Do you really want to restore <b>"{getLabel(item)}"</b>?
                                </>
                            }
                        >
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center cursor-pointer justify-center gap-2 w-full sm:w-auto"
                            >
                                <RotateCcw size={14} />
                                Restore
                            </Button>
                        </ConfirmDialog>

                        {/* DELETE */}
                        <ConfirmDialog
                            type="delete"
                            onConfirm={() => onPermanentDelete(item)}
                            description={
                                <>
                                    This action cannot be undone. Delete{" "}
                                    <b className="text-destructive">
                                        "{getLabel(item)}"
                                    </b>?
                                </>
                            }
                        >
                            <Button
                                size="sm"
                                variant="destructive"
                                className="flex items-center cursor-pointer justify-center gap-2 w-full sm:w-auto"
                            >
                                <Trash2 size={14} />
                                Delete
                            </Button>
                        </ConfirmDialog>

                    </div>
                </div>
            ))}

        </div>
    );
}