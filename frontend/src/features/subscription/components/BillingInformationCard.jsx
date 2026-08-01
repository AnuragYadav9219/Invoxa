import {
    CreditCard,
    Wallet,
    CalendarDays,
    BadgeCheck,
    Hash,
    Sparkles,
} from "lucide-react";

import PageLoader from "@/components/loaders/PageLoader";
import { Button } from "@/components/ui/button";
import { useGetBillingInformationQuery } from "../subscriptionApi";

export default function BillingInformationCard() {
    const { data, isLoading } = useGetBillingInformationQuery();

    if (isLoading) {
        return <PageLoader text="Loading billing information..." />;
    }

    const isFreePlan =
        !data?.paymentProvider &&
        !data?.paymentDisplayName &&
        !data?.razorpayPaymentId;

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:shadow-md">
            {/* Header Section with subtle background matching your ecosystem */}
            <div className="border-b border-slate-200/60 bg-linear-to-r from-indigo-50/50 via-slate-50 to-violet-50/40 px-6 py-5">
                <h2 className="text-xl font-semibold tracking-tight text-slate-800">
                    Billing Information
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                    Current billing details and payment methods for your subscription.
                </p>
            </div>

            <div className="p-6">
                {isFreePlan ? (
                    <div className="flex flex-col items-center rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 px-6 py-10 text-center">
                        <div className="mb-4 rounded-full bg-indigo-100/80 p-3.5 text-indigo-600 shadow-2xs">
                            <Sparkles className="h-6 w-6" />
                        </div>

                        <h3 className="text-base font-semibold text-slate-900">
                            You're on the Free Plan
                        </h3>

                        <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
                            Billing details, payment providers, and automated renewal metrics will appear here once you subscribe to a paid tier.
                        </p>

                        <Button
                            onClick={() => {
                                document.getElementById("upgrade-plan")?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                });
                            }}
                            className="mt-5 rounded-xl cursor-pointer bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-200 hover:bg-indigo-700 active:scale-98">
                            Upgrade Plan
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <InfoRow
                            icon={<Wallet className="h-4 w-4" />}
                            label="Payment Provider"
                            value={data.paymentProvider}
                        />

                        <InfoRow
                            icon={<CreditCard className="h-4 w-4" />}
                            label="Payment Method"
                            value={data.paymentDisplayName}
                        />

                        <InfoRow
                            icon={<Hash className="h-4 w-4" />}
                            label="Payment ID"
                            value={data.razorpayPaymentId}
                        />

                        <InfoRow
                            icon={<CalendarDays className="h-4 w-4" />}
                            label="Next Billing"
                            value={data.nextBillingDate}
                        />

                        <InfoRow
                            icon={<BadgeCheck className="h-4 w-4" />}
                            label="Auto Renewal"
                            value={
                                data.autoRenew ? (
                                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 border border-emerald-100">
                                        Enabled
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200">
                                        Disabled
                                    </span>
                                )
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-slate-50/80">
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 border border-indigo-100/80">
                    {icon}
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-600">
                    {label}
                </span>
            </div>

            <div className="max-w-56 truncate text-xs sm:text-sm font-semibold text-slate-900">
                {value}
            </div>
        </div>
    );
}