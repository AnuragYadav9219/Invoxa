import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";
import RestoreConfirmDialog from "@/components/common/RestoreConfirmDialog";
import { Button } from "@/components/ui/button";
import { showSuccess, showErrorWithRetry } from "@/components/toast/toast";

export default function TrashPage({
    title = "Trash",
    items = [],
    isLoading,
    onRestore,
    onPermanentDelete,
    renderItem,
}) {
    /* ================= LOADING ================= */
    if (isLoading) {
        return (
            <div className="text-center py-10 text-gray-500">
                Loading {title.toLowerCase()}...
            </div>
        );
    }

    /* ================= EMPTY ================= */
    if (!items.length) {
        return (
            <div className="text-center py-16 text-gray-500">
                No deleted {title.toLowerCase()} 
            </div>
        );
    }

    /* ================= UI ================= */
    return (
        <div className="space-y-4">

            {/* HEADER */}
            <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-xs text-gray-400">
                    Items in trash will be permanently deleted after 30 days
                </p>
            </div>

            {/* LIST */}
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex justify-between items-center p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
                >
                    {/* LEFT CONTENT */}
                    <div className="flex flex-col">
                        {renderItem(item)}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2">

                        {/* ================= RESTORE ================= */}
                        <RestoreConfirmDialog
                            onConfirm={async () => {
                                try {
                                    const res = await onRestore(item);
                                    showSuccess(res?.message || "Item restored");
                                } catch (err) {
                                    showErrorWithRetry(
                                        err?.data?.message || "Restore failed",
                                        () => onRestore(item)
                                    );
                                }
                            }}
                            description={
                                <>
                                    Restore{" "}
                                    <span className="font-semibold text-foreground">
                                        "{item.name || "this item"}"
                                    </span>{" "}
                                    back to active items?
                                </>
                            }
                        >
                            <Button variant="outline" className="cursor-pointer">
                                Restore
                            </Button>
                        </RestoreConfirmDialog>

                        {/* ================= PERMANENT DELETE ================= */}
                        <DeleteConfirmDialog
                            title="Delete permanently?"
                            description={
                                <>
                                    This cannot be undone. Delete{" "}
                                    <span className="font-semibold text-destructive">
                                        "{item.name || "this item"}"
                                    </span>{" "}
                                    permanently?
                                </>
                            }
                            onConfirm={async () => {
                                try {
                                    const res = await onPermanentDelete(item);
                                    showSuccess(res?.message || "Deleted permanently");
                                } catch (err) {
                                    showErrorWithRetry(
                                        err?.data?.message || "Delete failed",
                                        () => onPermanentDelete(item)
                                    );
                                }
                            }}
                        >
                            <Button
                                variant="destructive"
                                className="cursor-pointer"
                            >
                                Delete Permanently
                            </Button>
                        </DeleteConfirmDialog>

                    </div>
                </div>
            ))}
        </div>
    );
}