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
import { FileText } from "lucide-react";
import InvoiceTableSkeleton from "@/components/loaders/InvoiceTableSkeleton";
import { useState } from "react";
import { useDeleteInvoiceMutation } from "../invoiceApi";
import { showError, showSuccess } from "@/components/toast/toast";
import InvoiceForm from "./InvoiceForm";

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
    if (!confirm("Are you sure you want to delete this invoice?")) return;

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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-3 rounded-full bg-gray-100 mb-3">
          <FileText className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">
          No invoices found
        </p>
        <p className="text-sm text-gray-400">
          Create your first invoice to get started
        </p>
      </div>
    );
  }

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden lg:block rounded-xl border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="hover:bg-transparent">
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>

              <TableHead
                className={`text-right ${!showActions ? "opacity-0 pointer-events-none" : ""}`}
              >
                Action
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

      {/* TABLET */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-5">
        {data.map((inv) => (
          <InvoiceCard
            key={inv.id}
            inv={inv}
            navigate={navigate}
            showActions={showActions}
            onEdit={handleEdit}
            onDelete={handleEdit}
          />
        ))}
      </div>

      {/* MOBILE */}
      <div className="block md:hidden space-y-4">
        {data.map((inv) => (
          <InvoiceCard
            key={inv.id}
            inv={inv}
            navigate={navigate}
            isMobile
            showActions={showActions}
            onEdit={handleEdit}
            onDelete={handleEdit}
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