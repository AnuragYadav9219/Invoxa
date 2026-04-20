import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useItemActions } from "@/features/item/hooks/useItemActions";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { formatCurrency, formatUnit } from "@/utils/formatters";

export default function ItemCard({ item, onEdit }) {
    const { handleDelete } = useItemActions();

    return (
        <div className="border rounded-xl p-4 bg-white shadow-sm space-y-3">

            {/* NAME */}
            <div className="flex justify-between items-start">
                <h3 className="font-semibold">{item.name}</h3>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(item)}
                        className="cursor-pointer"
                    >
                        <Edit2 size={16} />
                    </Button>

                    <ConfirmDialog
                        type="delete"
                        onConfirm={() => handleDelete(item)}
                        description={
                            <>
                                Move{" "}
                                <span className="font-semibold text-foreground">
                                    "{item.name}"
                                </span>{" "}
                                to trash?
                            </>
                        }
                    >
                        <Button
                            variant="destructive"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <Trash2 size={16} />
                        </Button>
                    </ConfirmDialog>
                </div>
            </div>

            {/* PRICE */}
            <div className="text-sm text-muted-foreground">
                {formatCurrency(item.price)}{" "}
                {item.defaultUnit && (
                    <span className="text-xs">
                        / {formatUnit(item.defaultUnit)}
                    </span>
                )}
            </div>

            {/* UNITS */}
            <div className="flex flex-wrap gap-2">
                {item.allowedUnits?.map((unit) => (
                    <span
                        key={unit}
                        className={`px-2 py-0.5 text-xs rounded-full border ${
                            unit === item.defaultUnit
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                        }`}
                    >
                        {formatUnit(unit)}
                    </span>
                ))}
            </div>

        </div>
    );
}