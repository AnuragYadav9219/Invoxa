import {
    FiCheckCircle,
    FiClock,
    FiDownload,
    FiFileText,
} from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";

export default function PaymentHistory({
    payments = [],
    loading = false,
}) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-center py-10">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
            <div className="border-b border-slate-200/60 bg-linear-to-r from-indigo-50/70 via-slate-50 to-violet-50/60 px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium tracking-wide text-indigo-600 mb-1.5 border border-indigo-100/80 shadow-2xs">
                            <FiFileText className="h-3 w-3" />
                            <span>Billing</span>
                        </div>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-800">
                            Payment History
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            View and download your past subscription invoices.
                        </p>
                    </div>

                    <span className="inline-flex items-center rounded-full bg-slate-200/70 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {payments.length} {payments.length === 1 ? 'Transaction' : 'Transactions'}
                    </span>
                </div>
            </div>

            {payments.length === 0 ? (
                <div className="py-14 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <FiFileText className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">No payment history found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Your completed transactions will appear here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200/60 bg-slate-50/60 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                                <th className="px-6 py-3.5">Date</th>
                                <th className="px-6 py-3.5">Plan</th>
                                <th className="px-6 py-3.5">Amount</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Invoice</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                            {payments.map((payment) => (
                                <tr
                                    key={payment.id}
                                    className="transition-colors duration-150 hover:bg-slate-50/70"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap">
                                        {payment.paymentDate}
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap">
                                        {payment.planName}
                                    </td>

                                    <td className="px-6 py-4 text-slate-700 whitespace-nowrap">
                                        <div className="inline-flex items-center font-medium">
                                            <FaIndianRupeeSign className="text-xs text-slate-400 mr-0.5" />
                                            <span>{payment.amount}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {payment.status === "SUCCESS" ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 border border-emerald-100">
                                                <FiCheckCircle className="h-3 w-3" />
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600 border border-amber-100">
                                                <FiClock className="h-3 w-3" />
                                                Pending
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-600 active:scale-95">
                                            <FiDownload className="h-3.5 w-3.5" />
                                            <span>Invoice</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}