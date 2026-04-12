import { useParams, useNavigate } from "react-router-dom";
import { useGetInvoicesByCustomerQuery } from "@/features/invoice/invoiceApi";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import InvoiceTableSkeleton from "@/components/loaders/InvoiceTableSkeleton";
import { motion } from "framer-motion";
import {
  FileText,
  Wallet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import InvoiceRowLite from "./components/InvoiceRowLite";
import InvoiceCardLite from "./components/InvoiceCardLite";
import { formatCurrency } from "@/utils/formatters";

export default function CustomerDetailsPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(name);

  const { data: invoices = [], isLoading } =
    useGetInvoicesByCustomerQuery(decodedName);

  if (isLoading) return <InvoiceTableSkeleton />;

  // Calculations
  const total = invoices.reduce(
    (sum, inv) => sum + Number(inv.totalAmount || 0),
    0
  );

  const paid = invoices.reduce(
    (sum, inv) => sum + Number(inv.paidAmount || 0),
    0
  );

  const pending = total - paid;

  return (
    <div className="space-y-6 p-1 pt-2">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/70 backdrop-blur rounded-2xl shadow-md">
            <FileText className="text-indigo-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {decodedName}
            </h1>
            <p className="text-sm text-gray-500">
              Invoice summary & payment insights
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="text-sm text-gray-400">
          {invoices.length} invoices
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">

        {/* Total */}
        <div className="group bg-white/70 backdrop-blur-xl border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Wallet size={12} /> Total Revenue
          </p>
          <h2 className="text-2xl font-bold text-emerald-600 mt-1">
            {formatCurrency(total)}
          </h2>
        </div>

        {/* Paid */}
        <div className="group bg-white/70 backdrop-blur-xl border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <CheckCircle2 size={12} /> Collected
          </p>
          <h2 className="text-2xl font-bold text-blue-600 mt-1">
            {formatCurrency(paid)}
          </h2>
        </div>

        {/* Pending */}
        <div className="group bg-white/70 backdrop-blur-xl border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <AlertCircle size={12} /> Outstanding
          </p>
          <h2
            className={`text-2xl font-bold mt-1 ${pending > 0 ? "text-rose-600" : "text-gray-400"
              }`}
          >
            {formatCurrency(pending)}
          </h2>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur border rounded-2xl p-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Payment Progress</span>
          <span>
            {Math.round((paid / (total || 1)) * 100)}%
          </span>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all"
            style={{ width: `${(paid / (total || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="p-[1.5px] rounded-3xl bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">

          {/* DESKTOP TABLE */}
          <div className="hidden lg:block p-3">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow className="text-xs uppercase text-gray-500 tracking-wider">
                  <TableHead>Invoice</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {invoices.map((inv) => (
                  <InvoiceRowLite
                    key={inv.id}
                    inv={inv}
                    navigate={navigate}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* TABLET */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 p-4">
            {invoices.map((inv) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <InvoiceCardLite
                  inv={inv}
                  navigate={navigate}
                />
              </motion.div>
            ))}
          </div>

          {/* MOBILE */}
          <div className="block md:hidden space-y-4 p-4">
            {invoices.map((inv) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <InvoiceCardLite
                  inv={inv}
                  navigate={navigate}
                  isMobile
                />
              </motion.div>
            ))}
          </div>

          {/* EMPTY */}
          {invoices.length === 0 && (
            <div className="text-center py-16 flex flex-col items-center gap-2">
              <FileText className="text-gray-300" size={40} />
              <p className="text-lg text-gray-500">No invoices found</p>
              <p className="text-sm text-gray-400">
                This customer hasn’t made any transactions yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}