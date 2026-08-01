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
    CreditCard,
    ChevronDown,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import PaymentTable from "../components/PaymentTable";
import PaymentForm from "../components/PaymentForm";

import {
    setPage,
    updateFilter,
} from "@/features/payment/paymentSlice";

import usePaymentFilters from "../usePaymentFilters";
import PageLoader from "@/components/loaders/PageLoader";
import { EmptyState } from "@/components/errorWrapper/components";

export default function Payments() {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const { page, pageSize, filters } = useSelector(
        (state) => state.paymentUI
    );

    const { search, method, sort } = filters;

    const [localSearch, setLocalSearch] = useState(search || "");

    const {
        payments,
        totalPages,
        totalElements,
        isLoading,
        isFetching,
    } =
        usePaymentFilters({
            page,
            size: pageSize,
            search,
            method,
            sort,
        });

    const handleEdit = (payment) => {
        setSelectedPayment(payment);
        setOpen(true);
    };

    /* ================= SEARCH ================= */
    const triggerSearch = async () => {
        dispatch(updateFilter({ key: "search", value: localSearch }));
        dispatch(setPage(0));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            triggerSearch();
        }
    };

    /* ================= METHOD ================= */
    const handleMethodChange = async (m) => {
        dispatch(updateFilter({ key: "method", value: m }));
        dispatch(setPage(0));
    };

    /* ================= SORT ================= */
    const handleSortChange = async (value) => {
        dispatch(updateFilter({ key: "sort", value }));
        dispatch(setPage(0));
    };

    if (isLoading) {
        return <PageLoader text="Loading your payments..." />;
    }

    if (!payments.length && !localSearch && (!method || method === "ALL")) {
        return (
            <>
                <PaymentForm
                    open={open}
                    setOpen={(v) => {
                        setOpen(v);
                        if (!v) setSelectedPayment(null);
                    }}
                    payment={selectedPayment}
                />

                <EmptyState
                    title="No Payments Yet"
                    description="Record your first payment to start tracking transactions."
                    actionLabel="New Payment"
                    onAction={() => setOpen(true)}
                    showHome={false}
                />
            </>
        );
    }

    return (
        <div className="space-y-4 max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-2 sm:p-6 rounded-3xl border border-slate-200/85 shadow-xs">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-2xs">
                            <CreditCard size={20} />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Payments Ledger</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium pl-11">
                        Seamlessly monitor, filter, and track all incoming financial transactions
                    </p>
                </div>

                <Button
                    onClick={() => {
                        setSelectedPayment(null);
                        setOpen(true);
                    }}
                    className="cursor-pointer bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-md shadow-indigo-500/20 h-11 px-5 transition-all duration-200 flex items-center justify-center gap-2 shrink-0"
                >
                    <Plus size={18} />
                    <span>New Payment</span>
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

            {/* QUICK STATS & SYNC BAR */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-slate-200/85 rounded-2xl px-5 py-3.5 shadow-2xs gap-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Entries:</span>
                    <span className="font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl text-xs">
                        {totalElements} records found
                    </span>
                </div>

                {isFetching && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl animate-pulse">
                        <div className="h-3.5 w-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span>Syncing live transactions...</span>
                    </div>
                )}
            </div>

            {/* MAIN CARD CONTAINER */}
            <div className="bg-white border border-slate-200/85 rounded-3xl shadow-xl overflow-hidden">

                {/* CONTROLS HEADER */}
                <div className="p-2 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">

                    {/* SEARCH INPUT */}
                    <div className="flex w-full lg:max-w-md gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />

                            <Input
                                placeholder="Search by customer name, ref..."
                                value={localSearch}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setLocalSearch(value);

                                    if (value.trim() === "") {
                                        dispatch(updateFilter({ key: "search", value: "" }));
                                        dispatch(setPage(0));
                                    }
                                }}
                                onKeyDown={handleKeyDown}
                                className="pl-10 h-11 rounded-2xl bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm shadow-2xs"
                            />
                        </div>

                        <Button
                            onClick={triggerSearch}
                            className="cursor-pointer h-11 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl shadow-2xs font-semibold text-sm transition-all"
                        >
                            <Search size={16} />
                        </Button>
                    </div>

                    {/* FILTERS & SORTING BUTTONS */}
                    <div className="flex flex-wrap gap-2 items-center">

                        {/* METHOD DROPDOWN */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="outline"
                                    className="h-11 px-4 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs gap-2"
                                >
                                    <Filter size={15} className="text-indigo-500" /> 
                                    <span>Method: <strong className="text-slate-900">{method || "ALL"}</strong></span>
                                    <ChevronDown size={13} className="text-slate-400 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-44 rounded-2xl p-1.5 shadow-xl border-slate-100">
                                {["ALL", "CASH", "UPI", "BANK"].map((m) => (
                                    <DropdownMenuItem
                                        key={m}
                                        onClick={() => handleMethodChange(m)}
                                        className="rounded-xl px-3 py-2.5 text-xs font-semibold cursor-pointer hover:bg-indigo-50/80 hover:text-indigo-600 transition-colors"
                                    >
                                        {m}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* SORT DROPDOWN */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="outline"
                                    className="h-11 px-4 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs gap-2"
                                >
                                    <ArrowUpDown size={15} className="text-purple-500" />
                                    <span>Sort: <strong className="text-slate-900 capitalize">{sort?.replaceAll("_", " ") || "date desc"}</strong></span>
                                    <ChevronDown size={13} className="text-slate-400 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 shadow-xl border-slate-100">
                                <DropdownMenuItem onClick={() => handleSortChange("date_desc")} className="rounded-xl px-3 py-2.5 text-xs font-semibold cursor-pointer hover:bg-indigo-50/80 hover:text-indigo-600 flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span>Newest first</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleSortChange("date_asc")} className="rounded-xl px-3 py-2.5 text-xs font-semibold cursor-pointer hover:bg-indigo-50/80 hover:text-indigo-600 flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span>Oldest first</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleSortChange("amount_desc")} className="rounded-xl px-3 py-2.5 text-xs font-semibold cursor-pointer hover:bg-indigo-50/80 hover:text-indigo-600 flex items-center gap-2">
                                    <IndianRupee size={14} className="text-slate-400" />
                                    <span>Amount: High → Low</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleSortChange("amount_asc")} className="rounded-xl px-3 py-2.5 text-xs font-semibold cursor-pointer hover:bg-indigo-50/80 hover:text-indigo-600 flex items-center gap-2">
                                    <IndianRupee size={14} className="text-slate-400" />
                                    <span>Amount: Low → High</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </div>

                {/* TABLE VIEW */}
                <div className="p-2 sm:p-4 overflow-x-auto">
                    <PaymentTable
                        payments={payments}
                        isLoading={false}
                        showActions={true}
                        onEdit={handleEdit}
                    />
                </div>

                {/* PAGINATION FOOTER */}
                <div className="flex sm:flex-row justify-between items-center py-4 border-t border-slate-100 bg-slate-50/60 gap-3">
                    <Button
                        variant="outline"
                        disabled={page === 0}
                        className="cursor-pointer h-10 px-4 rounded-xl border-slate-200 bg-white font-semibold text-xs shadow-2xs hover:bg-slate-100 disabled:opacity-40"
                        onClick={() => dispatch(setPage(page - 1))}
                    >
                        Previous Page
                    </Button>

                    <p className="text-xs text-slate-500 font-medium">
                        Page <strong className="text-slate-900 font-bold">{page + 1}</strong> of <strong className="text-slate-900 font-bold">{totalPages || 1}</strong>
                    </p>

                    <Button
                        variant="outline"
                        disabled={page + 1 >= totalPages}
                        className="cursor-pointer h-10 px-4 rounded-xl border-slate-200 bg-white font-semibold text-xs shadow-2xs hover:bg-slate-100 disabled:opacity-40"
                        onClick={() => dispatch(setPage(page + 1))}
                    >
                        Next Page
                    </Button>
                </div>

            </div>
        </div>
    );
}