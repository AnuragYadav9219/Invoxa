import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Plus,
    Filter,
    ArrowUpDown,
    Search,
    Calendar,
    IndianRupee,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import PaymentTable from "../components/PaymentTable";
import PaymentForm from "../components/PaymentForm";

import {
    setPage,
    updateFilter,
} from "@/features/payment/paymentSlice";

import {
    useGetAllPaymentsQuery,
    useFilterPaymentsMutation,
} from "../paymentApi";
import Spinner from "@/components/loaders/Spinner";

export default function Payments() {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const { page, pageSize, filters } = useSelector(
        (state) => state.paymentUI
    );

    const { search, method, sort } = filters;

    const isFilterActive = (search && search.trim() !== "") || (method && method !== "ALL");

    const [localSearch, setLocalSearch] = useState(search || "");

    const { data, isLoading, isFetching } =
        useGetAllPaymentsQuery({
            page,
            size: pageSize,
        });

    const [filterPayments, { data: filteredData, isLoading: isFiltering }] =
        useFilterPaymentsMutation();

    const isBusy = isFetching || isFiltering;

    const payments = isFilterActive
        ? filteredData?.content || []
        : data?.content || [];

    const totalElements = isFilterActive
        ? filteredData?.totalElements || 0
        : data?.totalElements || 0;

    const totalPages = isFilterActive
        ? filteredData?.totalPages || 1
        : data?.totalPages || 1;

    const handleEdit = (payment) => {
        setSelectedPayment(payment);
        setOpen(true);
    };

    /* ================= COMMON FILTER BUILDER ================= */
    const buildFilter = (override = {}) => ({
        search: localSearch || undefined,
        method: (override.method ?? method) !== "ALL"
            ? (override.method ?? method)
            : undefined,
        sort: override.sort || sort || "date_desc",
    });

    /* ================= COMMON API TRIGGER ================= */
    const triggerFilter = async (override = {}) => {
        const newPage = 0;

        dispatch(setPage(newPage));

        await filterPayments({
            filter: buildFilter(override),
            page: newPage,
            size: pageSize,
        });
    };

    /* ================= SEARCH ================= */
    const triggerSearch = async () => {
        dispatch(updateFilter({ key: "search", value: localSearch }));

        if (!localSearch.trim()) return;

        await triggerFilter();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            triggerSearch();
        }
    };

    /* ================= METHOD ================= */
    const handleMethodChange = async (m) => {
        dispatch(updateFilter({ key: "method", value: m }));

        if (m === "ALL" && !localSearch.trim()) return;

        await triggerFilter({ method: m });
    };

    /* ================= SORT ================= */
    const handleSortChange = async (value) => {
        dispatch(updateFilter({ key: "sort", value }));

        if (!isFilterActive) return;

        await triggerFilter({ sort: value });
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Payments</h1>
                    <p className="text-sm text-gray-500">
                        Manage and track all your payments
                    </p>
                </div>

                <Button
                    onClick={() => {
                        setSelectedPayment(null);
                        setOpen(true);
                    }}
                >
                    <Plus size={16} />
                    New Payment
                </Button>
            </div>

            <PaymentForm
                open={open}
                setOpen={(v) => {
                    setOpen(v);
                    if (!v) setSelectedPayment(null);
                }}
                payment={selectedPayment}
            />

            {/* SUMMARY */}
            <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                        <strong>{totalElements}</strong> payments
                    </span>

                    {(isFetching || isFiltering) && (
                        <span className="flex items-center gap-2 text-gray-500">
                            <div className="h-3 w-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            Syncing...
                        </span>
                    )}
                </div>
            </div>

            {/* MAIN CARD */}
            <div className="bg-linear-to-r from-indigo-300 via-purple-300 to-pink-300 border rounded-md shadow-sm overflow-hidden">

                {/* CONTROLS */}
                <div className="p-4 border-b flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

                    {/* SEARCH */}
                    <div className="flex w-full md:max-w-md gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

                            <Input
                                placeholder="Search payments..."
                                value={localSearch}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setLocalSearch(value);

                                    if (value.trim() === "") {
                                        dispatch(updateFilter({ key: "search", value: "" }));
                                    }
                                }}
                                onKeyDown={handleKeyDown}
                                className="pl-9 rounded-full bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <Button
                            onClick={triggerSearch}
                            className="cursor-pointer"
                        >
                            <Search size={16} />
                        </Button>
                    </div>

                    {/* FILTERS */}
                    <div className="flex gap-2">

                        {/* METHOD */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Filter size={16} /> {method || "ALL"}
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                {["ALL", "CASH", "UPI", "BANK"].map((m) => (
                                    <DropdownMenuItem
                                        key={m}
                                        onClick={() => handleMethodChange(m)}
                                    >
                                        {m}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* SORT */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <ArrowUpDown size={16} />
                                    {sort?.replaceAll("_", " ") || "date desc"}
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-56">

                                <DropdownMenuItem onClick={() => handleSortChange("date_desc")}>
                                    <Calendar size={14} className="mr-2" />
                                    Newest first
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleSortChange("date_asc")}>
                                    Oldest first
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleSortChange("amount_desc")}>
                                    <IndianRupee size={14} className="mr-2" />
                                    High → Low
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleSortChange("amount_asc")}>
                                    Low → High
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </div>

                {/* TABLE */}
                <div className="p-3">
                    {isBusy ? (
                        <div className="flex justify-center items-center h-40">
                            <Spinner />
                        </div>
                    ) : (
                        <PaymentTable
                            payments={payments}
                            isLoading={false}
                            showActions={true}
                            onEdit={handleEdit}
                        />
                    )}
                </div>

                {/* PAGINATION */}
                <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
                    <Button
                        variant="outline"
                        disabled={page === 0}
                        className="cursor-pointer"
                        onClick={() => dispatch(setPage(page - 1))}
                    >
                        Previous
                    </Button>

                    <p className="text-sm text-gray-600">
                        Page <b>{page + 1}</b> of <b>{totalPages}</b>
                    </p>

                    <Button
                        variant="outline"
                        disabled={page + 1 >= totalPages}
                        className="cursor-pointer"
                        onClick={() => {
                            const newPage = page + 1;
                            dispatch(setPage(newPage));

                            if (isFilterActive) {
                                filterPayments({
                                    filter: buildFilter(),
                                    page: newPage,
                                    size: pageSize,
                                });
                            }
                        }}
                    >
                        Next
                    </Button>
                </div>

            </div>
        </div>
    );
}