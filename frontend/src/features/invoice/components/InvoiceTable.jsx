import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import InvoiceRow from "./InvoiceRow";
import InvoiceCard from "./InvoiceCard";
import { FileText, Inbox } from "lucide-react";
import InvoiceTableSkeleton from "@/components/loaders/InvoiceTableSkeleton";
import { useState } from "react";
import InvoiceForm from "./InvoiceForm";
import { cn } from "@/lib/utils";
import { useInvoiceActions } from "../hooks/useInvoiceActions";
import { Button } from "@/components/ui/button";

export default function InvoiceTable({
  invoices = [],
  isLoading,
  showActions = false,
  limit,
}) {
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { handleDelete } = useInvoiceActions();

  const handleEdit = (inv) => {
    setSelectedInvoice(inv);
    setOpenForm(true);
  };

  const data = limit ? invoices.slice(0, limit) : invoices;

  if (isLoading) return <InvoiceTableSkeleton />;

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
        <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 mb-5">
          <FileText className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>

        <h3 className="text-xl font-bold">
          No invoices yet
        </h3>

        <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
          You haven't created any invoices yet. Create your first invoice to start
          tracking payments and revenue.
        </p>

        {showActions && (
          <Button
            className="mt-6"
            onClick={() => {
              setSelectedInvoice(null);
              setOpenForm(true);
            }}
          >
            Create Invoice
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b border-slate-100">
              <TableHead className="pl-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Invoice</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Customer</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Paid</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Balance</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Due Date</TableHead>
              <TableHead className={cn(
                "pr-6 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500",
                !showActions && "opacity-0"
              )}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((inv) => (
              <InvoiceRow
                key={inv.id}
                inv={inv}
                navigate={navigate}
                showActions={showActions}
                onEdit={handleEdit}
                onDelete={() => handleDelete(inv)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* TABLET GRID VIEW */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-6">
        {data.map((inv) => (
          <InvoiceCard
            key={inv.id}
            inv={inv}
            navigate={navigate}
            showActions={showActions}
            onEdit={handleEdit}
            onDelete={() => handleDelete(inv)}
          />
        ))}
      </div>

      {/* MOBILE LIST VIEW */}
      <div className="block md:hidden space-y-4">
        {data.map((inv) => (
          <InvoiceCard
            key={inv.id}
            inv={inv}
            navigate={navigate}
            isMobile
            showActions={showActions}
            onEdit={handleEdit}
            onDelete={() => handleDelete(inv)}
          />
        ))}
      </div>

      <InvoiceForm
        open={openForm}
        setOpen={setOpenForm}
        invoice={selectedInvoice}
      />
    </>
  );
}