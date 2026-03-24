import { useState } from "react";
import { useNavigate } from "react-router-dom";

import InvoiceTable from "@/components/invoice/InvoiceTable";
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
} from "lucide-react";

import { cn } from "@/lib/utils";

export default function Invoices() {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sort, setSort] = useState("DATE_DESC");
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText size={22} />
            <h1 className="text-2xl font-bold">Invoices</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all your invoices in one place
          </p>
        </div>

        <Button
          onClick={() => navigate("/invoices/create")}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          New Invoice
        </Button>
      </div>

      {/* CONTROLS */}
      <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

        {/* SEARCH */}
        <div className="relative w-full md:max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-full bg-gray-50 focus:bg-white"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 flex-wrap">

          {/* FILTER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter size={16} />
                {statusFilter}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {["ALL", "PAID", "PENDING", "PARTIALLY_PAID", "OVERDUE"].map((s) => (
                <DropdownMenuItem
                  key={s}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* SORT */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <ArrowUpDown size={16} />
                {sort.replace("_", " ")}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-2 space-y-1">

              <p className="px-2 text-xs text-gray-400">Date</p>

              <DropdownMenuItem
                className={cn("cursor-pointer", sort === "DATE_DESC" && "bg-gray-100 font-semibold")}
                onClick={() => setSort("DATE_DESC")}
              >
                Newest first
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn("cursor-pointer", sort === "DATE_ASC" && "bg-gray-100 font-semibold")}
                onClick={() => setSort("DATE_ASC")}
              >
                Oldest first
              </DropdownMenuItem>

              <p className="px-2 mt-2 text-xs text-gray-400">Amount</p>

              <DropdownMenuItem
                className={cn("cursor-pointer", sort === "AMOUNT_DESC" && "bg-gray-100 font-semibold")}
                onClick={() => setSort("AMOUNT_DESC")}
              >
                High → Low
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn("cursor-pointer", sort === "AMOUNT_ASC" && "bg-gray-100 font-semibold")}
                onClick={() => setSort("AMOUNT_ASC")}
              >
                Low → High
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

        <div className="px-4 py-3 border-b">
          <p className="text-sm font-medium text-gray-600">
            All Invoices
          </p>
        </div>

        <div className="p-2">
          <InvoiceTable
            externalStatus={statusFilter}
            externalSort={sort}
            search={search}   // 🔥 KEY
            showActions={true}
          />
        </div>
      </div>
    </div>
  );
}