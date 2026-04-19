import { CheckCircle2, AlertCircle, Wallet, Receipt } from "lucide-react";

export default function CustomerCard({ customer, navigate, isMobile }) {
    const pending = Number(customer.pendingAmount || 0);
    const isPaid = pending === 0;

    return (
        <div
            onClick={() =>
                navigate(`/customers/${encodeURIComponent(customer.name)}`)
            }
            className="group cursor-pointer p-4 md:p-5 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden"
        >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-linear-to-r from-indigo-100 to-purple-100 opacity-0 group-hover:opacity-40 transition"></div>

            <div className="relative z-10">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                            {customer.name}
                        </h2>
                        <p className="text-xs text-slate-400">{customer.phone}</p>
                    </div>

                    <div className="text-right">
                        <p className="text-emerald-600 font-bold">
                            ₹{Number(customer.totalAmount).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                            <Wallet size={12} /> Total
                        </p>
                    </div>
                </div>

                {/* STATS */}
                <div className="mt-3 flex justify-between text-xs">

                    <span className="flex items-center gap-1 text-blue-600 font-medium">
                        <CheckCircle2 size={12} />
                        ₹{Number(customer.paidAmount || 0).toLocaleString()}
                    </span>

                    <span
                        className={`flex items-center gap-1 font-medium ${pending > 0 ? "text-rose-600" : "text-slate-400"
                            }`}
                    >
                        <AlertCircle size={12} />
                        ₹{pending.toLocaleString()}
                    </span>
                </div>

                {/* FOOTER */}
                <div className="mt-3 flex justify-between items-center text-xs">

                    <span className="flex items-center gap-1 text-slate-400">
                        <Receipt size={12} />
                        {customer.invoiceCount}
                    </span>

                    <span
                        className={`flex items-center gap-1 px-2 py-1 rounded-full font-medium ${isPaid
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-rose-100 text-rose-600"
                            }`}
                    >
                        {isPaid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {isPaid ? "Paid" : "Pending"}
                    </span>
                </div>

            </div>
        </div>
    );
}