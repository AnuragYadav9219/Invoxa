import { useMemo, useState } from "react";
import { useGetItemsQuery } from "@/features/item/itemApi";
import ItemTable from "../components/ItemTable";
import ItemForm from "../components/ItemForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Package } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

import PageLoader from "@/components/loaders/PageLoader";
import CardSkeleton from "@/components/loaders/CardSkeleton";

import { showError } from "@/components/toast/toast";
import { getErrorMessage } from "@/components/toast/getErrorMessage";

export default function Items() {
    const {
        data: items = [],
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
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

    /* ================= ERROR STATE ================= */
    if (isError) {
        const message = getErrorMessage(error?.status, "item");

        showError(message);

        return (
            <div className="flex flex-col items-center justify-center h-[85vh] gap-4">
                <p className="text-red-500 font-medium">{message}</p>

                <Button className="cursor-pointer" onClick={refetch}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-2 sm:py-5 pb-24 overflow-x-hidden">

            <div className="max-w-6xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col gap-5">

                    {/* TOP */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                        {/* LEFT */}
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-black text-white shadow-sm">
                                <Package size={20} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Items
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Manage your products and pricing
                                </p>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                            {/* SEARCH */}
                            <div className="relative w-full sm:w-64">
                                <Search
                                    className="absolute left-3 top-2.5 text-gray-400"
                                    size={16}
                                />
                                <Input
                                    placeholder="Search items..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 w-full bg-gray-50 focus:bg-white transition"
                                />
                            </div>

                            {/* ADD */}
                            <Button
                                onClick={handleCreate}
                                className="w-full sm:w-auto bg-black cursor-pointer text-white hover:bg-gray-900 transition-all hover:scale-[1.03]"
                            >
                                <Plus size={16} /> Add Item
                            </Button>
                        </div>
                    </div>

                    {/* SEARCH STATUS */}
                    {search && search !== debouncedSearch && (
                        <p className="text-xs text-gray-400 animate-pulse">
                            Searching...
                        </p>
                    )}

                    {/* STATS */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                        <div className="bg-gray-50 border rounded-xl p-4">
                            <p className="text-xs text-gray-500">Total Items</p>
                            <p className="text-xl font-bold mt-1">
                                {items.length}
                            </p>
                        </div>

                        <div className="bg-gray-50 border rounded-xl p-4">
                            <p className="text-xs text-gray-500">Filtered</p>
                            <p className="text-xl font-bold mt-1">
                                {filteredItems.length}
                            </p>
                        </div>

                        <div className="hidden md:block bg-gray-50 border rounded-xl p-4">
                            <p className="text-xs text-gray-500">Avg Price</p>
                            <p className="text-xl font-bold mt-1">
                                ₹
                                {items.length
                                    ? Math.round(
                                        items.reduce((a, i) => a + i.price, 0) /
                                        items.length
                                    )
                                    : 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* TABLE CARD */}
                <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

                    <div className="px-5 py-4 border-b flex justify-between items-center">
                        <h2 className="font-semibold text-gray-800">
                            Inventory
                        </h2>

                        <span className="text-sm text-gray-500">
                            {filteredItems.length} items
                        </span>
                    </div>

                    <div className="p-3 sm:p-4">

                        {isFetching ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {[...Array(6)].map((_, i) => (
                                    <CardSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="text-center py-10 space-y-2">
                                <p className="text-gray-500">
                                    No items found
                                </p>

                                <Button className="cursor-pointer" onClick={handleCreate}>
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