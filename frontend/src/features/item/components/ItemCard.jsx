import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";
import { useItemActions } from "@/hooks/useItemActions";

export default function ItemCard({ item, onEdit }) {
    const { handleDelete } = useItemActions();

    return (
        <div className="border rounded-xl p-4 flex justify-between items-center bg-white shadow-sm">
            <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                    ₹{item.price}
                </p>
            </div>

            <div className="flex gap-2">
                <Button variant="outline" className="cursor-pointer hover:text-blue-400" onClick={() => onEdit(item)}>
                    <Edit2 size={16} />
                </Button>

                <DeleteConfirmDialog
                    onConfirm={() => handleDelete(item)}
                    description={
                        <>
                            This will delete{" "}
                            <span className="font-semibold text-foreground">
                                "{item.name}"
                            </span>{" "}
                            permanently
                        </>
                    }
                >
                    <Button variant="destructive" size="icon" className="cursor-pointer">
                        <Trash2 size={16} />
                    </Button>
                </DeleteConfirmDialog>
            </div>
        </div>
    );
}