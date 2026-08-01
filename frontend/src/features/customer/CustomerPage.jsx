import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCustomerSummaryQuery } from "@/features/invoice/invoiceApi";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Search, Loader2, Users, ArrowRightLeft, Sparkles, X } from "lucide-react";
import CustomerTable from "./components/CustomerTable";
import CustomerCard from "./components/CustomerCard";
import PageLoader from "@/components/loaders/PageLoader";
import { EmptyState } from "@/components/errorWrapper/components";

export default function CustomerPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const { data: customers = [], isLoading, isFetching } = useGetCustomerSummaryQuery();

    if (isLoading) {
        return <PageLoader text="Loading Customers..." />;
    }

    if (!customers || customers.length === 0) {
        return (
            <EmptyState
                title="No Customers Yet"
                description="Create your first invoice to see customer insights here."
            />
        );
    }

    const filtered = customers.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase())
    );

    const hasNoSearchResults = filtered.length === 0 && search.trim() !== "";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6 mx-auto max-w-7xl pb-10"
        >
            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
                            <Users size={18} />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                            Customers
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Manage your profiles, look up accounts, and track balances in real-time.
                    </p>
                </div>

                <AnimatePresence>
                    {isFetching && !isLoading && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200/60 text-xs font-semibold text-indigo-600 shadow-xs"
                        >
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Syncing ledger data...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* STATS OVERVIEW BAR */}
            <div className="flex items-center justify-between bg-linear-to-r from-slate-50 via-indigo-50/20 to-slate-50 border border-slate-200/80 rounded-2xl px-5 py-3.5 shadow-xs backdrop-blur-md">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                    <div className="p-1.5 rounded-lg bg-indigo-100/60 text-indigo-600">
                        <Sparkles size={14} />
                    </div>
                    <span>
                        Showing <strong className="font-bold text-slate-900">{filtered.length}</strong> of <strong className="text-slate-700">{customers.length}</strong> active profiles
                    </span>
                </div>
                <div className="text-xs text-slate-400 font-medium hidden sm:flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                    <ArrowRightLeft size={12} className="text-indigo-500" /> Select customer to access invoices
                </div>
            </div>

            {/* CORE INTERFACE CONTAINER */}
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden backdrop-blur-xl">

                {/* SEARCH ACTION BAR */}
                <div className="p-4 sm:p-5 bg-linear-to-br from-slate-50/60 via-white to-indigo-50/20 border-b border-slate-100 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        <Input
                            placeholder="Filter by customer name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-9 h-10 rounded-xl bg-white border-slate-200 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
                        />
                        {search && (
                            <button 
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* DATA LAYER DISPLAY */}
                <div className="p-2 sm:p-4 relative min-h-75">
                    {/* DESKTOP SCREEN RESOLUTION */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hidden lg:block"
                    >
                        <CustomerTable customers={filtered} isLoading={isLoading} navigate={navigate} />
                    </motion.div>

                    {/* TABLET RESOLUTION GRID */}
                    <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 p-2">
                        {isLoading ? (
                            [...Array(4)].map((_, i) => <CustomerCard key={i} customer={null} />)
                        ) : hasNoSearchResults ? (
                            <div className="col-span-2 py-12 text-center text-slate-500 text-sm">
                                No matching customers found for "{search}"
                            </div>
                        ) : (
                            filtered.map((c, i) => <CustomerCard key={c.id || i} customer={c} navigate={navigate} />)
                        )}
                    </div>

                    {/* MOBILE SCREEN CARD VIEW */}
                    <div className="block md:hidden space-y-3 p-1">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => <CustomerCard key={i} customer={null} />)
                        ) : hasNoSearchResults ? (
                            <div className="py-12 text-center text-slate-500 text-sm">
                                No matching customers found for "{search}"
                            </div>
                        ) : (
                            filtered.map((c, i) => <CustomerCard key={c.id || i} customer={c} navigate={navigate} isMobile />)
                        )}
                    </div>

                    {/* GLOBAL LOADING OVERLAY */}
                    <AnimatePresence>
                        {isLoading && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-xs z-20"
                            >
                                <div className="flex flex-col items-center gap-2.5 bg-white p-5 rounded-2xl border border-slate-100 shadow-xl">
                                    <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                                    <p className="text-xs font-semibold text-slate-600">Retrieving Accounts...</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}