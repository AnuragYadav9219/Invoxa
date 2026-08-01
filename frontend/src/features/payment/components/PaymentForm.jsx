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

import { CreditCard, Wallet, Smartphone, Landmark, ReceiptText, AlertCircle } from "lucide-react";

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

    const methodIcons = {
        CASH: Wallet,
        UPI: Smartphone,
        CARD: CreditCard,
        BANK: Landmark,
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
            }}
        >
            <DialogContent className="max-w-[100vw] sm:max-w-lg p-0 bg-slate-50 flex flex-col h-dvh sm:h-auto rounded-none sm:rounded-3xl border-0 sm:border border-slate-200/80 shadow-2xl overflow-hidden">
                
                {/* HEADER */}
                <div className="px-6 py-5 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            <DialogTitle className="font-bold text-slate-900 text-lg tracking-tight">
                                {isEditMode ? "Edit Payment Record" : "Record New Payment"}
                            </DialogTitle>
                        </div>
                        <p className="text-xs text-slate-400 font-medium pl-4">
                            {isEditMode ? "Modify transaction details" : "Log a fresh incoming financial transaction"}
                        </p>
                    </div>
                </div>

                {/* BODY CONTAINER */}
                <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto sm:max-h-[75vh]">
                    
                    {/* INVOICE FIELD CARD */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                        {isEditMode ? (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Linked Invoice Record
                                </label>

                                <div className="border border-slate-200/80 rounded-xl px-3.5 py-2.5 bg-slate-50 text-sm font-semibold text-slate-800 flex items-center gap-2">
                                    <ReceiptText size={16} className="text-indigo-600 shrink-0" />
                                    <span className="truncate">
                                        {selectedInvoice
                                            ? `#${selectedInvoice.invoiceNumber} — ${selectedInvoice.customerName}`
                                            : "Loading invoice data..."}
                                    </span>
                                </div>

                                {selectedInvoice && (
                                    <div className="flex justify-between items-center text-xs pt-1 px-1">
                                        <span className="text-slate-400 font-medium">Allowed Balance Limit</span>
                                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                            {formatCurrency(selectedInvoice.remainingAmount)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Select Target Invoice <span className="text-rose-500">*</span>
                                </label>

                                {!isLoading && (
                                    <Select
                                        value={form.invoiceId ? String(form.invoiceId) : ""}
                                        onValueChange={handleInvoiceChange}
                                    >
                                        <SelectTrigger className="w-full h-11 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium focus:ring-2 focus:ring-indigo-500">
                                            <SelectValue placeholder="Choose matching invoice..." />
                                        </SelectTrigger>

                                        <SelectContent className="rounded-2xl shadow-xl border-slate-100 p-1">
                                            {invoices.map((inv) => (
                                                <SelectItem key={inv.id} value={String(inv.id)} className="rounded-xl px-3 py-2.5 text-xs font-semibold cursor-pointer hover:bg-indigo-50/80">
                                                    <div className="flex justify-between items-center w-full gap-4">
                                                        <span>#{inv.invoiceNumber} — {inv.customerName}</span>
                                                        <span className="text-emerald-600 font-bold">{formatCurrency(inv.remainingAmount)}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        )}
                    </div>

                    {/* AMOUNT & METHOD CONTAINER */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                        
                        {/* AMOUNT */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Payment Amount (₹) <span className="text-rose-500">*</span>
                            </label>

                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={form.amount}
                                    onChange={(e) =>
                                        setForm({ ...form, amount: e.target.value })
                                    }
                                    className="pl-8 h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm font-bold bg-slate-50/50"
                                />
                            </div>

                            {selectedInvoice && Number(form.amount) > allowedAmount && (
                                <p className="text-xs text-rose-500 font-semibold flex items-center gap-1 pt-1">
                                    <AlertCircle size={13} />
                                    Amount exceeds allowed limit ({formatCurrency(allowedAmount)})
                                </p>
                            )}
                        </div>

                        {/* METHOD */}
                        <div className="space-y-2 pt-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Payment Mode <span className="text-rose-500">*</span>
                            </label>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {["CASH", "UPI", "CARD", "BANK"].map((method) => {
                                    const IconComponent = methodIcons[method] || CreditCard;
                                    const isSelected = form.method === method;

                                    return (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setForm({ ...form, method })}
                                            className={`border cursor-pointer rounded-xl py-2.5 px-3 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow-2xs active:scale-95 ${
                                                isSelected
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                                                    : "bg-slate-50/50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                            }`}
                                        >
                                            <IconComponent size={16} className={isSelected ? "text-white" : "text-indigo-600"} />
                                            <span>{method}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* REFERENCE */}
                        <div className="space-y-1.5 pt-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Reference Number / Transaction ID
                            </label>

                            <Input
                                placeholder="e.g. UPI/Ref/Txn number..."
                                value={form.referenceNumber}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        referenceNumber: e.target.value,
                                    })
                                }
                                className="h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm bg-slate-50/50"
                            />
                        </div>

                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-4 sm:p-5 bg-white border-t border-slate-100 shrink-0">
                    <Button
                        onClick={handleSubmit}
                        disabled={!isValid || isCreating || isUpdating}
                        className="w-full h-12 text-sm font-bold bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl shadow-lg shadow-emerald-500/25 cursor-pointer disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        {(isCreating || isUpdating) && (
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        )}
                        <CreditCard size={16} />
                        {isEditMode
                            ? (isUpdating ? "Updating Record..." : "Save Payment Changes")
                            : (isCreating ? "Processing Transaction..." : "Save & Complete Payment")}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}