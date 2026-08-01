import {
    FiUsers,
    FiFileText,
    FiPackage,
    FiLayers,
    FiZap,
    FiAlertTriangle,
} from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

export default function SubscriptionOverviewCard({ currentPlan }) {
    if (!currentPlan) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                </div>
            </div>
        );
    }

    const usage = [
        {
            label: "Invoices",
            used: currentPlan.invoiceUsed ?? 0,
            limit: currentPlan.invoiceLimit,
            icon: <FiFileText className="h-4 w-4" />,
        },
        {
            label: "Customers",
            used: currentPlan.customerUsed ?? 0,
            limit: currentPlan.customerLimit,
            icon: <FiUsers className="h-4 w-4" />,
        },
        {
            label: "Items",
            used: currentPlan.itemUsed ?? 0,
            limit: currentPlan.itemLimit,
            icon: <FiPackage className="h-4 w-4" />,
        },
        {
            label: "Users",
            used: currentPlan.userUsed ?? 1,
            limit: currentPlan.userLimit,
            icon: <FiLayers className="h-4 w-4" />,
        },
    ];

    const getPercentage = (used, limit) => {
        if (limit === -1) return 0;
        return Math.min((used / limit) * 100, 100);
    };

    // Check if any metric is at or above 90% utilization to trigger a general warning banner
    const hasHighUsage = usage.some(
        (item) => item.limit !== -1 && getPercentage(item.used, item.limit) >= 90
    );

    return (
        <div className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:shadow-md">
            {/* Header / Plan Information */}
            <div className="relative overflow-hidden bg-linear-to-r from-indigo-50/70 via-slate-50 to-violet-50/60 px-6 py-5 border-b border-slate-200/60">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium tracking-wide text-indigo-600 mb-1.5 border border-indigo-100/80 shadow-2xs">
                            <FiZap className="h-3 w-3" />
                            <span>Active Plan</span>
                        </div>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-800">
                            {currentPlan.planName}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage your active subscription and track resource consumption.
                        </p>
                    </div>

                    <div className="flex items-baseline gap-0.5 text-slate-900 shrink-0">
                        <FaIndianRupeeSign className="text-sm font-medium text-slate-500" />
                        <span className="text-2xl font-bold tracking-tight">
                            {currentPlan.monthlyPrice}
                        </span>
                        <span className="text-xs font-normal text-slate-500 ml-0.5">
                            /mo
                        </span>
                    </div>
                </div>
            </div>

            {/* Usage Metrics Section */}
            <div className="grid gap-3.5 p-6 sm:grid-cols-2 bg-white">
                {usage.map((item) => {
                    const percent = getPercentage(item.used, item.limit);
                    const isUnlimited = item.limit === -1;
                    const isDanger = !isUnlimited && percent >= 90;

                    return (
                        <div
                            key={item.label}
                            className={`group/card rounded-xl border p-3.5 transition-all duration-200 ${isDanger
                                ? "border-red-200 bg-red-50/20"
                                : "border-slate-200/70 bg-white hover:border-indigo-300 hover:shadow-xs"
                                }`}
                        >
                            <div className="mb-2.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`rounded-lg p-1.5 transition-transform duration-200 group-hover/card:scale-105 ${isDanger
                                            ? "bg-red-50 text-red-600 border border-red-100"
                                            : "bg-indigo-50 text-indigo-600"
                                            }`}
                                    >
                                        {item.icon}
                                    </div>
                                    <span className="text-xs font-medium text-slate-700">
                                        {item.label}
                                    </span>
                                </div>

                                {isUnlimited ? (
                                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 border border-emerald-100">
                                        {item.used} / Unlimited
                                    </span>
                                ) : (
                                    <span className="text-xs font-medium text-slate-500">
                                        <strong className="text-slate-800 font-semibold">
                                            {item.used}
                                        </strong>{" "}
                                        / {item.limit}
                                    </span>
                                )}
                            </div>

                            {!isUnlimited && (
                                <div className="space-y-1">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ease-out ${isDanger ? "bg-red-500 animate-pulse" : "bg-indigo-600"
                                                }`}
                                            style={{
                                                width: `${percent}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <span
                                            className={`text-[10px] font-medium ${isDanger ? "text-red-500" : "text-slate-400"
                                                }`}
                                        >
                                            {Math.round(percent)}% used
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Warning Banner (Conditionally rendered if any quota reaches 90%) */}
            {hasHighUsage && (
                <div className="mx-6 mb-6 rounded-xl border border-red-200/70 bg-red-50/50 p-4 transition-all duration-200">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-red-100/80 p-2 text-red-600 shrink-0">
                            <FiAlertTriangle className="h-4 w-4" />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xs sm:text-sm font-semibold text-red-800">
                                Approaching resource limits
                            </h3>

                            <p className="mt-0.5 text-xs text-red-600">
                                One or more of your quotas have exceeded 90%. Consider upgrading your plan to prevent service interruptions.
                            </p>

                            <Button
                                onClick={() => {
                                    document.getElementById("upgrade-plan")?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                                }}
                                className="mt-3 cursor-pointer inline-flex items-center rounded-xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-200 hover:bg-red-700 active:scale-98"
                            >
                                Upgrade Plan
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}