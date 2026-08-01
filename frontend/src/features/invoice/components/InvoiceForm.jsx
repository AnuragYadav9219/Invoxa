import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Calendar as CalendarIcon, User, MapPin, Mail, Phone, ShoppingCart, Search } from "lucide-react";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Tab split state ("customer" | "items")
  const [activeTab, setActiveTab] = useState("customer");

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
      <DialogContent className="max-w-[100vw] lg:max-w-6xl p-0 bg-slate-50 flex flex-col h-dvh lg:h-[90vh] rounded-none lg:rounded-3xl border-0 lg:border border-slate-200/80 shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <DialogTitle className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight">
                {isEditMode ? "Edit Invoice Record" : "Create New Invoice"}
              </DialogTitle>
            </div>
            <p className="text-xs text-slate-400 font-medium pl-4">
              {isEditMode ? `Reference ID: #${invoice?.id?.slice(-6)}` : "Fill out client & line items to generate invoice"}
            </p>
          </div>
          <Badge className="bg-indigo-50 text-indigo-600 border border-indigo-100 font-semibold px-3 py-1">
            {isEditMode ? "Editing Mode" : "Drafting"}
          </Badge>
        </div>

        {/* TAB SPLIT SCROLLER CONTROLS (Visible primarily on Mobile / Tablet or configurable) */}
        <div className="flex lg:hidden bg-white border-b border-slate-200 px-4 py-2 gap-2 shrink-0">
          <Button
            type="button"
            variant={activeTab === "customer" ? "default" : "outline"}
            className={`flex-1 h-9 rounded-xl cursor-pointer text-xs font-bold transition-all ${
              activeTab === "customer" 
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20" 
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}
            onClick={() => setActiveTab("customer")}
          >
            <User size={14} className="mr-1.5" /> Customer Details
          </Button>

          <Button
            type="button"
            variant={activeTab === "items" ? "default" : "outline"}
            className={`flex-1 h-9 rounded-xl cursor-pointer text-xs font-bold transition-all relative ${
              activeTab === "items" 
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20" 
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}
            onClick={() => setActiveTab("items")}
          >
            <ShoppingCart size={14} className="mr-1.5" /> Line Items
            {items.length > 0 && (
              <span className="ml-1.5 bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {items.length}
              </span>
            )}
          </Button>
        </div>

        {/* MAIN BODY CONTAINER */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

          {/* LEFT SECTION (CUSTOMER & CATALOGUE) */}
          <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 ${
            activeTab !== "customer" ? "hidden lg:block" : "block"
          }`}>

            {/* CUSTOMER DETAILS CARD */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-base">Customer Details</h2>
                  <p className="text-xs text-slate-400">Provide client identification & billing details</p>
                </div>
              </div>

              {/* FORM FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">

                {/* NAME */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <Input
                      placeholder="e.g. John Doe"
                      value={form.customerName || ""}
                      className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm bg-slate-50/50"
                      onChange={(e) =>
                        setForm({ ...form, customerName: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <Input
                      placeholder="e.g. example@email.com"
                      value={form.customerEmail || ""}
                      className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm bg-slate-50/50"
                      disabled={isLoading}
                      onChange={(e) =>
                        setForm({ ...form, customerEmail: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* PHONE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <Input
                      placeholder="e.g. +91 98765 43210"
                      value={form.customerPhone || ""}
                      className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm bg-slate-50/50"
                      disabled={isLoading}
                      onChange={(e) =>
                        setForm({ ...form, customerPhone: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* DATE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Due Date <span className="text-rose-500">*</span>
                  </label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-11 justify-start text-left font-normal border-slate-200 rounded-xl hover:bg-slate-50 focus-visible:ring-indigo-500 text-sm px-3.5 bg-slate-50/50"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                        {form.dueDate
                          ? format(new Date(form.dueDate), "PPP")
                          : <span className="text-slate-400">Select due date</span>}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-slate-100" align="start">
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* ADDRESS */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Billing Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <Input
                      placeholder="Street address, city, state..."
                      value={form.customerAddress || ""}
                      className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm bg-slate-50/50"
                      disabled={isLoading}
                      onChange={(e) =>
                        setForm({ ...form, customerAddress: e.target.value })
                      }
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ITEM SELECTOR & BUILDER CARD */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <ShoppingCart size={18} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base">Add Line Items</h2>
                    <p className="text-xs text-slate-400">Search catalogue or write custom item data</p>
                  </div>
                </div>
              </div>

              {/* SEARCH CATALOGUE WITH POPUP SUGGESTIONS */}
              <div className="relative space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Search & Select From Catalogue
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    placeholder="Type to search items..."
                    value={search}
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                    className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 text-sm bg-slate-50/50"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setIsSearchOpen(true);
                    }}
                  />
                </div>

                {/* SEARCH SUGGESTIONS DROPDOWN */}
                {isSearchOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto border border-slate-100 rounded-2xl shadow-xl bg-white p-1.5 z-50 divide-y divide-slate-50">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <div
                          key={item.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setNewItem({
                              itemId: item.id,
                              name: item.name,
                              price: item.price,
                              quantity: 1,
                              unit: item.defaultUnit,
                              allowedUnits: item.allowedUnits || [],
                            });
                            setSearch("");
                            setIsSearchOpen(false);
                          }}
                          className="px-4 py-3 cursor-pointer rounded-xl hover:bg-indigo-50/80 flex justify-between items-center transition-all group"
                        >
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 truncate">{item.name}</p>
                            <p className="text-[11px] text-slate-400">Unit: {formatUnit(item.defaultUnit || 'PCS')}</p>
                          </div>
                          <span className="font-extrabold text-emerald-600 text-sm shrink-0">{formatCurrency(item.price)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No matching catalogue items found. You can fill details manually below.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* NEW ITEM QUICK BUILDER */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div className="sm:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Item Name</label>
                  <Input
                    placeholder="Item title"
                    value={newItem.name || ""}
                    disabled={isLoading}
                    className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm bg-slate-50/50"
                    onChange={(e) =>
                      setNewItem((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Quantity</label>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newItem.quantity || ""}
                    disabled={isLoading}
                    className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm bg-slate-50/50"
                    onChange={(e) =>
                      setNewItem((p) => ({
                        ...p,
                        quantity: Number(e.target.value),
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Price (₹)</label>
                  <Input
                    type="number"
                    placeholder="Price"
                    value={newItem.price || ""}
                    disabled={isLoading}
                    className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm bg-slate-50/50"
                    onChange={(e) =>
                      setNewItem((p) => ({
                        ...p,
                        price: Number(e.target.value),
                        customPrice: Number(e.target.value),
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Unit</label>
                  <Select
                    value={newItem.unit || ""}
                    onValueChange={(value) =>
                      setNewItem((p) => ({ ...p, unit: value }))
                    }
                  >
                    <SelectTrigger className="w-full h-10 border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>

                    <SelectContent className="rounded-xl shadow-lg border-slate-100">
                      {newItem.allowedUnits?.length > 0 ? (
                        newItem.allowedUnits.map((u) => (
                          <SelectItem key={u} value={u} className="text-xs">
                            {formatUnit(u)}
                            {u === newItem.defaultUnit && (
                              <span className="ml-1.5 text-[10px] text-emerald-600 font-semibold">(default)</span>
                            )}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="PCS" className="text-xs">Pieces (PCS)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleAddItem}
                disabled={isLoading || !newItem.name}
                className="w-full h-11 cursor-pointer bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-200"
              >
                <Plus size={16} className="mr-1.5" /> Add Line Item to Invoice
              </Button>
            </div>

          </div>

          {/* RIGHT SECTION (ADDED ITEMS LEDGER & CHECKOUT SUMMARY) */}
          <div className={`w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200/80 flex flex-col h-full pb-6 sm:pb-0 shadow-xl shrink-0 ${
            activeTab !== "items" ? "hidden lg:flex" : "flex"
          }`}>

            {/* HEADER */}
            <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span>Selected Items</span>
                <Badge className="bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full text-xs">
                  {items.length}
                </Badge>
              </span>
              <span className="text-xs text-slate-400 font-medium">Real-time breakdown</span>
            </div>

            {/* LIST OF SELECTED ITEMS (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-slate-50/50">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
                  <div className="p-4 rounded-2xl bg-white shadow-sm ring-4 ring-slate-100 text-slate-300 animate-pulse">
                    <ShoppingCart size={24} />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">No items added yet</p>
                  <p className="text-[11px] text-slate-400 max-w-50 leading-relaxed">Search your catalogue or input items on the left panel to build this invoice.</p>
                </div>
              ) : (
                items.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl border shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] space-y-3.5 relative group transition-all duration-200 hover:shadow-md border-indigo-200"
                  >
                    {/* TOP ROW: Title & Delete */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold shrink-0">
                          {index + 1}
                        </span>
                        <span className="font-bold text-slate-800 text-sm tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                          {item.name}
                        </span>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        title="Remove item"
                        className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shrink-0 cursor-pointer active:scale-90"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>

                    {/* CONTROLS ROW: Qty, Price, Subtotal */}
                    <div className="grid grid-cols-3 gap-2.5 items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">

                      {/* QTY */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Qty</span>
                        <div className="relative">
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
                            className="h-8 text-xs font-bold rounded-lg bg-white border-slate-200 text-center focus-visible:ring-indigo-500 shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Price (₹)</span>
                        <div className="relative">
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
                            className="h-8 text-xs font-bold rounded-lg bg-white border-slate-200 text-center focus-visible:ring-indigo-500 shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* SUBTOTAL */}
                      <div className="text-right space-y-1 pl-1 border-l border-slate-200/60">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Subtotal</span>
                        <span className="text-xs font-extrabold text-indigo-600 block pt-1.5 truncate">
                          {formatCurrency(item.quantity * item.price)}
                        </span>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER SUMMARY & SUBMIT */}
            <div className="p-3 sm:p-5 border-t border-slate-100 bg-slate-50 space-y-3 shrink-0">
              <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Net Amount</span>
                <span className="font-extrabold text-emerald-600 text-base sm:text-xl tracking-tight">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={items.length === 0 || isLoading || !form.customerName}
                className="w-full h-11 sm:h-12 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 cursor-pointer disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                {isLoading && (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                )}
                {isEditMode
                  ? (isUpdating ? "Updating Record..." : "Save Invoice Changes")
                  : (isCreating ? "Generating Invoice..." : "Publish & Create Invoice")}
              </Button>
            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}