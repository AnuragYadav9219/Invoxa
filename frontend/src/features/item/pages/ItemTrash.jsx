import TrashPage from '@/components/common/TrashPage';
import React from 'react'
import { useGetDeletedItemsQuery, usePermanentDeleteItemMutation, useRestoreItemMutation } from '../itemApi';

export default function ItemTrash() {
    const { data: items = [], isLoading } = useGetDeletedItemsQuery();
    const [restoreItem] = useRestoreItemMutation();
    const [permanentDelete] = usePermanentDeleteItemMutation();

    return (
        <TrashPage
            title="Items Trash"
            items={items}
            isLoading={isLoading}
            onRestore={(item) => restoreItem(item.id).unwrap()}
            onPermanentDelete={(item) => permanentDelete(item.id).unwrap()}
            renderItem={(item) => (
                <>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                </>
            )}
        />
    );
}
