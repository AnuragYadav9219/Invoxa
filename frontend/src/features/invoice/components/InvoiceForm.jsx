// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Plus, Trash2 } from "lucide-react";
// import { format } from "date-fns";
// import { useGetItemsQuery } from "@/features/item/itemApi";
// import { formatCurrency, formatUnit } from "@/utils/formatters";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// import { Calendar } from "@/components/ui/calendar";
// import { Badge } from "@/components/ui/badge";
// import { useMemo, useState } from "react";
// import useInvoiceForm from "../hooks/useInvoiceForm";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// export default function InvoiceForm({ open, setOpen, invoice = null }) {
//   const { data } = useGetItemsQuery();
//   const itemsData = data || [];

//   const {
//     form,
//     setForm,
//     items,
//     setItems,
//     newItem,
//     setNewItem,
//     handleAddItem,
//     removeItem,
//     handleSubmit,
//     totalAmount,
//     isEditMode,
//     isCreating,
//     isUpdating,
//   } = useInvoiceForm(invoice, open, setOpen, itemsData);

//   const [search, setSearch] = useState("");

//   const isLoading = isCreating || isUpdating;

//   const filteredItems = useMemo(() => {
//     const selectedIds = new Set(items.map((i) => i.itemId));

//     return itemsData.filter((item) => {
//       const match =
//         !search || item.name.toLowerCase().includes(search.toLowerCase());
//       const notSelected = !selectedIds.has(item.id);
//       return match && notSelected;
//     });
//   }, [itemsData, search, items]);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="max-w-[100vw] md:max-w-[95vw] lg:max-w-6xl p-0 bg-white flex flex-col max-h-[90vh] h-full">

//         {/* HEADER */}
//         <div className="px-6 py-3 border-b flex justify-between">
//           <div>
//             <DialogTitle className="font-bold">
//               {isEditMode ? "Edit Invoice" : "New Invoice"}
//             </DialogTitle>
//             <p className="text-xs text-gray-400">
//               {isEditMode ? `Ref: ${invoice?.id?.slice(-6)}` : "Draft"}
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row flex-1 min-h-0">

//           {/* LEFT */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">

//             {/* CUSTOMER */}
//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 placeholder="Customer Name"
//                 value={form.customerName || ""}
//                 onChange={(e) =>
//                   setForm({ ...form, customerName: e.target.value })
//                 }
//               />

//               <Input
//                 placeholder="Email"
//                 value={form.customerEmail || ""}
//                 disabled={isLoading}
//                 onChange={(e) =>
//                   setForm({ ...form, customerEmail: e.target.value })
//                 }
//               />

//               <Input
//                 placeholder="Phone"
//                 value={form.customerPhone || ""}
//                 disabled={isLoading}
//                 onChange={(e) =>
//                   setForm({ ...form, customerPhone: e.target.value })
//                 }
//               />

//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline">
//                     {form.dueDate
//                       ? format(new Date(form.dueDate), "PPP")
//                       : "Pick date"}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent>
//                   <Calendar
//                     mode="single"
//                     selected={form.dueDate ? new Date(form.dueDate) : undefined}
//                     onSelect={(date) =>
//                       setForm({ ...form, dueDate: date })
//                     }
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>

//             {/* ITEM SELECT */}
//             <div className="bg-white p-4 rounded-xl border space-y-3">

//               <Input
//                 placeholder="Search item..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />

//               <div className="max-h-40 overflow-y-auto border rounded-md">
//                 {filteredItems.map((item) => (
//                   <div
//                     key={item.id}
//                     onClick={() =>
//                       setNewItem({
//                         itemId: item.id,
//                         name: item.name,
//                         price: item.price,
//                         quantity: 1,
//                         unit: item.defaultUnit,
//                         allowedUnits: item.allowedUnits || [],
//                       })
//                     }
//                     className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex justify-between"
//                   >
//                     <span>{item.name}</span>
//                     <span>{formatCurrency(item.price)}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* NEW ITEM */}
//               <div className="grid grid-cols-4 gap-3">

//                 <Input
//                   value={newItem.name || ""}
//                   disabled={isLoading}
//                   onChange={(e) =>
//                     setNewItem((p) => ({ ...p, name: e.target.value }))
//                   }
//                 />

//                 <Input
//                   type="number"
//                   value={newItem.quantity || ""}
//                   disabled={isLoading}
//                   onChange={(e) =>
//                     setNewItem((p) => ({
//                       ...p,
//                       quantity: Number(e.target.value),
//                     }))
//                   }
//                 />

//                 <Input
//                   type="number"
//                   value={newItem.price || ""}
//                   disabled={isLoading}
//                   onChange={(e) =>
//                     setNewItem((p) => ({
//                       ...p,
//                       price: Number(e.target.value),
//                       customPrice: Number(e.target.value),
//                     }))
//                   }
//                 />

