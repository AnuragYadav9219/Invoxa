import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ReceiptText } from "lucide-react";

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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

export default function InvoiceForm({ open, setOpen, invoice = null }) {
  const { data } = useGetItemsQuery();
  const itemsData = data?.data || [];

  const itemsMap = Object.fromEntries(
    itemsData.map((i) => [i.id, i])
  );

  const {
    form,
    setForm,
    items,
    setItems,
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
      <DialogContent className="max-w-[100vw] md:max-w-[95vw] lg:max-w-6xl p-0 border rounded-none md:rounded-2xl shadow-2xl bg-white flex flex-col h-dvh md:h-[82vh]">

        {/* HEADER */}
        <div className="px-4 md:px-6 py-3 border-b bg-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-lg">
              <ReceiptText size={18} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                {isEditMode ? "Edit Invoice" : "New Invoice"}
              </DialogTitle>
              <p className="text-xs text-gray-400">
                {isEditMode ? `Ref: ${invoice?.id?.slice(-6)}` : "Draft"}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">

          {/* LEFT SIDE */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50">

            {/* CUSTOMER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Customer Name"
                value={form.customerName || ""}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />

              <Input
                placeholder="Email"
                value={form.customerEmail || ""}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
              />

              <Input
                placeholder="Phone"
                value={form.customerPhone || ""}
                onChange={(e) =>
                  setForm({ ...form, customerPhone: e.target.value })
                }
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {form.dueDate
                      ? format(new Date(form.dueDate), "PPP")
                      : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={form.dueDate ? new Date(form.dueDate) : undefined}
                    onSelect={(date) =>
                      setForm({ ...form, dueDate: date })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* ADD ITEM */}
            <div className="bg-white p-4 rounded-xl border space-y-4 shadow-sm">

              <Select
                value={newItem.itemId || ""}
                onValueChange={(val) => {
                  const selected = itemsData.find((i) => i.id === val);
                  if (selected) {
                    setNewItem({
                      itemId: val,
                      name: selected.name,
                      price: selected.price,
                      quantity: 1,
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {itemsData.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name} — {formatCurrency(i.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-3 gap-3">
                <Input
                  placeholder="Name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, name: e.target.value }))
                  }
                />

                <Input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem((p) => ({
                      ...p,
                      quantity: Number(e.target.value) || 0,
                    }))
                  }
                />

                <Input
                  type="number"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem((p) => ({
                      ...p,
                      price: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <Button onClick={handleAddItem} className="w-full h-10">
                <Plus size={16} /> Add Item
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-96 bg-white border-t lg:border-l flex flex-col max-h-[40vh] lg:max-h-full">

            <div className="p-4 border-b flex justify-between">
              <span className="font-medium">Items Cart</span>
              <Badge>{items.length} Items</Badge>
            </div>

            {/* SCROLLABLE ITEMS */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {items.map((item) => {
                const base = itemsMap[item.itemId];

                return (
                  <div
                    key={item.id || item.itemId}
                    className="p-3 border rounded-xl bg-gray-50 space-y-3 shadow-sm"
                  >
                    {/* NAME */}
                    <div className="flex gap-2 items-center">
                      <Input
                        value={item.name}
                        className="h-9 text-sm font-semibold"
                        onChange={(e) => {
                          const updated = items.map((i) =>
                            i.id === item.id
                              ? { ...i, name: e.target.value }
                              : i
                          );
                          setItems(updated);
                        }}
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* QTY + PRICE */}
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        placeholder="Qty"
                        className="h-9 text-sm"
                        onChange={(e) => {
                          const updated = items.map((i) =>
                            i.id === item.id
                              ? { ...i, quantity: Number(e.target.value) || 0 }
                              : i
                          );
                          setItems(updated);
                        }}
                      />

                      <Input
                        type="number"
                        value={item.price}
                        placeholder="Price"
                        className="h-9 text-sm"
                        onChange={(e) => {
                          const updated = items.map((i) =>
                            i.id === item.id
                              ? { ...i, price: Number(e.target.value) || 0 }
                              : i
                          );
                          setItems(updated);
                        }}
                      />
                    </div>

                    {/* TOTAL */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total</span>
                      <span className="font-semibold">
                        {formatCurrency(item.quantity * item.price)}
                      </span>
                    </div>

                    {base && (
                      <p className="text-xs text-gray-400">
                        Base: {formatCurrency(base.price)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t space-y-3">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={
                  isCreating ||
                  isUpdating ||
                  items.length === 0 ||
                  !form.customerName
                }
                className="w-full h-11 text-base font-semibold"
              >
                {isEditMode ? "Update Invoice" : "Create Invoice"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}