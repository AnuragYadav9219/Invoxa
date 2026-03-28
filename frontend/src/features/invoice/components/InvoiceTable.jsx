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
import { useDeleteInvoiceMutation } from "../invoiceApi";
import { showError, showSuccess } from "@/components/toast/toast";
import InvoiceForm from "./InvoiceForm";
import { cn } from "@/lib/utils";

export default function InvoiceTable({
  invoices = [],
  isLoading,
  showActions = false,
  limit,
}) {
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [deleteInvoice] = useDeleteInvoiceMutation();

  const handleEdit = (inv) => {
    setSelectedInvoice(inv);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteInvoice(id).unwrap();
      showSuccess("Invoice deleted successfully");
    } catch {
      showError("Failed to delete invoice");
    }
  };

  const data = limit ? invoices.slice(0, limit) : invoices;

  if (isLoading) return <InvoiceTableSkeleton />;

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
        <div className="p-4 rounded-2xl bg-white shadow-sm mb-4">
          <Inbox className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="text-slate-900 font-bold text-lg">No invoices found</h3>
        <p className="text-sm text-slate-500 max-w-50 text-center mt-1">
          Your invoice list is empty. Create one to get started.
        </p>
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
                onDelete={handleDelete}
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
            onDelete={handleDelete} 
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
            onDelete={handleDelete}
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