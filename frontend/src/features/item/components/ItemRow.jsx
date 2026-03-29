import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { useItemActions } from "@/hooks/useItemActions";

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
                        Edit
                    </Button>

                    <DeleteConfirmDialog
                        onConfirm={() => handleDelete(item)}
                        description={
                            <>
                                Delete <b>"{item.name}"</b> permanently?
                            </>
                        }
                    >
                        <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                        >
                            Delete
                        </Button>
                    </DeleteConfirmDialog>

                </div>
            </td>
        </tr>
    );
}