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

    if (isLoading) {
        return (
            <div className="h-full overflow-y-auto pr-2">
                <div className="grid gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="h-20 rounded-xl bg-gray-200 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (!items.length) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-4 rounded-full bg-gray-100">
                        <Trash2
                            size={22}
                            className="text-gray-400"
                        />
                    </div>

                    <p className="text-sm sm:text-base font-medium text-gray-500">
                        No deleted {title.toLowerCase()}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-400">
                        Deleted items will appear here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto no-scrollbar pr-2">
            <div className="grid gap-4 pb-4">

                {items.map((item) => (
                    <div
                        key={`${item.type}-${item.id}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-white hover:shadow-md transition"
                    >

                        {/* Left */}

                        <div className="space-y-1">
                            {renderItem(item)}
                        </div>

                        {/* Actions */}

                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

                            <ConfirmDialog
                                type="restore"
                                onConfirm={() => onRestore(item)}
                                description={
                                    <>
                                        Do you really want to restore{" "}
                                        <b>"{getLabel(item)}"</b>?
                                    </>
                                }
                            >
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full sm:w-auto gap-2"
                                >
                                    <RotateCcw size={14} />
                                    Restore
                                </Button>
                            </ConfirmDialog>

                            <ConfirmDialog
                                type="delete"
                                onConfirm={() => onPermanentDelete(item)}
                                description={
                                    <>
                                        This action cannot be undone. Delete{" "}
                                        <b className="text-destructive">
                                            "{getLabel(item)}"
                                        </b>
                                        ?
                                    </>
                                }
                            >
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="w-full sm:w-auto gap-2"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </Button>
                            </ConfirmDialog>

                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
}