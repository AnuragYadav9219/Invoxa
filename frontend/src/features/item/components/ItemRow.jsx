import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useItemActions } from "@/features/item/hooks/useItemActions";

export default function ItemRow({ item, onEdit }) {
    const { handleDelete } = useItemActions();

    return (
        <tr className="hover:bg-gray-50 transition">
            <td className="px-4 py-3 font-medium">{item.name}</td>
            <td className="px-4 py-3 text-gray-600">₹{item.price}</td>

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