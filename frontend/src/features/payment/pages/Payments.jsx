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

export default function Payments() {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const { page, pageSize, filters } = useSelector(
        (state) => state.paymentUI
    );

    const { search, method, sort } = filters;

    const { data, isLoading, isFetching } =
        useGetAllPaymentsQuery({
            page,
            size: pageSize,
        });

    const handleEdit = (payment) => {
        setSelectedPayment(payment);
        setOpen(true);
    }

    const [filterPayments, { data: filteredData }] = useFilterPaymentsMutation();

    const payments = filteredData?.content || data?.content || [];
    const totalElements = filteredData?.totalElements || data?.totalElements || 0;
    const totalPages = filteredData?.totalPages || data?.totalPages || 1;

    /* ================= HANDLE SEARCH ================= */
    const handleSearch = async (value) => {
        dispatch(updateFilter({ key: "search", value }));

        await filterPayments({
            filter: { search: value, method },
            page,
            size: pageSize,
        });
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

            {/* SUMMARY BAR */}
            <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-3 shadow-sm">

                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                        <strong>{totalElements}</strong> payments
                        {totalElements > payments.length && (
                            <span className="text-gray-400 ml-1">
                                (showing {payments.length})
                            </span>
                        )}
                    </span>

                    {isFetching && (
                        <span className="flex items-center gap-2 text-gray-500">
                            <div className="h-3 w-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            Syncing...
                        </span>
                    )}
                </div>

                <div className="text-sm text-gray-400">
                    {/* Select payments to perform actions */}
                </div>
            </div>

            {/* MAIN CARD */}
            <div className="bg-linear-to-r from-indigo-300 via-purple-300 to-pink-300 border rounded-md shadow-sm overflow-hidden">

                {/* CONTROLS */}
                <div className="p-4 border-b flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

                    {/* SEARCH */}
                    <div className="relative w-full md:max-w-sm">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={16}
                        />

                        <Input
                            placeholder="Search payments..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9 rounded-full bg-gray-50 focus:bg-white"
                        />
                    </div>

                    {/* FILTERS */}
                    <div className="flex gap-2">

                        {/* METHOD FILTER */}
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
                                        onClick={() =>
                                            dispatch(updateFilter({ key: "method", value: m }))
                                        }
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

                                {/* DATE */}
                                <DropdownMenuItem
                                    onClick={() =>
                                        dispatch(updateFilter({ key: "sort", value: "date_desc" }))
                                    }
                                >
                                    <Calendar size={14} className="mr-2" />
                                    Newest first
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() =>
                                        dispatch(updateFilter({ key: "sort", value: "date_asc" }))
                                    }
                                >
                                    Oldest first
                                </DropdownMenuItem>

                                {/* AMOUNT */}
                                <DropdownMenuItem
                                    onClick={() =>
                                        dispatch(updateFilter({ key: "sort", value: "amount_desc" }))
                                    }
                                >
                                    <IndianRupee size={14} className="mr-2" />
                                    High → Low
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() =>
                                        dispatch(updateFilter({ key: "sort", value: "amount_asc" }))
                                    }
                                >
                                    Low → High
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </div>

                {/* TABLE */}
                <div className="relative p-3">

                    <PaymentTable
                        payments={payments}
                        isLoading={isLoading}
                        showActions={true}
                        onEdit={handleEdit}
                    />

                    {/* OVERLAY */}
                    {isFetching && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs text-gray-500">Updating data...</p>
                            </div>
                        </div>
                    )}

                </div>

                {/* PAGINATION */}
                <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">

                    <Button
                        variant="outline"
                        disabled={page === 0}
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
                        onClick={() => dispatch(setPage(page + 1))}
                    >
                        Next
                    </Button>

                </div>

            </div>
        </div>
    );
}