import {
    FiCheckCircle,
    FiClock,
    FiFileText,
} from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Eye, Receipt } from "lucide-react";
import { useState } from "react";
import PaymentDetailsDialog from "./PaymentDetailsDialog";

export default function PaymentHistory({
    payments = [],
    loading = false,
}) {
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [open, setOpen] = useState(false);

    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-950 p-6 shadow-xs">
                <div className="flex items-center justify-center py-12">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
            
            {/* Header Section */}
            <div className="border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 text-[11px] font-medium tracking-wide text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                            <FiFileText className="h-3 w-3" />
                            <span>Billing</span>
                        </div>
                        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                            Payment History
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            View and review your past subscription invoices and logs.
                        </p>
                    </div>

                    <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                        {payments.length} {payments.length === 1 ? 'Transaction' : 'Transactions'}
                    </span>
                </div>
            </div>

            {/* Table or Empty State */}
            {payments.length === 0 ? (
                <div className="py-16 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800">
                        <Receipt className="h-5 w-5 text-indigo-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No payment history found</p>
                    <p className="text-xs text-slate-400 mt-1">Your completed transaction logs will appear here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                                <th className="px-6 py-3.5">Date</th>
                                <th className="px-6 py-3.5">Plan</th>
                                <th className="px-6 py-3.5">Amount</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                            {payments.map((payment) => {
                                const isSuccess = payment.status === "SUCCESS";
                                return (
                                    <tr
                                        key={payment.id}
                                        className="transition-colors duration-150 hover:bg-slate-50/70 dark:hover:bg-slate-900/50"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                            {payment.paidAt
                                                ? new Date(payment.paidAt).toLocaleDateString(undefined, {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  })
                                                : "--"}
                                        </td>

                                        <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                            {payment.planName}
                                        </td>

                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                            <div className="inline-flex items-center font-medium">
                                                <FaIndianRupeeSign className="text-xs text-slate-400 mr-0.5" />
                                                <span>{payment.amount}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isSuccess ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                                                    <FiCheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
                                                    <FiClock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => {
                                                    setSelectedPayment(payment);
                                                    setOpen(true);
                                                }}
                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 dark:hover:border-indigo-800 transition-colors"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                <span>View</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <PaymentDetailsDialog
                open={open}
                onOpenChange={setOpen}
                payment={selectedPayment}
            />
        </div>
    );
}