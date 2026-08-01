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
    ArrowLeft,
    TrendingUp,
    Receipt,
    ShieldCheck,
    MapPin,
} from "lucide-react";
import InvoiceRowLite from "./components/InvoiceRowLite";
import InvoiceCardLite from "./components/InvoiceCardLite";
import { formatCurrency } from "@/utils/formatters";
import { FallbackPage } from "@/components/errorWrapper/components";
import { cn } from "@/lib/utils";

export default function CustomerDetailsPage() {
    const { name } = useParams();
    const navigate = useNavigate();
    const decodedName = decodeURIComponent(name);

    const { data: invoices = [], isLoading } =
        useGetInvoicesByCustomerQuery(decodedName);

    console.log(invoices)

    if (isLoading) {
        return <InvoiceTableSkeleton />;
    }

    if (!invoices.length) {
        return (
            <FallbackPage
                variant="empty"
                title="No invoices found"
                description={`${decodedName} doesn't have any invoices yet.`}
                showHome={false}
                showRetry={false}
            />
        );
    }

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
    const progressPercentage = Math.round((paid / (total || 1)) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-2 max-w-7xl mx-auto pb-4 px-0.5 sm:px-6"
        >
            {/* TOP NAVIGATION BAR */}
            <div className="flex items-center justify-between pt-2">
                <motion.button
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                    <ArrowLeft size={14} /> Go Back
                </motion.button>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold shadow-2xs">
                    <ShieldCheck size={14} />
                    <span>Verified Account</span>
                </div>
            </div>

            {/* HERO IDENTITY BANNER */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-linear-to-br from-indigo-50/70 via-white to-purple-50/50 p-6 sm:p-8 shadow-sm backdrop-blur-xl">
                <div className="absolute -top-16 -right-16 h-40 w-40 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 h-40 w-40 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200/50">
                            <Receipt size={26} />
                        </div>

                        <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 truncate">
                                    {decodedName}
                                </h1>

                                <span className="inline-flex max-w-xs items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs sm:text-sm font-medium text-slate-600 shadow-sm">
                                    <MapPin size={13} className="shrink-0 text-indigo-500" />
                                    <span className="truncate">
                                        {invoices?.[0]?.customerAddress?.trim()
                                            ? invoices[0].customerAddress
                                            : "Address Not Available"}
                                    </span>
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm leading-relaxed text-slate-500">
                                Detailed invoice breakdown, ledger history, and automated financial tracking.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/90 border border-slate-200/80 px-4 py-3 rounded-2xl shadow-xs">
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Volume</p>
                            <p className="text-sm font-bold text-slate-900">{invoices.length} Invoices Issued</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* METRICS STATS CARDS */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                {/* Total Revenue */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -2 }}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Wallet size={14} className="text-indigo-500" /> Total Revenue
                        </p>
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                            <Wallet size={16} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mt-3 tracking-tight">
                        {formatCurrency(total)}
                    </h2>
                </motion.div>

                {/* Collected */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -2 }}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-emerald-500" /> Collected
                        </p>
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-600 mt-3 tracking-tight">
                        {formatCurrency(paid)}
                    </h2>
                </motion.div>

                {/* Outstanding */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -2 }}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all relative overflow-hidden"
                >
                    <div className={cn("absolute top-0 left-0 right-0 h-1", pending > 0 ? "bg-rose-500" : "bg-slate-300")} />
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertCircle size={14} className="text-rose-500" /> Outstanding
                        </p>
                        <div className={cn("p-2 rounded-xl", pending > 0 ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500")}>
                            <AlertCircle size={16} />
                        </div>
                    </div>
                    <h2 className={cn("text-2xl font-bold mt-3 tracking-tight", pending > 0 ? "text-rose-600" : "text-slate-400")}>
                        {formatCurrency(pending)}
                    </h2>
                </motion.div>
            </motion.div>

            {/* PROGRESS SECTION */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
                        Collection Performance Indicator
                    </span>
                    <span className="text-indigo-600 font-bold px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
                        {progressPercentage}% Collected
                    </span>
                </div>

                <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full"
                    />
                </div>
            </div>

            {/* DATA CONTAINER */}
            <div className="rounded-2xl mt-5 border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 bg-linear-to-r from-slate-50/60 via-white to-slate-50/60 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <FileText size={16} className="text-indigo-600" />
                        Invoice Registry Records
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">{invoices.length} entries found</span>
                </div>

                <div className="p-2 sm:p-4">
                    {/* DESKTOP */}
                    <div className="hidden lg:block">
                        <Table>
                            <TableHeader className="bg-slate-50/80 sticky top-0 z-10">
                                <TableRow className="text-[11px] font-bold uppercase text-slate-500 tracking-wider border-b border-slate-100">
                                    <TableHead className="py-4">Invoice</TableHead>
                                    <TableHead className="py-4">Total</TableHead>
                                    <TableHead className="py-4">Paid</TableHead>
                                    <TableHead className="py-4">Pending</TableHead>
                                    <TableHead className="py-4">Status</TableHead>
                                    <TableHead className="py-4">Due Date</TableHead>
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
                    <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
                        {invoices.map((inv) => (
                            <motion.div
                                key={inv.id}
                                initial={{ opacity: 0, y: 15 }}
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
                    <div className="block md:hidden space-y-3">
                        {invoices.map((inv) => (
                            <motion.div
                                key={inv.id}
                                initial={{ opacity: 0, y: 15 }}
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
                </div>
            </div>
        </motion.div>
    );
}