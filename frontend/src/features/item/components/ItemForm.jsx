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
import { Loader2, PackagePlus, AlertCircle, Check, Tag, IndianRupee } from "lucide-react";
import { useItemActions } from "@/features/item/hooks/useItemActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatUnit } from "@/utils/formatters";
import { motion, AnimatePresence } from "framer-motion";

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
    const [error, setError] = useState("");

    const { handleCreate, handleUpdate } = useItemActions();
    const [loading, setLoading] = useState(false);

    // Reset form when opened or editItem changes
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
        setError(""); // Clear errors on open
    }, [editItem, open]);

    // Auto-select default unit if only one allowed unit is chosen
    useEffect(() => {
        if (allowedUnits.length === 1 && !defaultUnit) {
            setDefaultUnit(allowedUnits[0]);
        } else if (!allowedUnits.includes(defaultUnit)) {
            setDefaultUnit("");
        }
    }, [allowedUnits, defaultUnit]);

    const toggleUnit = (unit) => {
        setError(""); // Clear error when user makes a change
        setAllowedUnits((prev) =>
            prev.includes(unit)
                ? prev.filter((u) => u !== unit)
                : [...prev, unit]
        );
    };

    const handleSubmit = async () => {
        setError("");

        if (!name.trim()) return setError("Item name is required.");
        if (!price || Number(price) <= 0) return setError("Please enter a valid price.");
        if (allowedUnits.length === 0) return setError("Select at least one allowed unit.");
        if (!defaultUnit) return setError("Please select a default unit.");
        if (!allowedUnits.includes(defaultUnit)) return setError("Default unit must be one of the selected allowed units.");

        try {
            setLoading(true);

            const payload = {
                name: name.trim(),
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
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg rounded-3xl p-0 pb-3 overflow-hidden border-slate-200/60 dark:border-slate-800 shadow-2xl">
                
                {/* Header Section */}
                <DialogHeader className="px-6 pt-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                            <PackagePlus size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {editItem ? "Edit Item" : "Create New Item"}
                            </DialogTitle>
                            <DialogDescription className="text-sm mt-1 text-slate-500 dark:text-slate-400">
                                Configure item pricing, name, and measurement units.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form Body */}
                <div className="px-6 py-5 space-y-6 bg-white dark:bg-slate-950">
                    
                    {/* Inline Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                className="flex items-center gap-2 p-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-500/20"
                            >
                                <AlertCircle size={16} className="shrink-0" />
                                <p>{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Inputs Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        
                        {/* NAME */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Item Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Tag size={16} />
                                </div>
                                <Input
                                    placeholder="e.g. Steel Cement"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setError("");
                                    }}
                                    className="pl-9 h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* PRICE */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <IndianRupee size={16} />
                                </div>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => {
                                        setPrice(e.target.value);
                                        setError("");
                                    }}
                                    className="pl-9 h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ALLOWED UNITS */}
                    <div className="space-y-2.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Allowed Units <span className="text-red-500">*</span>
                        </label>
                        
                        <div className="flex flex-wrap gap-2">
                            {UNITS.map((unit) => {
                                const isSelected = allowedUnits.includes(unit);
                                return (
                                    <button
                                        key={unit}
                                        type="button"
                                        onClick={() => toggleUnit(unit)}
                                        className={`group relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                                            isSelected
                                                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 ring-2 ring-indigo-600 ring-offset-1 dark:ring-offset-slate-950"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-transparent"
                                        }`}
                                    >
                                        {isSelected && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0">
                                                <Check size={14} strokeWidth={3} />
                                            </motion.div>
                                        )}
                                        {formatUnit(unit)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* DEFAULT UNIT */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Default Unit <span className="text-red-500">*</span>
                        </label>
                        
                        <Select
                            value={defaultUnit}
                            onValueChange={(value) => {
                                setDefaultUnit(value);
                                setError("");
                            }}
                            disabled={allowedUnits.length === 0}
                        >
                            <SelectTrigger className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-indigo-500">
                                <SelectValue placeholder={allowedUnits.length === 0 ? "Select allowed units first" : "Select a default unit"} />
                            </SelectTrigger>

                            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                                {allowedUnits.length > 0 ? (
                                    allowedUnits.map((unit) => (
                                        <SelectItem key={unit} value={unit} className="rounded-lg cursor-pointer">
                                            {formatUnit(unit)}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-center text-slate-500">No units selected</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                {/* Footer Section */}
                <DialogFooter className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                        className="h-11 rounded-xl cursor-pointer font-medium text-slate-600 hover:bg-slate-100 mr-2 border-slate-200 w-full sm:w-auto"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="h-11 rounded-xl cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm shadow-indigo-600/20 w-full sm:w-auto flex items-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        {editItem ? "Save Changes" : "Create Item"}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}