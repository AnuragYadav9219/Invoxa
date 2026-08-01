import { useMemo, useState } from "react";
import { useGetItemsQuery } from "@/features/item/itemApi";
import ItemTable from "../components/ItemTable";
import ItemForm from "../components/ItemForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Package, TrendingUp, Layers, CheckCircle2 } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

import PageLoader from "@/components/loaders/PageLoader";
import CardSkeleton from "@/components/loaders/CardSkeleton";

import { EmptyState } from "@/components/errorWrapper/components";
import { formatCurrency } from "@/utils/formatters";

export default function Items() {
    const {
        data: items = [],
        isLoading,
        isFetching,
    } = useGetItemsQuery();

    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);

    const handleCreate = () => {
        setEditItem(null);
        setOpen(true);
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setOpen(true);
    };

    /* ================= FILTER ================= */
    const filteredItems = useMemo(() => {
        if (!debouncedSearch) return items;

        return items.filter((item) =>
            item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [items, debouncedSearch]);

    /* ================= FULL PAGE LOADING ================= */
    if (isLoading) {
        return <PageLoader text="Loading items..." />;
    }

    if (!items.length) {
        return (
            <>
                <ItemForm open={open} setOpen={setOpen} editItem={editItem} />

                <EmptyState
                    title="No Items Found"
                    description="Add your first item to start creating invoices."
                    actionLabel="Add Item"
                    onAction={handleCreate}
                    showHome={false}
                />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50/40 via-slate-50 to-purple-50/30 p-2 sm:p-6 pb-4 overflow-x-hidden">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="bg-white border border-indigo-100 rounded-3xl p-5 sm:p-6 shadow-sm shadow-indigo-100/50 flex flex-col gap-6">

                    {/* TOP BAR */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        {/* LEFT: TITLE & DESCRIPTION */}
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
                                <Package size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                                    Items
                                </h1>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Manage your products, inventory, and pricing securely
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: SEARCH & ADD BUTTON */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">

                            {/* SEARCH INPUT */}
                            <div className="relative w-full sm:w-72">
                                <Search
                                    className="absolute left-3.5 top-2 text-slate-400"
                                    size={16}
                                />
                                <Input
                                    placeholder="Search items by name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 w-full bg-slate-50/80 border-slate-200 focus:bg-white focus-visible:ring-indigo-500 rounded-xl transition"
                                />
                            </div>

                            {/* ADD BUTTON */}
                            <Button
                                onClick={handleCreate}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] cursor-pointer"
                            >
                                <Plus size={18} className="mr-1.5" /> Add Item
                            </Button>
                        </div>
                    </div>

                    {/* SEARCH STATUS */}
                    {search && search !== debouncedSearch && (
                        <p className="text-xs font-medium text-indigo-500 animate-pulse">
                            Searching items...
                        </p>
                    )}

                    {/* STATS OVERVIEW CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">

                        {/* TOTAL ITEMS */}
                        <div className="bg-indigo-50/50 border border-indigo-100/60 rounded-2xl p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Total Items</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {items.length}
                                </p>
                            </div>
                            <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                                <Layers size={20} />
                            </div>
                        </div>

                        {/* FILTERED ITEMS */}
                        <div className="bg-purple-50/50 border border-purple-100/60 rounded-2xl p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Filtered View</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {filteredItems.length}
                                </p>
                            </div>
                            <div className="p-3 bg-white rounded-xl shadow-sm text-purple-600">
                                <CheckCircle2 size={20} />
                            </div>
                        </div>

                        {/* AVERAGE PRICE */}
                        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between sm:col-span-2 md:col-span-1">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average Price</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {formatCurrency(items.length
                                        ? Math.round(
                                            items.reduce((a, i) => a + i.price, 0) /
                                            items.length
                                        )
                                        : 0)}
                                </p>
                            </div>
                            <div className="p-3 bg-white rounded-xl shadow-sm text-slate-700">
                                <TrendingUp size={20} />
                            </div>
                        </div>

                    </div>
                </div>

                {/* TABLE CARD CONTAINER */}
                <div className="bg-white border border-indigo-100 rounded-3xl shadow-sm shadow-indigo-100/30 overflow-hidden">

                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="font-semibold text-slate-800 text-base">
                            Inventory Directory
                        </h2>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
                        </span>
                    </div>

                    <div className="p-4 sm:p-6">
                        {isFetching ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {[...Array(6)].map((_, i) => (
                                    <CardSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="text-center py-16 space-y-3">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                                    <Search size={20} />
                                </div>
                                <p className="text-slate-600 font-medium">
                                    No items found matching your search
                                </p>
                                <Button 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer rounded-xl" 
                                    onClick={handleCreate}
                                >
                                    Add your first item
                                </Button>
                            </div>
                        ) : (
                            <ItemTable
                                items={filteredItems}
                                isLoading={false}
                                onEdit={handleEdit}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL */}
            <ItemForm open={open} setOpen={setOpen} editItem={editItem} />
        </div>
    );
}