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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatUnit } from "@/utils/formatters";

const UNITS = [
    "G",
    "KG",
    "TON",
    "BAG",
    "PIECE",
    "CUBIC_FEET",
    "CUBIC_METER",
    "SQUARE_FEET",
    "SQUARE_METER",
];

export default function ItemForm({ open, setOpen, editItem }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [allowedUnits, setAllowedUnits] = useState([]);
    const [defaultUnit, setDefaultUnit] = useState("");

    const { handleCreate, handleUpdate } = useItemActions();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editItem) {
            setName(editItem.name || "");
            setPrice(editItem.price || "");
            setAllowedUnits(editItem.allowedUnits || []);
            setDefaultUnit(editItem.defaultUnit || "");
        } else {
            setName("");
            setPrice("");
            setAllowedUnits([]);
            setDefaultUnit("");
        }
    }, [editItem, open]);

    // toggle units
    const toggleUnit = (unit) => {
        setAllowedUnits((prev) =>
            prev.includes(unit)
                ? prev.filter((u) => u !== unit)
                : [...prev, unit]
        );
    };

    const handleSubmit = async () => {
        if (!name.trim() || !price) return;

        if (allowedUnits.length === 0) {
            alert("Select at least one unit");
            return;
        }

        if (!allowedUnits.includes(defaultUnit)) {
            alert("Default unit must be selected in allowed units");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name,
                price: Number(price),
                defaultUnit,
                allowedUnits,
            };

            if (editItem) {
                await handleUpdate(editItem.id, payload);
            } else {
                await handleCreate(payload);
            }

            setOpen(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md rounded-2xl p-6">

                <DialogHeader>
                    <DialogTitle>
                        {editItem ? "Edit Item" : "Create Item"}
                    </DialogTitle>
                    <DialogDescription>
                        Configure item pricing and units
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">

                    {/* NAME */}
                    <div>
                        <label className="text-sm font-medium">Item Name</label>
                        <Input
                            placeholder="e.g. Steel"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* PRICE */}
                    <div>
                        <label className="text-sm font-medium">Price</label>
                        <Input
                            type="number"
                            placeholder="Price per unit"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    {/* ALLOWED UNITS */}
                    <div>
                        <label className="text-sm font-medium">Allowed Units</label>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {UNITS.map((unit) => (
                                <button
                                    key={unit}
                                    type="button"
                                    onClick={() => toggleUnit(unit)}
                                    className={`px-3 py-1 rounded-full cursor-pointer text-sm border transition ${allowedUnits.includes(unit)
                                        ? "bg-primary text-white"
                                        : "bg-muted"
                                        }`}
                                >
                                    {unit}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Default Unit</label>

                        <Select
                            value={defaultUnit}
                            onValueChange={(value) => setDefaultUnit(value)}
                        >
                            <SelectTrigger className="w-full mt-2">
                                <SelectValue placeholder="Select default unit" />
                            </SelectTrigger>

                            <SelectContent>
                                {allowedUnits.map((unit) => (
                                    <SelectItem key={unit} value={unit}>
                                        {formatUnit(unit)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={
                            loading ||
                            !name.trim() ||
                            !price ||
                            !defaultUnit
                        }
                        className="flex items-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        {editItem ? "Update Item" : "Add Item"}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}