import { motion } from "framer-motion";
import { FiArrowRight, FiCheck, FiShield, FiZap } from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";

export default function PlanCard({
    plan,
    current,
    isDowngrade,
    checkoutLoading,
    loadingPlanId,
    onUpgrade,
}) {
    const isPopular = plan.name?.toUpperCase() === "PRO";

    const isLoading = checkoutLoading && loadingPlanId === plan.id;

    const formatLimit = (value) => (value === -1 ? "Unlimited" : value);

    const features = [
        `${formatLimit(plan.invoiceLimit)} Invoices`,
        `${formatLimit(plan.customerLimit)} Customers`,
        `${formatLimit(plan.itemLimit)} Items`,
        `${formatLimit(plan.userLimit)} Team Members`,
        ...(plan.emailEnabled ? ["Email Notifications"] : []),
        ...(plan.apiEnabled ? ["Developer API"] : []),
        ...(plan.aiEnabled ? ["AI Assistant"] : []),
        ...(plan.customTemplates ? ["Custom Templates"] : []),
    ];

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative flex flex-col rounded-2xl border transition-all duration-300 ${isPopular
                ? "border-indigo-300 bg-linear-to-b from-indigo-50/40 via-white to-white shadow-md shadow-indigo-100"
                : "border-slate-200/90 bg-white shadow-xs hover:border-slate-300 hover:shadow-sm"
                } p-6 sm:p-7`}
        >
            {/* Most Popular Badge */}
            {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold tracking-wide text-white shadow-xs">
                    <FiZap className="h-3 w-3" />
                    <span>Most Popular</span>
                </div>
            )}

            {/* Current Plan Badge */}
            {current && (
                <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-200/60 shadow-2xs">
                    <FiShield className="h-3.5 w-3.5" />
                    <span>Current Plan</span>
                </div>
            )}

            {/* Plan Header */}
            <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-800">
                    {plan.name}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 line-clamp-2 min-h-9">
                    {plan.description}
                </p>
            </div>

            {/* Pricing Section */}
            <div className="mt-6 flex items-baseline gap-0.5 text-slate-900">
                <FaIndianRupeeSign className="text-base text-slate-500 mb-0.5" />
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    {plan.monthlyPrice}
                </span>
                <span className="text-xs text-slate-500 font-normal ml-1">
                    / month
                </span>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-slate-200/60" />

            {/* Features List */}
            <div className="flex-1">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    What's Included
                </p>

                <div className="space-y-2.5">
                    {features.map((feature) => (
                        <div
                            key={feature}
                            className="flex items-center gap-2.5 text-xs sm:text-sm"
                        >
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                <FiCheck className="h-3 w-3" />
                            </div>
                            <span className="text-slate-600 font-medium">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-8">
                <button
                    disabled={current || isLoading || isDowngrade}
                    onClick={onUpgrade}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all duration-200 
                        ${current
                            ? "cursor-default bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs"
                            : isDowngrade
                                ? "cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200"
                                : isPopular
                                    ? "bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 shadow-sm shadow-indigo-200 active:scale-98"
                                    : "border border-slate-200 cursor-pointer bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-98"
                        }`}
                >
                    {current ? (
                        "Current Plan"
                    ) : isDowngrade ? (
                        "Downgrade Not Available"
                    ) : isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>Processing...</span>
                        </div>
                    ) : (
                        <>
                            <span>Upgrade Plan</span>
                            <FiArrowRight className="h-4 w-4" />
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}