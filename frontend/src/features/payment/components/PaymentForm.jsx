import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CreditCard } from "lucide-react";

import { useGetInvoicesQuery } from "@/features/invoice/invoiceApi";
import { formatCurrency } from "@/utils/formatters";

import usePaymentForm from "../hooks/usePaymentForm";

export default function PaymentForm({ open, setOpen, payment = null }) {
    const { data, isLoading } = useGetInvoicesQuery({ page: 0, size: 50 });

    const invoices = data?.content || [];

    /* ================= USE CUSTOM HOOK ================= */
    const {
        form,
        setForm,
        selectedInvoice,
        handleInvoiceChange,
        allowedAmount,
        isValid,
        handleSubmit,
        isEditMode,
        isCreating,
        isUpdating,
    } = usePaymentForm(payment, open, setOpen, invoices);

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
            }}
        >
            <DialogContent className="max-w-lg p-0 bg-white">
                {/* HEADER */}
                <div className="px-6 py-4 border-b">
                    <DialogTitle className="font-bold">
                        {isEditMode ? "Edit Payment" : "Add Payment"}
                    </DialogTitle>
                    <p className="text-xs text-gray-400">
                        {isEditMode ? "Update transaction" : "New transaction"}
                    </p>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-5">
                    {/* INVOICE FIELD */}
                    {isEditMode ? (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">
                                Invoice
                            </label>

                            <div className="border rounded-lg px-3 py-2 bg-gray-50 text-sm">
                                {selectedInvoice
                                    ? `#${selectedInvoice.invoiceNumber} — ${selectedInvoice.customerName}`
                                    : "Loading..."}
                            </div>

                            {selectedInvoice && (
                                <p className="text-xs text-gray-500">
                                    Remaining:{" "}
                                    <span className="font-semibold">
                                        {formatCurrency(selectedInvoice.remainingAmount)}
                                    </span>
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">
                                Select Invoice
                            </label>

                            {!isLoading && (
                                <Select
                                    value={form.invoiceId ? String(form.invoiceId) : ""}
                                    onValueChange={handleInvoiceChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select invoice" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {invoices.map((inv) => (
                                            <SelectItem key={inv.id} value={String(inv.id)}>
                                                #{inv.invoiceNumber} — {inv.customerName} (
                                                {formatCurrency(inv.remainingAmount)})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}

                    {/* AMOUNT */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">
                            Amount
                        </label>

                        <Input
                            type="number"
                            placeholder="Enter amount"
                            value={form.amount}
                            onChange={(e) =>
                                setForm({ ...form, amount: e.target.value })
                            }
                        />

                        {selectedInvoice && Number(form.amount) > allowedAmount && (
                            <p className="text-xs text-red-500">
                                Amount exceeds allowed limit ({formatCurrency(allowedAmount)})
                            </p>
                        )}
                    </div>

                    {/* METHOD */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">
                            Payment Method
                        </label>

                        <div className="grid grid-cols-4 gap-2">
                            {["CASH", "UPI", "CARD", "BANK"].map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setForm({ ...form, method })}
                                    className={`border cursor-pointer rounded-lg py-2 text-sm font-semibold transition ${form.method === method
                                            ? "bg-black text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* REFERENCE */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">
                            Reference Number
                        </label>

                        <Input
                            placeholder="Txn ID / Ref no"
                            value={form.referenceNumber}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    referenceNumber: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t">
                    <Button
                        onClick={handleSubmit}
                        disabled={!isValid || isCreating || isUpdating}
                        className="w-full h-11 text-base font-semibold bg-black text-white"
                    >
                        <CreditCard size={16} className="mr-2" />
                        {isEditMode
                            ? isUpdating
                                ? "Updating..."
                                : "Update Payment"
                            : isCreating
                                ? "Processing..."
                                : "Save Payment"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}