//                 <Select
//                   value={newItem.unit || ""}
//                   onValueChange={(value) =>
//                     setNewItem((p) => ({ ...p, unit: value }))
//                   }
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select unit" />
//                   </SelectTrigger>

//                   <SelectContent>
//                     {newItem.allowedUnits?.map((u) => (
//                       <SelectItem key={u} value={u}>
//                         {formatUnit(u)}
//                         {u === newItem.defaultUnit && (
//                           <span className="ml-2 text-xs text-green-500">(default)</span>
//                         )}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//               </div>

//               <Button
//                 onClick={handleAddItem}
//                 disabled={isLoading}
//                 className="w-full cursor-pointer"
//               >
//                 <Plus size={16} /> Add Item
//               </Button>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="w-full lg:w-96 bg-white border-l flex flex-col max-h-[50vh]">

//             <div className="p-4 border-b flex justify-between">
//               <span>Items</span>
//               <Badge>{items.length}</Badge>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 space-y-3">

//               {items.map((item) => (
//                 <div key={item.id} className="p-3 border rounded-lg space-y-2">

//                   <div className="flex justify-between">
//                     <p>{item.name}</p>

//                     <button onClick={() => removeItem(item.id)}>
//                       <Trash2 size={14} />
//                     </button>
//                   </div>

//                   <div className="flex gap-2 items-center">

//                     <Input
//                       type="number"
//                       value={item.quantity}
//                       onChange={(e) => {
//                         const val = Number(e.target.value);
//                         setItems((prev) =>
//                           prev.map((i) =>
//                             i.id === item.id ? { ...i, quantity: val } : i
//                           )
//                         );
//                       }}
//                       className="w-20 h-8"
//                     />

//                     <Input
//                       type="number"
//                       value={item.price}
//                       onChange={(e) => {
//                         const val = Number(e.target.value);
//                         setItems((prev) =>
//                           prev.map((i) =>
//                             i.id === item.id
//                               ? { ...i, price: val, customPrice: val }
//                               : i
//                           )
//                         );
//                       }}
//                       className="w-24 h-8"
//                     />

//                     <span className="text-xs">
//                       {formatUnit(item.unit)}
//                     </span>

//                     <div className="ml-auto font-semibold">
//                       {formatCurrency(item.quantity * item.price)}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//             </div>

//             {/* FOOTER */}
//             <div className="p-4 border-t space-y-4">

//               <div className="flex justify-between">
//                 <span>Total</span>
//                 <span className="font-bold text-green-600">
//                   {formatCurrency(totalAmount)}
//                 </span>
//               </div>

//               <Button
//                 onClick={handleSubmit}
//                 disabled={items.length === 0}
//                 className="w-full"
//               >
//                 {isLoading && (
//                   <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
//                 )}

//                 {isEditMode
//                   ? isUpdating
//                     ? "Updating..."
//                     : "Update Invoice"
//                   : isCreating
//                     ? "Creating..."
//                     : "Create Invoice"}
//               </Button>

//             </div>
//           </div>

//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }





















































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
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">

            {/* CUSTOMER */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Customer Name"
                value={form.customerName || ""}
                className="focus-visible:ring-2 focus-visible:ring-indigo-500"
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />

              <Input
                placeholder="Email"
                value={form.customerEmail || ""}
                className="focus-visible:ring-2 focus-visible:ring-indigo-500"
                disabled={isLoading}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
              />

              <Input
                placeholder="Phone"
                value={form.customerPhone || ""}
                className="focus-visible:ring-2 focus-visible:ring-indigo-500"
                disabled={isLoading}
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

            {/* ITEM SELECT */}
            <div className="bg-white p-4 rounded-xl border space-y-3">

              <Input
                placeholder="Search item..."
                value={search}
                className="focus-visible:ring-2 focus-visible:ring-indigo-500"
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
                    className="px-3 py-2 cursor-pointer hover:bg-indigo-50 flex justify-between"
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
                  className="focus-visible:ring-2 focus-visible:ring-indigo-500"
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, name: e.target.value }))
                  }
                />

                <Input
                  type="number"
                  value={newItem.quantity || ""}
                  disabled={isLoading}
                  className="focus-visible:ring-2 focus-visible:ring-indigo-500"
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
                  className="focus-visible:ring-2 focus-visible:ring-indigo-500"
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
                  <SelectTrigger className="w-full">
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
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow"
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
                <div key={item.id} className="p-3 border rounded-lg space-y-2">

                  <div className="flex justify-between">
                    <p>{item.name}</p>

                    <button onClick={() => removeItem(item.id)}>
                      <Trash2 size={14} />
                    </button>
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
                      className="w-20 h-8"
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
                      className="w-24 h-8"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
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