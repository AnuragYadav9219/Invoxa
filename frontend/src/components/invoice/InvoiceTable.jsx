import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import useInvoiceFilters from "@/hooks/useInvoiceFilters";
import { useNavigate } from "react-router-dom";
import InvoiceTableSkeleton from "./InvoiceTableSkeleton";
import InvoiceRow from "./InvoiceRow";
import InvoiceCard from "./InvoiceCard";

export default function InvoiceTable({ page, showActions = false, limit, ...props }) {
  const navigate = useNavigate();

  const {
    invoices,
    isLoading,
    isFetching,
  } = useInvoiceFilters({ page, ...props });

  if (isLoading) return <InvoiceTableSkeleton />;

  const data = limit ? invoices.slice(0, limit) : invoices;

  if (!data.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No invoices found
      </p>
    );
  }

  return (
    <>
      {isFetching && (
        <p className="text-sm text-gray-500 mb-2">Refreshing...</p>
      )}

      {/* DESKTOP FIXED */}
      <div className="hidden lg:block">
        <Table>
          {/* HEADER */}
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              {showActions && <TableHead className="text-right">Action</TableHead>}
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {data.map((inv) => (
              <InvoiceRow key={inv.id} inv={inv} navigate={navigate} showActions={showActions} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* TABLET */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
        {data.map((inv) => (
          <InvoiceCard key={inv.id} inv={inv} navigate={navigate} showActions={showActions} />
        ))}
      </div>

      {/* MOBILE */}
      <div className="block md:hidden space-y-4">
        {data.map((inv) => (
          <InvoiceCard key={inv.id} inv={inv} navigate={navigate} isMobile showActions={showActions} />
        ))}
      </div>
    </>
  );
}