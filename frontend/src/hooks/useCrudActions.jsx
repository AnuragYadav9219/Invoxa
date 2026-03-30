import { toast } from "sonner";
import {
    showErrorWithRetry,
    showSuccess,
} from "@/components/toast/toast";

/**
 * @param {Object} config
 * @param {Function} config.createFn
 * @param {Function} config.updateFn
 * @param {Function} config.deleteFn
 * @param {Function} config.restoreFn
 * @param {Function} config.permanentDeleteFn
 * @param {String} config.entityName
 */
export function useCrudActions({
    createFn,
    updateFn,
    deleteFn,
    restoreFn,
    permanentDeleteFn,
    entityName = "Item",
    getLabel = (item) => item.name,
}) {

    /* ================= CREATE ================= */
    const handleCreate = async (data) => {
        try {
            const res = await createFn(data).unwrap();
            showSuccess(res.message || `${entityName} created`);
        } catch (err) {
            showErrorWithRetry(
                err?.data?.message || `Create ${entityName} failed`,
                () => handleCreate(data)
            );
        }
    };

    /* ================= UPDATE ================= */
    const handleUpdate = async (id, data) => {
        try {
            const res = await updateFn({ id, body: data }).unwrap();
            showSuccess(res.message || `${entityName} updated`);
        } catch (err) {
            showErrorWithRetry(
                err?.data?.message || `Update ${entityName} failed`,
                () => handleUpdate(id, data)
            );
        }
    };

    /* ================= DELETE + UNDO ================= */
    const handleDelete = async (item) => {
        try {
            const res = await deleteFn(item.id).unwrap();

            const label = getLabel(item) ?? "Item";

            toast(res.message || `${entityName} deleted`, {
                description: (
                    <>
                        <span className="font-semibold  text-gray-900">
                            "{label}"
                        </span>{" "}
                        moved to trash.
                    </>
                ),
                action: {
                    label: "Undo",
                    onClick: async () => {
                        try {
                            const restoreRes = await restoreFn(item.id).unwrap();
                            showSuccess(
                                restoreRes.message || `${entityName} restored`
                            );
                        } catch (err) {
                            showErrorWithRetry(
                                err?.data?.message || "Restore failed",
                                () => restoreFn(item.id)
                            );
                        }
                    },
                },
            });

        } catch (err) {
            showErrorWithRetry(
                err?.data?.message || `Delete ${entityName} failed`,
                () => handleDelete(item)
            );
        }
    };

    /* ================= RESTORE ================= */
    const handleRestore = async (item) => {
        try {
            const res = await restoreFn(item.id).unwrap();
            showSuccess(res.message || `${entityName} restored`);
        } catch (err) {
            showErrorWithRetry(
                err?.data?.message || `Restore ${entityName} failed`,
                () => handleRestore(item)
            );
            throw err;
        }
    };

    /* ================= PERMANENT DELETE ================= */
    const handlePermanentDelete = async (item) => {
        try {
            const res = await permanentDeleteFn(item.id).unwrap();
            showSuccess(res.message || `${entityName} deleted permanently`);
        } catch (err) {
            showErrorWithRetry(
                err?.data?.message || `Delete ${entityName} failed`,
                () => handlePermanentDelete(item)
            );
            throw err;
        }
    };

    return {
        handleCreate,
        handleUpdate,
        handleDelete,
        handleRestore,
        handlePermanentDelete,
    };
}