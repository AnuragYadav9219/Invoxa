import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Trash2,
    ReceiptText,
    User,
    PackagePlus,
    CalendarIcon,
    ShoppingCart,
    ArrowRight,
    Hash,
    BadgeDollarSign,
    IndianRupee,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useGetItemsQuery } from "@/features/item/itemApi";
import { formatCurrency } from "@/utils/formatters";
import formUtils from "@/utils/formUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function InvoiceForm({ open, setOpen, invoice = null }) {
    const { data: itemsData = [] } = useGetItemsQuery();

    const {
        form,
        setForm,
        items,
        newItem,
        setNewItem,
        handleAddItem,
        removeItem,
        handleSubmit,
        totalAmount,
        isEditMode,
        isCreating,
        isUpdating,
    } = formUtils(invoice, open, setOpen, itemsData);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[100vw] md:max-w-[95vw] lg:max-w-6xl p-0 overflow-hidden border-slate-200 md:rounded-2xl shadow-2xl bg-white flex flex-col h-dvh md:h-[82vh]">

                {/* --- COMPACT HEADER (Reduced height) --- */}
                <div className="shrink-0 px-6 py-3 border-b bg-white flex items-center justify-between z-20">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 text-slate-900 p-2 rounded-lg">
                            <ReceiptText size={18} />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-slate-900 leading-tight">
                                {isEditMode ? "Edit Invoice" : "New Invoice"}
                            </DialogTitle>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                {isEditMode ? `Ref: ${invoice.id?.slice(-8)}` : "Drafting Mode"}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(false)}
                        className="rounded-full h-8 w-8 cursor-pointer hover:bg-slate-100"
                    >
                        <Plus className="rotate-45 text-slate-400" size={18} />
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

                    {/* --- LEFT: FORM INPUTS --- */}
                    <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 custom-scrollbar bg-slate-50/30">

                        {/* CUSTOMER INFO SECTION */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Details</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input
                                    placeholder="Customer Name"
                                    className="h-10 bg-white border-slate-200 rounded-lg shadow-sm"
                                    value={form.customerName || ""}
                                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                                />
                                <Input
                                    placeholder="Email Address"
                                    className="h-10 bg-white border-slate-200 rounded-lg shadow-sm"
                                    value={form.customerEmail || ""}
                                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                                />
                                <Input
                                    placeholder="Phone Number"
                                    className="h-10 bg-white border-slate-200 rounded-lg shadow-sm"
                                    value={form.customerPhone || ""}
                                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "h-10 w-full justify-start text-left font-normal bg-white border-slate-200 shadow-sm rounded-lg",
                                                !form.dueDate && "text-slate-400"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                                            {form.dueDate ? format(new Date(form.dueDate), "MMM dd, yyyy") : "Select Due Date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border-none shadow-2xl z-70" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={form.dueDate ? new Date(form.dueDate) : undefined}
                                            onSelect={(date) => setForm({ ...form, dueDate: date ? date.toISOString() : null })}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* PRODUCT SELECTOR CARD */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <PackagePlus size={16} className="text-slate-900" />
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Inventory Management</span>
                                </div>
                                {newItem.itemId && (
                                    <Badge variant="secondary" className="text-[9px] font-bold py-0 bg-slate-100 border-none">
                                        Default: {formatCurrency(itemsData.find((i) => i.id === newItem.itemId)?.price || 0)}
                                    </Badge>
                                )}
                            </div>

                            <Select
                                onValueChange={(val) => {
                                    const s = itemsData.find((i) => i.id === val);
                                    if (s) setNewItem({ itemId: val, name: s.name, price: s.price, quantity: 1 });
                                }}
                            >
                                <SelectTrigger className="h-11 bg-slate-50 border-slate-100 rounded-lg cursor-pointer">
                                    <SelectValue placeholder="Quick search catalog..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    {itemsData.map((i) => (
                                        <SelectItem key={i.id} value={i.id} className="py-2.5 cursor-pointer">
                                            {i.name} <span className="text-slate-400 ml-2 font-normal">— {formatCurrency(i.price)}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="grid grid-cols-12 gap-3">
                                <div className="col-span-12 md:col-span-6">
                                    <label className="text-[9px] font-bold text-slate-400 mb-1 block uppercase">Description Override</label>
                                    <Input
                                        className="h-10"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem(p => ({ ...p, name: e.target.value }))}
                                    />
                                </div>
                                <div className="col-span-4 md:col-span-2">
                                    <label className="text-[9px] font-bold text-slate-400 mb-1 block uppercase text-center">Qty</label>
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        className="h-10 text-center font-bold"
                                        value={newItem.quantity}
                                        onWheel={(e) => e.target.blur()}
                                        onChange={(e) => setNewItem(p => ({
                                            ...p,
                                            quantity: e.target.value === "" ? "" : Number(e.target.value),
                                        }))
                                        }
                                    />
                                </div>
                                <div className="col-span-8 md:col-span-4">
                                    <label className="text-[9px] font-bold text-slate-400 mb-1 block uppercase">Custom Price</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <Input
                                            type="number"
                                            inputMode="decimal"
                                            className="h-10 pl-8 font-bold text-slate-900"
                                            value={newItem.price}
                                            onWheel={(e) => e.target.blur()}
                                            onChange={(e) =>
                                                setNewItem((p) => ({
                                                    ...p,
                                                    price: e.target.value === "" ? "" : Number(e.target.value),
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleAddItem} className="w-full h-11 cursor-pointer bg-slate-900 hover:bg-black rounded-lg font-bold gap-2">
                                <Plus size={16} /> Add to List
                            </Button>
                        </div>
                    </div>

                    {/* --- RIGHT: CART SUMMARY --- */}
                    <div className="w-full lg:w-95 bg-white border-l border-slate-100 flex flex-col h-[40vh] lg:h-full shadow-[-10px_0_30px_rgba(0,0,0,0.01)]">
                        <div className="p-4 flex items-center justify-between border-b border-slate-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-tight">
                                <ShoppingCart size={16} /> Items List
                            </h3>
                            <Badge className="bg-slate-900 rounded-lg font-bold text-[10px] px-2 py-0.5">{items.length} Items</Badge>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar bg-slate-50/20">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                                    <Hash size={40} />
                                    <p className="text-[10px] font-black uppercase mt-2">No Items</p>
                                </div>
                            ) : (
                                items.map((item) => {
                                    const base = itemsData.find(i => i.id === item.itemId);
                                    const isDiscounted = base && item.price < base.price;
                                    const isMarkedUp = base && item.price > base.price;

                                    return (
                                        <div key={item.id} className="group p-3 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-slate-200 transition-all">
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">{item.name}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-tighter">
                                                        {item.quantity} Unit(s)
                                                    </p>
                                                </div>
                                                <button onClick={() => removeItem(item.id)} className="rounded-lg cursor-pointer p-1 border-2 border-red-300 text-red-500 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-end justify-between">
                                                <div className="space-y-0.5">
                                                    {base && (isDiscounted || isMarkedUp) && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[10px] font-bold text-slate-300 line-through">
                                                                {formatCurrency(base.price * item.quantity)}
                                                            </span>
                                                            <span className={cn(
                                                                "text-[9px] font-black px-1 rounded uppercase",
                                                                isDiscounted ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                            )}>
                                                                {isDiscounted ? 'Disc.' : 'Markup'} {formatCurrency(Math.abs(item.price - base.price) * item.quantity)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <p className="text-sm font-black text-slate-900 tracking-tight">
                                                        {formatCurrency(item.quantity * item.price)}
                                                    </p>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-400">@ {formatCurrency(item.price)}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* --- COMPACT FOOTER ACTION --- */}
                        <div className="p-4 border-t border-slate-100 bg-white">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payable</span>
                                <span className="text-xl font-black text-slate-900 tracking-tighter">
                                    {formatCurrency(totalAmount)}
                                </span>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={isCreating || isUpdating || items.length === 0}
                                className="w-full h-11 bg-slate-900 cursor-pointer hover:bg-black text-white font-bold rounded-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                            >
                                {isEditMode ? "Save Changes" : "Finalize Invoice"}
                                <ArrowRight size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}