import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ReceiptText } from "lucide-react";
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
import { useMemo, useState } from "react";

export default function InvoiceForm({ open, setOpen, invoice = null }) {
  const { data } = useGetItemsQuery();
  const itemsData = data || [];

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

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const selectedIds = new Set(items.map((i) => i.itemId));

    return (itemsData || []).filter((item) => {
      const name = (item?.name || "").toLowerCase();
      const query = (search || "").toLowerCase().trim();

      const match = query === "" || name.includes(query);
      const notSelected = !selectedIds.has(item.id);


      return match && notSelected;
    });
  }, [itemsData, search, items]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[100vw] md:max-w-[95vw] lg:max-w-6xl p-0 bg-white flex flex-col h-dvh md:h-[82vh]">

        {/* HEADER */}
        <div className="px-6 py-3 border-b flex justify-between">
          <div>
            <DialogTitle className="font-bold">
              {isEditMode ? "Edit Invoice" : "New Invoice"}
            </DialogTitle>
            <p className="text-xs text-gray-400">
              {isEditMode ? `Ref: ${invoice?.id?.slice(-6)}` : "Draft"}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0">

          {/* LEFT */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-gray-50">

            {/* CUSTOMER */}
            <div className="grid grid-cols-2 gap-4">
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
                  <Button variant="outline">
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

            {/* SEARCHABLE ITEM SELECT */}
            <div className="bg-white p-4 rounded-xl border space-y-3">

              <Input
                placeholder="Search item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="max-h-40 overflow-y-auto custom-scrollbar border rounded-md">
                {filteredItems.length === 0 ? (
                  <p className="text-sm text-gray-400 p-3 text-center">
                    No items found
                  </p>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setNewItem({
                          itemId: item.id,
                          name: item.name,
                          price: item.price,
                          quantity: 1,
                        });
                        setSearch("");
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex justify-between"
                    >
                      <span>{item.name}</span>
                      <span>{formatCurrency(item.price)}</span>
                    </div>
                  ))
                )}
              </div>

              {/* NEW ITEM INPUT */}
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

              <Button
                onClick={handleAddItem}
                disabled={!newItem.name || newItem.quantity <= 0}
                className="w-full"
              >
                <Plus size={16} /> Add Item
              </Button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-96 bg-white border-l flex flex-col">

            <div className="p-4 border-b flex justify-between">
              <span>Items</span>
              <Badge>{items.length}</Badge>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <p className="font-semibold">{item.name}</p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      className="text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>
                      {item.quantity} × {formatCurrency(item.price)}
                    </span>
                    <span className="font-bold">
                      {formatCurrency(item.quantity * item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

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
                className="w-full"
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