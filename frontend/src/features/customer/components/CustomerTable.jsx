import {
    Table,
    TableBody,
    TableHeader,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";

import CustomerRow from "./CustomerRow";

export default function CustomerTable({
    customers = [],
    isLoading,
    navigate,
}) {
    return (
        <div className="p-[1.5px] rounded-3xl bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">

            {/* MAIN CARD */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

                {/* DESKTOP TABLE */}
                <div className="hidden lg:block p-3">

                    <Table className="w-full">

                        {/* HEADER */}
                        <TableHeader className="bg-white/80 backdrop-blur sticky top-0 z-10 border-b">
                            <TableRow className="text-xs uppercase tracking-wider text-slate-500">
                                <TableHead className="pl-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Customer</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Phone</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Paid</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending</TableHead>
                                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Invoices</TableHead>
                            </TableRow>
                        </TableHeader>

                        {/* BODY */}
                        <TableBody>

                            {/* LOADING */}
                            {isLoading ? (
                                [...Array(6)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan="4" className="p-6">
                                            <div className="flex items-center gap-4 animate-pulse">
                                                <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                    <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                                                </div>
                                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : customers.length > 0 ? (
                                customers.map((c, i) => (
                                    <CustomerRow
                                        key={i}
                                        customer={c}
                                        navigate={navigate}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="4" className="text-center py-16 text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-lg">No customers found</p>
                                            <p className="text-sm text-gray-400">
                                                Try searching something else
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                    </Table>
                </div>

            </div>
        </div>
    );
}