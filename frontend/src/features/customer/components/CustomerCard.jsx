import { Receipt, Phone, UserX, ArrowRight } from "lucide-react";

export default function CustomerCard({ customer, navigate, isMobile, isSearchFallback }) {
    const showFallback = isSearchFallback || !customer || Object.keys(customer).length === 0;

    const pending = !showFallback ? Number(customer.pendingAmount || 0) : 0;
    const isPaid = pending === 0;

    return (
        showFallback ? (
            <div className="p-6 rounded-xl bg-slate-50/50 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center min-h-46.25 space-y-3 w-full col-span-full">
                <div className="p-3 rounded-full bg-slate-100 text-slate-400">
                    <UserX size={20} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-medium text-slate-700">No profile details</h3>
                    <p className="text-xs text-slate-400 max-w-55 mx-auto">
                        No customer matches found for your current search filters.
                    </p>
                </div>
            </div>
        ) : (
            <div
                onClick={() => navigate?.(`/customers/${encodeURIComponent(customer.name)}`)}
                className="group cursor-pointer p-5 rounded-xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-200/80 transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-full"
            >
                {/* Background Ambient Glow on Hover */}
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-linear-to-br from-indigo-50 to-pink-50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10 w-full space-y-4">
                    {/* HEADER SECTION */}
                    <div className="flex justify-between items-start gap-3">
                        <div className="space-y-0.5">
                            <h2 className="font-semibold text-slate-800 text-base tracking-tight group-hover:text-indigo-600 transition-colors duration-200">
                                {customer.name}
                            </h2>
                            {customer.phone && (
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <Phone size={11} className="text-slate-300" />
                                    {customer.phone}
                                </p>
                            )}
                        </div>

                        {/* Status Badge */}
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ring-4 ring-slate-50/20 shrink-0 select-none ${isPaid
                                    ? "bg-emerald-50/60 text-emerald-700 border-emerald-100"
                                    : "bg-amber-50/60 text-amber-700 border-amber-100"
                                }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {isPaid ? "Paid" : "Pending"}
                        </span>
                    </div>

                    {/* FINANCIAL STATS GRID */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50/60 border border-slate-100 text-center">
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-0.5">Total</p>
                            <p className="text-sm font-bold text-slate-800">
                                ₹{Number(customer.totalAmount || 0).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-0.5">Paid</p>
                            <p className="text-sm font-semibold text-emerald-600">
                                ₹{Number(customer.paidAmount || 0).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-0.5">Balance</p>
                            <p className={`text-sm font-semibold ${pending > 0 ? "text-rose-600" : "text-slate-400"}`}>
                                ₹{pending.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* CARD FOOTER */}
                    <div className="pt-2 border-t border-slate-100/80 flex justify-between items-center text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Receipt size={13} className="text-slate-300" />
                            <span>
                                <strong className="font-medium text-slate-600">{customer.invoiceCount || 0}</strong> {customer.invoiceCount === 1 ? 'invoice' : 'invoices'}
                            </span>
                        </div>

                        <span className="text-[11px] font-medium text-indigo-500 group-hover:translate-x-1 transition-all duration-200 flex items-center gap-0.5">
                            Details <ArrowRight size={12} />
                        </span>
                    </div>
                </div>
            </div>
        )
    );
}