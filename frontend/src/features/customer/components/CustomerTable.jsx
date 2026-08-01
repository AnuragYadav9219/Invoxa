import {
    Table,
    TableBody,
    TableHeader,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import CustomerRow from "./CustomerRow";

export default function CustomerTable({
    customers = [],
    isLoading,
    navigate,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden backdrop-blur-xl"
        >
            <div className="overflow-x-auto">
                <Table className="w-full text-left border-collapse">
                    {/* HEADER */}
                    <TableHeader className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
                        <TableRow className="text-xs uppercase tracking-wider text-slate-500 hover:bg-transparent">
                            <TableHead className="pl-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Customer</TableHead>
                            <TableHead className="py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Phone</TableHead>
                            <TableHead className="py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Total</TableHead>
                            <TableHead className="py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Paid</TableHead>
                            <TableHead className="py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending</TableHead>
                            <TableHead className="pr-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Invoices</TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* BODY */}
                    <TableBody className="divide-y divide-slate-100/80">
                        {isLoading ? (
                            [...Array(6)].map((_, i) => (
                                <TableRow key={i} className="hover:bg-transparent">
                                    <TableCell colSpan="6" className="py-4 px-6">
                                        <div className="flex items-center justify-between animate-pulse">
                                            <div className="flex items-center gap-3.5">
                                                <div className="h-10 w-10 rounded-xl bg-slate-200"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-slate-200 rounded w-32"></div>
                                                    <div className="h-3 bg-slate-100 rounded w-20"></div>
                                                </div>
                                            </div>
                                            <div className="h-4 bg-slate-200 rounded w-24"></div>
                                            <div className="h-4 bg-slate-200 rounded w-20"></div>
                                            <div className="h-4 bg-slate-200 rounded w-16"></div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : customers.length > 0 ? (
                            customers.map((c, i) => (
                                <CustomerRow
                                    key={c.id || i}
                                    customer={c}
                                    navigate={navigate}
                                />
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-20 bg-slate-50/30"
                                >
                                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-3">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs border border-indigo-100">
                                            <Search className="w-5 h-5" />
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-slate-900">
                                                No customers found
                                            </h3>
                                            <p className="text-xs text-slate-500 max-w-xs">
                                                We couldn't find any matches. Try adjusting your search filters.
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </motion.div>
    );
}