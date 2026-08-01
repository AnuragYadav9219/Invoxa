import { Receipt, Phone, UserX, ArrowUpRight, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function CustomerCard({ customer, navigate, isMobile, isSearchFallback }) {
    const showFallback = isSearchFallback || !customer || Object.keys(customer).length === 0;

    const pending = !showFallback ? Number(customer.pendingAmount || 0) : 0;
    const total = !showFallback ? Number(customer.totalAmount || 0) : 0;
    const paid = !showFallback ? Number(customer.paidAmount || 0) : 0;
    const isPaid = pending === 0;

    const progressPercent = total > 0 ? Math.min(Math.max((paid / total) * 100, 0), 100) : (isPaid ? 100 : 0);

    if (showFallback) {
        return (
            <div className="p-8 rounded-2xl bg-linear-to-b from-slate-50/80 to-slate-100/50 border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center min-h-55 space-y-4 w-full col-span-full transition-all duration-300 hover:border-slate-300">
                <div className="p-4 rounded-2xl bg-white shadow-sm ring-4 ring-slate-100 text-slate-400 animate-bounce duration-1000">
                    <UserX size={24} />
                </div>
                <div className="space-y-1.5 max-w-xs">
                    <h3 className="text-base font-semibold text-slate-800">No customer found</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        We couldn't find any profile matching your active search filters or parameters.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => navigate?.(`/customers/${encodeURIComponent(customer.name)}`)}
            className={`group cursor-pointer bg-white rounded-2xl border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-6px_rgba(79,70,229,0.12)] hover:border-indigo-100/80 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full ${
                isMobile ? 'p-4' : 'p-6'
            }`}
        >
            {/* Background Ambient Glow on Hover */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 w-full space-y-5">
                
                {/* HEADER SECTION */}
                <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1 min-w-0">
                        <h2 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-indigo-600 transition-colors duration-200 truncate">
                            {customer.name}
                        </h2>
                        {customer.phone ? (
                            <a 
                                href={`tel:${customer.phone}`} 
                                onClick={(e) => e.stopPropagation()} 
                                className="text-xs text-slate-400 hover:text-indigo-600 inline-flex items-center gap-1.5 transition-colors"
                            >
                                <Phone size={12} className="text-slate-300" />
                                <span>{customer.phone}</span>
                            </a>
                        ) : (
                            <p className="text-xs text-slate-300 italic">No phone number</p>
                        )}
                    </div>

                    {/* Modern Status Badge */}
                    <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs shrink-0 select-none transition-transform duration-300 group-hover:scale-105 ${
                            isPaid
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : "bg-amber-50 text-amber-700 border border-amber-200/60"
                        }`}
                    >
                        {isPaid ? <CheckCircle2 size={13} className="text-emerald-500" /> : <ShieldAlert size={13} className="text-amber-500" />}
                        <span>{isPaid ? "Paid" : "Pending"}</span>
                    </div>
                </div>

                {/* FINANCIAL METRICS CONTAINER */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50/80 border border-slate-100/80 text-center group-hover:bg-indigo-50/30 transition-colors duration-300">
                    <div className="space-y-0.5 border-r border-slate-200/60 pr-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 block truncate">
                            ₹{total.toLocaleString()}
                        </span>
                    </div>
                    <div className="space-y-0.5 border-r border-slate-200/60 pr-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Paid</span>
                        <span className="text-xs sm:text-sm font-semibold text-emerald-600 block truncate">
                            ₹{paid.toLocaleString()}
                        </span>
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Balance</span>
                        <span className={`text-xs sm:text-sm font-bold block truncate ${pending > 0 ? "text-rose-600" : "text-slate-400"}`}>
                            ₹{pending.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* MINI PROGRESS BAR */}
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-medium text-slate-400">
                        <span>Settlement Progress</span>
                        <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                                isPaid ? 'bg-emerald-500' : 'bg-linear-to-r from-amber-500 to-rose-500'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* CARD FOOTER */}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        <Receipt size={13} className="text-indigo-500" />
                        <span className="text-slate-600 font-medium">
                            {customer.invoiceCount || 0} <span className="text-slate-400 font-normal">{customer.invoiceCount === 1 ? 'invoice' : 'invoices'}</span>
                        </span>
                    </div>

                    <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1 bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-indigo-100/50">
                        View profile <ArrowUpRight size={14} />
                    </span>
                </div>
            </div>
        </div>
    );
}