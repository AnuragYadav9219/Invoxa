import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCustomerSummaryQuery } from "@/features/invoice/invoiceApi";

import { Input } from "@/components/ui/input";
import { Search, Loader2, Users, ArrowRightLeft } from "lucide-react";
import CustomerTable from "./components/CustomerTable";
import CustomerCard from "./components/CustomerCard";

export default function CustomerPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: customers = [], isLoading, isFetching } = useGetCustomerSummaryQuery();

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const hasNoSearchResults = filtered.length === 0 && search.trim() !== "";

  return (
    <div className="space-y-5 mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Customers</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your profiles, look up accounts, and track balances.
          </p>
        </div>

        {isFetching && !isLoading && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50/60 border border-indigo-100 text-[11px] font-medium text-indigo-600 animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin" />
            Syncing ledger data...
          </div>
        )}
      </div>

      {/* STATS OVERVIEW BAR */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
          <Users size={16} className="text-slate-400" />
          <span>
            Showing <strong className="font-semibold text-slate-900">{filtered.length}</strong> of {customers.length} profiles
          </span>
        </div>
        <div className="text-xs text-slate-400 font-medium hidden sm:flex items-center gap-1">
          <ArrowRightLeft size={12} /> Select customer to access invoices
        </div>
      </div>

      {/* CORE INTERFACE CONTAINER */}
      <div className="rounded-xl border border-slate-200/70 bg-gray-100 shadow-xs overflow-hidden">

        {/* SEARCH ACTION BAR */}
        <div className="p-4 bg-slate-50/40 border-b border-slate-100">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
            <Input
              placeholder="Filter by customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 h-9 rounded-lg bg-white border-slate-200 text-sm"
            />
          </div>
        </div>

        {/* DATA LAYER DISPLAY */}
        <div className="p-1 relative min-h-60">
          {/* DESKTOP SCREEN RESOLUTION */}
          <div className="hidden lg:block">
            <CustomerTable customers={filtered} isLoading={isLoading} navigate={navigate} />
          </div>

          {/* TABLET RESOLUTION GRID */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 p-3">
            {isLoading ? (
              [...Array(4)].map((_, i) => <CustomerCard key={i} customer={null} />)
            ) : hasNoSearchResults ? (
              <CustomerCard isSearchFallback />
            ) : (
              filtered.map((c, i) => <CustomerCard key={c.id || i} customer={c} navigate={navigate} />)
            )}
          </div>

          {/* MOBILE SCREEN CARD VIEW */}
          <div className="block md:hidden space-y-3 p-3">
            {isLoading ? (
              [...Array(3)].map((_, i) => <CustomerCard key={i} customer={null} />)
            ) : hasNoSearchResults ? (
              <CustomerCard isSearchFallback />
            ) : (
              filtered.map((c, i) => <CustomerCard key={c.id || i} customer={c} navigate={navigate} isMobile />)
            )}
          </div>

          {/* GLOBAL LOADING OVERLAY */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs">
              <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                <p className="text-[11px] font-medium text-slate-500">Retrieving Accounts...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}