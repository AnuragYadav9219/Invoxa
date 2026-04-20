import { useCreateItemMutation, useDeleteItemMutation, usePermanentDeleteItemMutation, useRestoreItemMutation, useUpdateItemMutation } from "@/features/item/itemApi";
import { useCrudActions } from "@/hooks/useCrudActions";


export function useItemActions() {
    const [createItem] = useCreateItemMutation();
    const [updateItem] = useUpdateItemMutation();
    const [deleteItem] = useDeleteItemMutation();
    const [restoreItem] = useRestoreItemMutation();
    const [permanentDeleteItem] = usePermanentDeleteItemMutation();

    return useCrudActions({
        createFn: (data) => createItem(data),
        updateFn: (data) => updateItem(data),
        deleteFn: deleteItem,
        restoreFn: restoreItem,
        permanentDeleteFn: permanentDeleteItem,
        entityName: "Item",
    });
}