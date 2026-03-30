import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useItemActions } from "@/features/item/hooks/useItemActions";

export default function ItemForm({ open, setOpen, editItem }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const { handleCreate, handleUpdate } = useItemActions();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editItem) {
            setName(editItem.name || "");
            setPrice(editItem.price || "");
        } else {
            setName("");
            setPrice("");
        }
    }, [editItem, open]);

    const handleSubmit = async () => {
        if (!name.trim() || !price) return;

        try {
            setLoading(true);

            if (editItem) {
                await handleUpdate(editItem.id, {
                    name,
                    price: Number(price),
                });
            } else {
                await handleCreate({
                    name,
                    price: Number(price),
                });
            }

            setOpen(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md rounded-2xl p-6">

                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-lg font-semibold tracking-tight">
                        {editItem ? "Edit Item" : "Create Item"}
                    </DialogTitle>

                    <DialogDescription className="text-sm text-muted-foreground">
                        Enter item details below
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Item Name</label>
                        <Input
                            placeholder="e.g. Laptop"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price (₹)</label>
                        <Input
                            type="number"
                            placeholder="e.g. 50000"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !name.trim() || !price}
                        className="flex cursor-pointer items-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        {loading
                            ? editItem
                                ? "Updating..."
                                : "Adding..."
                            : editItem
                                ? "Update Item"
                                : "Add Item"}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}