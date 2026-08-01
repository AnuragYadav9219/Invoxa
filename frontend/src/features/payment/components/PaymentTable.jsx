import {
    Table,
    TableBody,
    TableHeader,
    TableHead,
    TableRow,
} from "@/components/ui/table";

import { useNavigate } from "react-router-dom";
import PaymentRow from "./PaymentRow";
import PaymentCard from "./PaymentCard";

import { cn } from "@/lib/utils";

import { usePaymentActions } from "../hooks/usePaymentActions";
import PageLoader from "@/components/loaders/PageLoader";
import { AlertCircle } from "lucide-react";

export default function PaymentTable({
    payments = [],
    isLoading,
    showActions = false,
    limit,
    onEdit,
}) {
    const navigate = useNavigate();

    const { handleDelete } = usePaymentActions();

    const data = limit ? payments.slice(0, limit) : payments;

    /* ================= LOADING ================= */
    if (isLoading) {
        return <PageLoader text="Loading Payment..." />;
    }

    /* ================= EMPTY STATE ================= */
    if (!data.length) {
    return (
        <div className="min-h-[40vh] w-full flex items-center justify-center p-6">
            <div className="bg-slate-50 border border-slate-200/90 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] p-8 w-full max-w-md text-center space-y-4">
                <div className="inline-flex p-3.5 bg-amber-50 border border-amber-100 rounded-2xl text-amber-500 shadow-2xs">
                    <AlertCircle size={32} />
                </div>

                <div className="space-y-1">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Payment Not Found
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        We couldn't find any matching records for your request.
                    </p>
                </div>
            </div>
        </div>
    );
}

    return (
        <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden lg:block bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-b border-slate-100">

                            <TableHead className="pl-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Payment
                            </TableHead>

                            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Customer
                            </TableHead>

                            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Amount
                            </TableHead>

                            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Method
                            </TableHead>

                            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Invoice
                            </TableHead>

                            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Date
                            </TableHead>

                            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Status
                            </TableHead>

                            <TableHead
                                className={cn(
                                    "pr-6 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500",
                                    !showActions && "opacity-0"
                                )}
                            >
                                Actions
                            </TableHead>

                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((p) => (
                            <PaymentRow
                                key={p.id}
                                p={p}
                                navigate={navigate}
                                showActions={showActions}
                                onEdit={onEdit}
                                onDelete={() => handleDelete(p)}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* ================= TABLET GRID ================= */}
            <div className="hidden md:grid lg:hidden grid-cols-2 gap-6">
                {data.map((p) => (
                    <PaymentCard
                        key={p.id}
                        p={p}
                        navigate={navigate}
                        showActions={showActions}
                        onEdit={onEdit}
                        onDelete={() => handleDelete(p)}
                    />
                ))}
            </div>

            {/* ================= MOBILE LIST ================= */}
            <div className="block md:hidden space-y-4">
                {data.map((p) => (
                    <PaymentCard
                        key={p.id}
                        p={p}
                        navigate={navigate}
                        isMobile
                        showActions={showActions}
                        onEdit={onEdit}
                        onDelete={() => handleDelete(p)}
                    />
                ))}
            </div>
        </>
    );
}