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
  FileText,
  Filter,
  ArrowUpDown,
  Search,
  Calendar,
  Check,
  IndianRupee,
  Wallet,
  Clock,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import useInvoiceFilters from "@/features/invoice/useInvoiceFilters";
import { setPage, updateFilter } from "@/features/invoice/invoiceSlice";
import InvoiceTable from "../components/InvoiceTable";
import { useState } from "react";
import InvoiceForm from "../components/InvoiceForm";

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

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-gray-500">
            Manage and track all your invoices
          </p>
        </div>

        <Button
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Plus size={16} />
          New Invoice
        </Button>
      </div>

      <InvoiceForm open={open} setOpen={setOpen} />

      {/* SUMMARY BAR */}
      <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-3 shadow-sm">

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            <strong>{totalElements}</strong> invoices
            {totalElements > invoices.length && (
              <span className="text-gray-400 ml-1">
                (showing {invoices.length})
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

        {/* BULK ACTION (future ready to write here) */}
        <div className="text-sm text-gray-400">
          Select invoices to perform actions
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

        {/* CONTROLS */}
        <div className="p-4 border-b flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

          {/* SEARCH */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(e) =>
                dispatch(updateFilter({ key: "search", value: e.target.value }))
              }
              className="pl-9 rounded-full bg-gray-50 focus:bg-white"
            />
          </div>

          {/* FILTERS */}
          <div className="flex gap-2">

            {/* STATUS */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                >
                  <Filter size={16} /> {status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["ALL", "PAID", "PENDING", "OVERDUE"].map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() =>
                      dispatch(updateFilter({ key: "status", value: s }))
                    }
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* SORT */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2 cursor-pointer">
                  <ArrowUpDown size={16} />
                  {sort.replaceAll("_", " ").toLowerCase()}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 p-2 space-y-2">

                {/* DATE */}
                <div>
                  <p className="px-2 text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Calendar size={12} /> Date
                  </p>

                  {[
                    ["DATE_DESC", "Newest first"],
                    ["DATE_ASC", "Oldest first"],
                  ].map(([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        dispatch(updateFilter({ key: "sort", value: key }))
                      }
                    >
                      <span>{label}</span>

                      {sort === key && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* TOTAL */}
                <div>
                  <p className="px-2 text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <IndianRupee size={12} /> Total Amount
                  </p>

                  {[
                    ["AMOUNT_DESC", "High → Low"],
                    ["AMOUNT_ASC", "Low → High"],
                  ].map(([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        dispatch(updateFilter({ key: "sort", value: key }))
                      }
                    >
                      <span>{label}</span>

                      {sort === key && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* PAID */}
                <div>
                  <p className="px-2 text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Wallet size={12} /> Paid Amount
                  </p>

                  {[
                    ["PAID_DESC", "High → Low"],
                    ["PAID_ASC", "Low → High"],
                  ].map(([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        dispatch(updateFilter({ key: "sort", value: key }))
                      }
                    >
                      <span>{label}</span>

                      {sort === key && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* REMAINING */}
                <div>
                  <p className="px-2 text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Clock size={12} /> Remaining Amount
                  </p>

                  {[
                    ["REMAINING_DESC", "High → Low"],
                    ["REMAINING_ASC", "Low → High"],
                  ].map(([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        dispatch(updateFilter({ key: "sort", value: key }))
                      }
                    >
                      <span>{label}</span>

                      {sort === key && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>

              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        {/* TABLE */}
        <div className="relative p-3">

          <InvoiceTable
            invoices={invoices}
            isLoading={isLoading}
            showActions={true}
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
            className="cursor-pointer"
            onClick={() => dispatch(setPage(page - 1))}
          >
            Previous
          </Button>

          <p className="text-sm text-gray-600">
            Page <b>{page + 1}</b> of <b>{totalPages || 1}</b>
          </p>

          <Button
            variant="outline"
            disabled={page + 1 >= totalPages}
            className="cursor-pointer"
            onClick={() => dispatch(setPage(page + 1))}
          >
            Next
          </Button>
        </div>

      </div>
    </div>
  );
}
