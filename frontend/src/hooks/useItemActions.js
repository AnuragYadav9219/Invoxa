import { showError, showErrorWithRetry, showSuccess } from '@/components/toast/toast';
import { useCreateItemMutation, useDeleteItemMutation, useRestoreItemMutation, useUpdateItemMutation } from '@/features/item/itemApi';
import React from 'react'
import { toast } from 'sonner';

export function useItemActions() {
    const [createItem] = useCreateItemMutation();
    const [updateItem] = useUpdateItemMutation();
    const [deleteItem] = useDeleteItemMutation();
    const [restoreItem] = useRestoreItemMutation();

    /* ================= CREATE ================== */
    const handleCreate = async (data) => {
        try {
            const res = await createItem(data).unwrap();
            showSuccess(res.message || "Item created");
        } catch (err) {
            showErrorWithRetry(
                err?.data?.message || "Create failed",
                () => handleCreate(data)
            );
        }
    };

    /* ================== UPDATE ===================== */
    const handleUpdate = async (id, data) => {
        try {
            const res = await updateItem({ id, body: data }).unwrap();
            showSuccess(res.message || "Item updated");
        } catch (err) {
            showErrorWithRetry(
                err?.data?.message || "Update failed",
                () => handleUpdate(id, data)
            );
        }
    };

    /* ================ DELETE + UNDO =================== */
    const handleDelete = async (item) => {
        console.log("DELETE ITEM:", item);
        
        if (!item?.id) {
            showError("Invalid item. Cannot delete.");
            return;
        }

        try {
            const res = await deleteItem(item.id).unwrap();

            toast(res.message || "Item deleted", {
                description: `"${item.name}" removed`,
                action: {
                    label: "Undo",
                    onClick: async () => {
                        try {
                            const restoreRes = await restoreItem(item.id).unwrap();
                            showSuccess(restoreRes.message || "Item restored");
                        } catch (err) {
                            showErrorWithRetry(
                                err?.data?.message || "Restore failed",
                                () => restoreItem(item.id)
                            );
                        }
                    },
                },
            });

        } catch (err) {
            showErrorWithRetry(
                err?.data?.message || "Delete failed",
                () => handleDelete(item)
            );

            throw err;
        }
    }

    return {
        handleCreate,
        handleUpdate,
        handleDelete,
    };
}
