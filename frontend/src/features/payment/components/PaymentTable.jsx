// src/features/payment/components/PaymentTable.jsx

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

import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

import { usePaymentActions } from "../hooks/usePaymentActions";

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
        return <p className="p-6 text-center">Loading payments...</p>;
    }

    /* ================= EMPTY STATE ================= */
    if (!data.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                <div className="p-4 rounded-2xl bg-white shadow-sm mb-4">
                    <Inbox className="h-8 w-8 text-slate-300" />
                </div>

                <h3 className="text-slate-900 font-bold text-lg">
                    No payments found
                </h3>

                <p className="text-sm text-slate-500 max-w-50 text-center mt-1">
                    Your payment list is empty. Add one to get started.
                </p>
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