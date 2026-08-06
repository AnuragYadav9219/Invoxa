import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    CheckCircle2,
    Clock3,
    CreditCard,
    Copy,
    Receipt,
    Calendar,
    Globe,
    ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

export default function PaymentDetailsDialog({
    open,
    onOpenChange,
    payment,
}) {
    if (!payment) return null;

    const copy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const isSuccess = payment.status === "SUCCESS";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg p-6">

                {/* Header */}
                <DialogHeader className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                Payment Details
                            </DialogTitle>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                View transaction receipts and subscription metadata
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 pt-4">

                    {/* Status & Date Banner */}
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200/60 dark:border-slate-800">
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Status
                            </span>
                            <div>
                                <Badge
                                    variant="outline"
                                    className={`px-2.5 py-0.5 font-medium border-0 ${isSuccess
                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                                        }`}
                                >
                                    {isSuccess ? (
                                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <Clock3 className="mr-1.5 h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                    )}
                                    {payment.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-1 text-right">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-end gap-1">
                                <Calendar className="h-3 w-3" /> Paid At
                            </span>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {payment.paidAt
                                    ? new Date(payment.paidAt).toLocaleString(undefined, {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })
                                    : "--"}
                            </p>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <InfoCard
                            icon={Receipt}
                            label="Plan Name"
                            value={payment.planName}
                        />
                        <InfoCard
                            icon={CreditCard}
                            label="Amount Paid"
                            value={`₹${payment.amount}`}
                            highlight
                        />
                        <InfoCard
                            icon={ShieldCheck}
                            label="Gateway"
                            value={payment.gateway}
                        />
                        <InfoCard
                            icon={Globe}
                            label="Currency"
                            value={payment.currency}
                        />
                    </div>

                    {/* Transaction ID Copy Field */}
                    <CopyField
                        title="Transaction Reference ID"
                        value={payment.transactionId}
                        onCopy={copy}
                    />

                    {/* Footer Actions */}
                    <div className="flex justify-end pt-2">
                        <Button
                            variant="default"
                            className="bg-slate-900 cursor-pointer text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    );
}

function InfoCard({ icon: Icon, label, value, highlight = false }) {
    return (
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 bg-white dark:bg-slate-950 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span className="text-xs font-medium uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <p className={`text-sm font-semibold truncate ${highlight ? "text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-200"}`}>
                {value || "--"}
            </p>
        </div>
    );
}

function CopyField({ title, value, onCopy }) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 bg-white dark:bg-slate-950">
            <div className="overflow-hidden pr-2">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    {title}
                </p>
                <p className="truncate font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">
                    {value || "--"}
                </p>
            </div>

            {value && (
                <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 p-1 shrink-0 border-slate-200 cursor-pointer dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
                    onClick={() => onCopy(value)}
                    title="Copy to clipboard"
                >
                    <Copy className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                </Button>
            )}
        </div>
    );
}