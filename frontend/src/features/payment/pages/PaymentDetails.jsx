import { useParams, useNavigate } from "react-router-dom";
import {
    CheckCircle,
    Calendar,
    User,
    Store,
    Copy,
    Banknote,
    Smartphone,
    Landmark,
} from "lucide-react";

import { useGetPaymentByIdQuery } from "@/features/payment/paymentApi";
import PageLoader from "@/components/loaders/PageLoader";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useSelector } from "react-redux";

export default function PaymentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: payment, isLoading, error } = useGetPaymentByIdQuery(id);
    const user = useSelector((state) => state.auth.user);

    if (isLoading) return <PageLoader />;

    if (error || !payment) {
        return (
            <div className="p-10 text-center text-gray-500">
                Payment not found
            </div>
        );
    }

    /* ================= METHOD ICON ================= */
    const getMethodIcon = (method) => {
        switch (method) {
            case "CASH":
                return <Banknote size={20} />;
            case "UPI":
                return <Smartphone size={20} />;
            case "BANK":
                return <Landmark size={20} />;
            default:
                return <Banknote size={20} />;
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-gray-100 via-gray-50 to-gray-200 flex justify-center items-start py-8 px-4">

            {/* MAIN WRAPPER */}
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-5 space-y-5">

                {/* SUCCESS */}
                <div className="rounded-3xl p-6 text-center space-y-3 bg-gray-50">
                    <div className="flex justify-center">
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle className="text-green-600" size={28} />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                        {formatCurrency(payment.amount)}
                    </h1>

                    <p className="text-sm text-gray-500 font-medium">
                        Payment Received
                    </p>

                    <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
                        <Calendar size={12} />
                        {formatDate(payment.paymentDate)}
                    </div>
                </div>

                {/* FROM → TO */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border border-gray-100">

                    {/* FROM */}
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-full border">
                            <User size={16} />
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 uppercase">
                                Received From
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                                {payment.customerName}
                            </p>
                        </div>
                    </div>

                    {/* TO */}
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-full border">
                            <Store size={16} />
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 uppercase">
                                Received By
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                                {user?.shopName || "Your Shop"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* METHOD */}
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">

                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg border">
                            {getMethodIcon(payment.method)}
                        </div>

                        <div>
                            <p className="text-sm font-semibold">
                                {payment.method}
                            </p>
                            <p className="text-xs text-gray-500">
                                Payment Method
                            </p>
                        </div>
                    </div>

                    <span className="text-xs text-green-600 font-medium">
                        Completed
                    </span>
                </div>

                {/* DETAILS */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border border-gray-100">

                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Transaction Details
                    </p>

                    {/* ID */}
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Transaction ID</span>

                        <div className="flex items-center gap-2">
                            <span className="font-medium">
                                {payment.id?.slice(-8)}
                            </span>
                            <Copy
                                size={14}
                                className="cursor-pointer text-gray-400 hover:text-black"
                                onClick={() => copyToClipboard(payment.id)}
                            />
                        </div>
                    </div>

                    {/* Invoice */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Invoice</span>
                        <span className="font-medium">
                            #{payment.invoiceNumber}
                        </span>
                    </div>

                    {/* Reference */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Reference</span>
                        <span className="font-medium">
                            {payment.referenceNumber || "N/A"}
                        </span>
                    </div>

                    {/* Remaining */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Remaining</span>
                        <span className="font-semibold text-red-500">
                            {formatCurrency(payment.remainingAmount)}
                        </span>
                    </div>
                </div>

                {/* BUTTON */}
                <button
                    onClick={() => navigate("/payments", { replace: true })}
                    className="w-full bg-black text-white py-3 cursor-pointer rounded-2xl font-semibold hover:bg-gray-900 transition active:scale-[0.98]"
                >
                    Done
                </button>

                {/* FOOTER */}
                <p className="text-center text-xs text-gray-400">
                    Secured • Fast • Reliable 🔒
                </p>

            </div>
        </div>
    );
}