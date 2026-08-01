import TrashPage from '@/components/common/TrashPage';
import React from 'react';
import { useGetDeletedItemsQuery, usePermanentDeleteItemMutation, useRestoreItemMutation } from '../itemApi';
import { formatCurrency, formatUnit } from '@/utils/formatters';
import { Tag } from 'lucide-react';

export default function ItemTrash() {
    const { data: items = [], isLoading } = useGetDeletedItemsQuery();
    const [restoreItem] = useRestoreItemMutation();
    const [permanentDelete] = usePermanentDeleteItemMutation();

    return (
        <TrashPage
            title="Deleted Items"
            description="Manage deleted items. You can restore them or permanently delete them."
            items={items}
            isLoading={isLoading}
            onRestore={(item) => restoreItem(item.id).unwrap()}
            onPermanentDelete={(item) => permanentDelete(item.id).unwrap()}
            renderItem={(item) => (
                <div className="flex flex-col space-y-2 w-full">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-base text-foreground tracking-tight">
                            {item.name}
                        </h4>
                        <div className="flex items-baseline gap-1">
                            <span className="font-bold text-primary tracking-tight">
                                {formatCurrency(item.price)}
                            </span>
                            {item.defaultUnit && (
                                <span className="text-xs font-medium text-muted-foreground">
                                    / {formatUnit(item.defaultUnit)}
                                </span>
                            )}
                        </div>
                    </div>

                    {item.allowedUnits?.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-border/40">
                            <Tag size={12} className="text-muted-foreground/60 shrink-0" />
                            {item.allowedUnits.map((unit) => {
                                const isDefault = unit === item.defaultUnit;
                                return (
                                    <span
                                        key={unit}
                                        className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                                            isDefault
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "bg-secondary text-secondary-foreground"
                                        }`}
                                    >
                                        {formatUnit(unit)}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        />
    );
}