import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useGetItemsQuery } from "@/features/item/itemApi";
import { formatCurrency, formatUnit } from "@/utils/formatters";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import useInvoiceForm from "../hooks/useInvoiceForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  } = useInvoiceForm(invoice, open, setOpen, itemsData);

  const [search, setSearch] = useState("");

  const isLoading = isCreating || isUpdating;

  const filteredItems = useMemo(() => {
    const selectedIds = new Set(items.map((i) => i.itemId));

    return itemsData.filter((item) => {
      const match =
        !search || item.name.toLowerCase().includes(search.toLowerCase());
      const notSelected = !selectedIds.has(item.id);
      return match && notSelected;
    });
  }, [itemsData, search, items]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[100vw] md:max-w-[95vw] lg:max-w-6xl p-0 bg-linear-to-br from-slate-50 to-slate-100 flex flex-col max-h-[90vh] h-full">

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
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-linear-to-br from-slate-50 to-slate-100">

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-5">

              {/* TITLE */}
              <div>
                <h1 className="text-lg font-semibold text-slate-800">
                  Customer Details
                </h1>
                <p className="text-sm text-slate-500">
                  Enter customer information
                </p>
              </div>

              {/* FORM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* NAME */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Customer Name
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={form.customerName || ""}
                    className="border-slate-300 focus-visible:ring-2 focus-visible:ring-[#0e8388] focus-visible:border-[#0e8388] transition"
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <Input
                    placeholder="example@email.com"
                    value={form.customerEmail || ""}
                    className="border-slate-300 focus-visible:ring-2 focus-visible:ring-[#0e8388] focus-visible:border-[#0e8388] transition"
                    disabled={isLoading}
                    onChange={(e) =>
                      setForm({ ...form, customerEmail: e.target.value })
                    }
                  />
                </div>

                {/* PHONE */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <Input
                    placeholder="+91 XXXXX XXXXX"
                    value={form.customerPhone || ""}
                    className="border-slate-300 focus-visible:ring-2 focus-visible:ring-[#0e8388] focus-visible:border-[#0e8388] transition"
                    disabled={isLoading}
                    onChange={(e) =>
                      setForm({ ...form, customerPhone: e.target.value })
                    }
                  />
                </div>

                {/* DATE */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Due Date
                  </label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left border-slate-300 hover:bg-slate-50 focus-visible:ring-[#0e8388]"
                      >
                        {form.dueDate
                          ? format(new Date(form.dueDate), "PPP")
                          : "Select due date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          form.dueDate
                            ? new Date(form.dueDate)
                            : undefined
                        }
                        onSelect={(date) =>
                          setForm({ ...form, dueDate: date })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* ADDRESS */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-600">
                    Address
                  </label>
                  <Input
                    placeholder="Street, City..."
                    value={form.customerAddress || ""}
                    className="border-slate-300 focus-visible:ring-2 focus-visible:ring-[#0e8388] focus-visible:border-[#0e8388] transition"
                    disabled={isLoading}
                    onChange={(e) =>
                      setForm({ ...form, customerAddress: e.target.value })
                    }
                  />
                </div>

              </div>
            </div>

            {/* ITEM SELECT */}
            <div className="bg-white p-2 mt-2 rounded-xl border space-y-3">

              <div>
                <h1 className="text-lg font-semibold text-gray-800">
                  Add items Detail
                </h1>
                <p className="text-sm text-gray-500">
                  Enter items information
                </p>
              </div>

              <Input
                placeholder="Search item..."
                value={search}
                className="border-slate-300 focus-visible:ring-2 focus-visible:ring-[#0e8388]"
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="max-h-40 overflow-y-auto border rounded-md">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      setNewItem({
                        itemId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        unit: item.defaultUnit,
                        allowedUnits: item.allowedUnits || [],
                      })
                    }
                    className="px-3 py-2 cursor-pointer hover:bg-[#0e8388]/5 flex justify-between transition"
                  >
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>

              {/* NEW ITEM */}
              <div className="grid grid-cols-4 gap-3">

                <Input
                  value={newItem.name || ""}
                  disabled={isLoading}
                  className="border-slate-300 focus-visible:ring-2 focus-visible:ring-[#0e8388]"
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, name: e.target.value }))
                  }
                />

                <Input
                  type="number"
                  value={newItem.quantity || ""}
                  disabled={isLoading}
                  className="border-slate-300 focus-visible:ring-2 focus-visible:ring-[#0e8388]"
                  onChange={(e) =>
                    setNewItem((p) => ({
                      ...p,
                      quantity: Number(e.target.value),
                    }))
                  }
                />

                <Input
                  type="number"
                  value={newItem.price || ""}
                  disabled={isLoading}
                  className="border-slate-300 focus-visible:ring-2 focus-visible:ring-[#0e8388]"
                  onChange={(e) =>
                    setNewItem((p) => ({
                      ...p,
                      price: Number(e.target.value),
                      customPrice: Number(e.target.value),
                    }))
                  }
                />

                <Select
                  value={newItem.unit || ""}
                  onValueChange={(value) =>
                    setNewItem((p) => ({ ...p, unit: value }))
                  }
                >
                  <SelectTrigger className="w-full border-slate-300 focus:ring-[#0e8388]">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>

                  <SelectContent>
                    {newItem.allowedUnits?.map((u) => (
                      <SelectItem key={u} value={u}>
                        {formatUnit(u)}
                        {u === newItem.defaultUnit && (
                          <span className="ml-2 text-xs text-green-500">(default)</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>

              <Button
                onClick={handleAddItem}
                disabled={isLoading}
                className="w-full cursor-pointer bg-[#0e8388] hover:bg-[#0c6f73] text-white shadow-md transition-all"
              >
                <Plus size={16} /> Add Item
              </Button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-96 bg-white border-l border-slate-200 shadow-inner backdrop-blur border hover:shadow-md transition flex flex-col max-h-[50vh]">

            <div className="p-4 border-b flex justify-between">
              <span>Items</span>
              <Badge className="bg-indigo-100 text-indigo-700">
                {items.length}
              </Badge>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">

              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">

                  <div className="flex justify-between">
                    <p>{item.name}</p>

                     <Button
                     size="sm"
                     title="Remove item"
                     variant="destructive"
                     className="cursor-pointer"
                     onClick={() => removeItem(item.id)}
                     >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  <div className="flex gap-2 items-center">

                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setItems((prev) =>
                          prev.map((i) =>
                            i.id === item.id ? { ...i, quantity: val } : i
                          )
                        );
                      }}
                      className="w-20 h-8 border-slate-300 focus-visible:ring-2 focus-visible:ring-[#0e8388]"
                    />

                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setItems((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, price: val, customPrice: val }
                              : i
                          )
                        );
                      }}
                      className="w-24 h-8 border-slate-300 focus-visible:ring-2 focus-visible:ring-[#0e8388]"
                    />

                    <span className="text-xs">
                      {formatUnit(item.unit)}
                    </span>

                    <div className="ml-auto font-semibold">
                      {formatCurrency(item.quantity * item.price)}
                    </div>
                  </div>
                </div>
              ))}

            </div>

            {/* FOOTER */}
            <div className="p-4 border-t space-y-4">

              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-bold text-emerland-600">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={items.length === 0}
                className="w-full bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white shadow-md"
              >
                {isLoading && (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                )}

                {isEditMode
                  ? isUpdating
                    ? "Updating..."
                    : "Update Invoice"
                  : isCreating
                    ? "Creating..."
                    : "Create Invoice"}
              </Button>

            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}