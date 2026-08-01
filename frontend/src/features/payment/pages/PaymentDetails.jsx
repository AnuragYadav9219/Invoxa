import { useParams, useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    Calendar,
    User,
    Store,
    Copy,
    Banknote,
    Smartphone,
    Landmark,
    ArrowLeft,
    Check,
} from "lucide-react";

import { useGetPaymentByIdQuery } from "@/features/payment/paymentApi";
import PageLoader from "@/components/loaders/PageLoader";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useSelector } from "react-redux";
import { EmptyState } from "@/components/errorWrapper/components";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PaymentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: payment, isLoading } = useGetPaymentByIdQuery(id);
    const user = useSelector((state) => state.auth.user);
    const [copied, setCopied] = useState(false);

    if (isLoading) {
        return <PageLoader text="Loading Payment Details..." />;
    }

    if (!payment) {
        return (
            <EmptyState
                title="Payment Not Found"
                description="The payment you're looking for doesn't exist or may have been deleted."
                actionLabel="Back to Payments"
                onAction={() => navigate("/payments")}
                showHome={false}
            />
        );
    }

    /* ================= METHOD ICON ================= */
    const getMethodConfig = (method) => {
        switch (method) {
            case "CASH":
                return { icon: Banknote, label: "Cash Payment", bg: "bg-emerald-50 text-emerald-600 border-emerald-100" };
            case "UPI":
                return { icon: Smartphone, label: "UPI Transfer", bg: "bg-indigo-50 text-indigo-600 border-indigo-100" };
            case "BANK":
                return { icon: Landmark, label: "Bank Transfer", bg: "bg-blue-50 text-blue-600 border-blue-100" };
            default:
                return { icon: Banknote, label: method || "Cash Payment", bg: "bg-slate-50 text-slate-600 border-slate-100" };
        }
    };

    const methodConfig = getMethodConfig(payment.method);
    const MethodIcon = methodConfig.icon;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-[90vh] w-full bg-slate-100/70 flex flex-col justify-center items-center py-4">

            {/* MAIN WRAPPER CARD */}
            <div className="w-full max-w-lg bg-slate-50 border border-slate-200/90 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] p-2 pt-4 sm:p-8 space-y-3 relative overflow-hidden">

                {/* DECORATIVE TOP ACCENT */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-emerald-500 via-teal-500 to-indigo-600" />

                {/* BACK NAVIGATION */}
                <div className="flex items-center justify-between pb-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/payments", { replace: true })}
                        className="cursor-pointer text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl px-2.5 h-9 -ml-2 text-xs font-semibold gap-1.5 transition-all"
                    >
                        <ArrowLeft size={15} />
                        <span>Back to Ledger</span>
                    </Button>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        Verified Receipt
                    </span>
                </div>

                {/* HERO AMOUNT HEADER */}
                <div className="rounded-2xl p-6 text-center space-y-3 bg-white border border-slate-200/70 shadow-2xs">
                    <div className="flex justify-center">
                        <div className="bg-emerald-100 p-3.5 rounded-2xl shadow-sm ring-8 ring-emerald-50">
                            <CheckCircle2 className="text-emerald-600" size={32} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Amount Received</p>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            {formatCurrency(payment.amount)}
                        </h1>
                    </div>

                    <div className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5 pt-1">
                        <Calendar size={13} className="text-slate-400" />
                        <span>Transaction Date: <strong className="text-slate-700">{formatDate(payment.paymentDate)}</strong></span>
                    </div>
                </div>

                {/* FROM → TO BREAKDOWN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {/* RECEIVED FROM */}
                    <div className="bg-white rounded-2xl p-4 space-y-2 border border-slate-200/70 shadow-2xs">
                        <div className="flex items-center gap-2">
                            <div className="bg-slate-100 p-2 rounded-xl border border-slate-200/60 text-slate-600 shadow-2xs">
                                <User size={15} />
                            </div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                Received From
                            </p>
                        </div>
                        <p className="text-sm font-bold text-slate-800 truncate pl-1">
                            {payment.customerName}
                        </p>
                    </div>

                    {/* RECEIVED BY */}
                    <div className="bg-white rounded-2xl p-4 space-y-2 border border-slate-200/70 shadow-2xs">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100 text-indigo-600 shadow-2xs">
                                <Store size={15} />
                            </div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                Received By
                            </p>
                        </div>
                        <p className="text-sm font-bold text-slate-800 truncate pl-1">
                            {user?.shopName || "Your Shop"}
                        </p>
                    </div>

                </div>

                {/* METHOD DETAILS BANNER */}
                <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-200/70 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl border ${methodConfig.bg} shadow-2xs`}>
                            <MethodIcon size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">
                                {methodConfig.label}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                                Mode of payment transaction
                            </p>
                        </div>
                    </div>

                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-xl border border-emerald-200/60">
                        Success
                    </span>
                </div>

                {/* TRANSACTION DETAILS LIST */}
                <div className="bg-white rounded-2xl p-4 space-y-3.5 border border-slate-200/70 shadow-2xs text-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                        Ledger Meta Data
                    </p>

                    {/* TRANSACTION ID */}
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium text-xs">Transaction ID</span>
                        <div className="flex items-center gap-2 bg-slate-100/80 px-2.5 py-1 rounded-xl border border-slate-200/80 shadow-2xs">
                            <span className="font-mono text-xs font-bold text-slate-800">
                                #{payment.id?.slice(-8)}
                            </span>
                            <button
                                type="button"
                                onClick={() => copyToClipboard(payment.id)}
                                className="cursor-pointer text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Copy Full ID"
                            >
                                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            </button>
                        </div>
                    </div>

                    {/* INVOICE REF */}
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium text-xs">Linked Invoice</span>
                        <span className="font-bold text-indigo-600 text-xs bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100">
                            #{payment.invoiceNumber}
                        </span>
                    </div>

                    {/* REFERENCE NUMBER */}
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium text-xs">External Reference</span>
                        <span className="font-semibold text-slate-700 text-xs">
                            {payment.referenceNumber || "N/A"}
                        </span>
                    </div>

                    {/* REMAINING BALANCE */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="text-slate-600 font-bold text-xs">Remaining Balance Due</span>
                        <span className="font-extrabold text-rose-600 text-sm bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-100">
                            {formatCurrency(payment.remainingAmount)}
                        </span>
                    </div>
                </div>

                {/* ACTION BUTTON */}
                <Button
                    onClick={() => navigate("/payments", { replace: true })}
                    className="w-full h-12 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 cursor-pointer transition-all duration-300 text-sm"
                >
                    Done & Return to Ledger
                </Button>

                {/* FOOTER */}
                <p className="text-center text-[11px] text-slate-400 font-medium pt-1">
                    Secured Billing & Payment Record Ledger 🔒
                </p>

            </div>
        </div>
    );
}