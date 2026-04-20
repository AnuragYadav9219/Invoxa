import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useItemActions } from "@/features/item/hooks/useItemActions";
import { formatUnit } from "@/utils/formatters";

export default function ItemRow({ item, onEdit }) {
    const { handleDelete } = useItemActions();

    return (
        <tr className="hover:bg-gray-50 transition">

            {/* NAME */}
            <td className="px-4 py-3 font-medium">{item.name}</td>

            {/* PRICE + UNIT */}
            <td className="px-4 py-3 text-gray-600">
                ₹{item.price}{" "}
                {item.defaultUnit && (
                    <span className="text-xs text-muted-foreground">
                        / {formatUnit(item.defaultUnit)}
                    </span>
                )}
            </td>

            {/* ALLOWED UNITS */}
            <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                    {item.allowedUnits?.map((unit) => (
                        <span
                            key={unit}
                            className={`px-2 py-0.5 text-xs rounded-full border ${
                                unit === item.defaultUnit
                                    ? "bg-primary text-white"
                                    : "bg-muted text-muted-foreground"
                            }`}
                        >
                            {unit}
                        </span>
                    ))}
                </div>
            </td>

            {/* ACTIONS */}
            <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="cursor-pointer"
                    >
                        Update
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
                            size="sm"
                            className="cursor-pointer"
                        >
                            Remove
                        </Button>
                    </ConfirmDialog>

                </div>
            </td>

        </tr>
    );
}