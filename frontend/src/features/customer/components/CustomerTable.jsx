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
        <div className="p-[1.5px] rounded-lg bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">

            {/* MAIN CARD */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">

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
                                <TableRow className="hover:bg-transparent">
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-20 bg-slate-50/40 border-t border-slate-100/50"
                                    >
                                        <div className="flex flex-col items-center justify-center max-w-xs mx-auto text-center">
                                            {/* Minimalist Search Icon Graphic */}
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4 ring-8 ring-slate-50">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.75"
                                                    stroke="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
                                                </svg>
                                            </div>

                                            {/* Content */}
                                            <h3 className="text-sm font-semibold text-slate-800">
                                                No customers found
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-1 max-w-60">
                                                We couldn't find any matches. Try adjusting your keywords or filters.
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