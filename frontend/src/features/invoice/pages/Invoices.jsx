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
  Check,
  IndianRupee,
  Wallet,
  Clock,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import useInvoiceFilters from "@/features/invoice/hooks/useInvoiceFilters";
import { setPage, updateFilter } from "@/features/invoice/invoiceSlice";
import InvoiceTable from "../components/InvoiceTable";
import { useState } from "react";
import InvoiceForm from "../components/InvoiceForm";
import PageLoader from "@/components/loaders/PageLoader";
import { EmptyState } from "@/components/errorWrapper/components";

export default function Invoices() {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const { page, pageSize, filters } = useSelector((state) => state.invoiceUI);
  const { search, status, sort, fromDate, toDate } = filters;

  const {
    invoices,
    totalPages,
    totalElements,
    isLoading,
    isFetching,
  } = useInvoiceFilters({
    page,
    size: pageSize,
    externalStatus: status,
    externalSort: sort,
    search,
    fromDate,
    toDate,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!invoices.length && !search && status === "ALL") {
    return (
      <>
        <InvoiceForm
          open={open}
          setOpen={setOpen}
        />

        <EmptyState
          title="No Invoices Yet"
          description="Create your first invoice to start tracking your business."
          actionLabel="Create Invoice"
          onAction={() => setOpen(true)}
          showHome={false}
        />
      </>
    );
  }

  return (
    <div className="space-y-5 sm:p-2 pb-4 max-w-7xl mx-auto">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-linear-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-1">
            <Sparkles size={12} />
            <span>Financial Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Invoices</h1>
          <p className="text-sm text-slate-500">
            Manage, filter, and track all your business invoices in real-time.
          </p>
        </div>

        <Button
          className="cursor-pointer bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => setOpen(true)}
        >
          <Plus size={18} className="mr-1" />
          New Invoice
        </Button>
      </div>

      <InvoiceForm open={open} setOpen={setOpen} />

      {/* METRICS & SUMMARY BAR */}
      <div className="flex flex-wrap items-center justify-between bg-white border border-slate-100 rounded-2xl px-5 py-3.5 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900">{totalElements}</span>
            <span className="text-slate-400">Total Invoices</span>
            {totalElements > invoices.length && (
              <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium ml-1">
                Showing {invoices.length}
              </span>
            )}
          </div>

          {isFetching && (
            <span className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg animate-pulse font-medium">
              <div className="h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              Syncing data...
            </span>
          )}
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Active Status Filter: <span className="text-slate-700 font-semibold uppercase">{status}</span>
        </div>
      </div>

      {/* MAIN DATA CARD */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300">

        {/* CONTROLS BAR */}
        <div className="p-2 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row gap-3 md:items-center md:justify-between bg-slate-50/50">

          {/* SEARCH INPUT */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search by invoice number or client name..."
              value={search}
              onChange={(e) =>
                dispatch(updateFilter({ key: "search", value: e.target.value }))
              }
              className="pl-10 h-10 rounded-xl bg-white border-slate-200/80 focus:border-indigo-500 focus:ring-indigo-500/20 shadow-2xs transition-all text-sm"
            />
          </div>

          {/* FILTERS & SORT */}
          <div className="flex items-center gap-2.5 flex-wrap">

            {/* STATUS FILTER DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer h-10 rounded-xl border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs gap-2 px-3.5"
                >
                  <Filter size={15} className="text-indigo-500" />
                  <span>Status: <strong className="text-slate-900">{status}</strong></span>
                  <ChevronDown size={13} className="text-slate-400 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-xl shadow-xl border-slate-100">
                {["ALL", "PAID", "PENDING", "OVERDUE"].map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() =>
                      dispatch(updateFilter({ key: "status", value: s }))
                    }
                    className="flex items-center justify-between cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <span>{s}</span>
                    {status === s && <Check size={14} className="text-indigo-600" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* SORTING DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="cursor-pointer h-10 rounded-xl border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs gap-2 px-3.5">
                  <ArrowUpDown size={15} className="text-indigo-500" />
                  <span>Sort: <strong className="text-slate-900">{sort.replaceAll("_", " ").toLowerCase()}</strong></span>
                  <ChevronDown size={13} className="text-slate-400 ml-1" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72 p-3 space-y-4 rounded-2xl shadow-xl border-slate-100">

                {/* DATE SORT */}
                <div className="space-y-1">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Calendar size={12} className="text-indigo-500" /> Date Ordering
                  </p>
                  {[
                    ["DATE_DESC", "Newest first"],
                    ["DATE_ASC", "Oldest first"],
                  ].map(([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      className="flex items-center justify-between cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      onClick={() =>
                        dispatch(updateFilter({ key: "sort", value: key }))
                      }
                    >
                      <span>{label}</span>
                      {sort === key && <Check size={14} className="text-indigo-600" />}
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* TOTAL AMOUNT SORT */}
                <div className="space-y-1">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <IndianRupee size={12} className="text-indigo-500" /> Total Amount
                  </p>
                  {[
                    ["AMOUNT_DESC", "High → Low"],
                    ["AMOUNT_ASC", "Low → High"],
                  ].map(([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      className="flex items-center justify-between cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      onClick={() =>
                        dispatch(updateFilter({ key: "sort", value: key }))
                      }
                    >
                      <span>{label}</span>
                      {sort === key && <Check size={14} className="text-indigo-600" />}
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* PAID AMOUNT SORT */}
                <div className="space-y-1">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Wallet size={12} className="text-indigo-500" /> Paid Amount
                  </p>
                  {[
                    ["PAID_DESC", "High → Low"],
                    ["PAID_ASC", "Low → High"],
                  ].map(([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      className="flex items-center justify-between cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      onClick={() =>
                        dispatch(updateFilter({ key: "sort", value: key }))
                      }
                    >
                      <span>{label}</span>
                      {sort === key && <Check size={14} className="text-indigo-600" />}
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* REMAINING AMOUNT SORT */}
                <div className="space-y-1">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Clock size={12} className="text-indigo-500" /> Remaining Balance
                  </p>
                  {[
                    ["REMAINING_DESC", "High → Low"],
                    ["REMAINING_ASC", "Low → High"],
                  ].map(([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      className="flex items-center justify-between cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      onClick={() =>
                        dispatch(updateFilter({ key: "sort", value: key }))
                      }
                    >
                      <span>{label}</span>
                      {sort === key && <Check size={14} className="text-indigo-600" />}
                    </DropdownMenuItem>
                  ))}
                </div>

              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="relative p-1 sm:p-3">
          <InvoiceTable
            invoices={invoices}
            isLoading={isLoading}
            showActions={true}
          />

          {/* FETCHING OVERLAY */}
          {isFetching && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-2xs rounded-xl transition-all">
              <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-lg border border-slate-100">
                <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium text-slate-600">Updating records...</p>
              </div>
            </div>
          )}
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <Button
            variant="outline"
            disabled={page === 0}
            className="cursor-pointer rounded-xl bg-white border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold shadow-2xs transition-all"
            onClick={() => dispatch(setPage(page - 1))}
          >
            Previous Page
          </Button>

          <p className="text-xs font-medium text-slate-500">
            Page <strong className="text-slate-800">{page + 1}</strong> of <strong className="text-slate-800">{totalPages || 1}</strong>
          </p>

          <Button
            variant="outline"
            disabled={page + 1 >= totalPages}
            className="cursor-pointer rounded-xl bg-white border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold shadow-2xs transition-all"
            onClick={() => dispatch(setPage(page + 1))}
          >
            Next Page
          </Button>
        </div>

      </div>
    </div>
  );
}