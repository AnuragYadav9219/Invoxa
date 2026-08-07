import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaIndianRupeeSign, FaWandMagicSparkles } from "react-icons/fa6";
import { toast } from "sonner";
import { tokenService } from "@/services/tokenService";
import {
  useGetPlansQuery,
  useCreateCheckoutMutation,
  useVerifyPaymentMutation,
  useGetSubscriptionDashboardQuery,
} from "@/features/subscription/subscriptionApi";
import { FiArrowRight, FiCheck, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PricingCardSkeleton from "../loaders/PricingCardSkeleton";
import { Skeleton } from "../ui/skeleton";
import { loadRazorpay } from "@/utils/loadRazorpay";

export default function Pricing() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const isLoggedIn =
    !!tokenService.getToken() && !!localStorage.getItem("shopId");

  const {
    data: apiPlans = [],
    isLoading,
    isError,
  } = useGetPlansQuery();

  const { data: dashboard } = useGetSubscriptionDashboardQuery(undefined, {
    skip: !isLoggedIn,
  });

  const [createCheckout, { isLoading: checkoutLoading }] = useCreateCheckoutMutation();

  const [verifyPayment] = useVerifyPaymentMutation();

  const currentPlan = dashboard?.planName;

  const planOrder = {
    FREE: 1,
    PRO: 2,
    BUSINESS: 3,
  };

  const plans = [...apiPlans].sort(
    (a, b) =>
      (planOrder[a.name?.toUpperCase()] ?? 999) -
      (planOrder[b.name?.toUpperCase()] ?? 999)
  );

  const handleUpgrade = async (plan) => {
    if (!isLoggedIn) {
      navigate(`/register?plan=${plan.name}`);
      return;
    }

    if (plan.monthlyPrice === 0) {
      toast.success("You are already on the starter plan!");
      return;
    }

    try {
      setLoadingPlanId(plan.id);

      const loaded = await loadRazorpay();

      if (!loaded) {
        toast.error("Unable to load Razorpay.");
        return;
      }

      const checkout = await createCheckout({
        planId: plan.id,
      }).unwrap();

      const razorpay = new window.Razorpay({
        key: checkout.key,
        amount: checkout.amount * 100,
        currency: checkout.currency,
        order_id: checkout.orderId,
        name: "Invoxa",
        description: `${plan.name} Subscription`,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }).unwrap();

            toast.success("Subscription activated successfully!");
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed.");
          }
        },
        modal: {
          ondismiss() {
            toast("Payment cancelled.");
          },
        },
        theme: {
          color: "#6366F1",
        },
      });

      razorpay.open();

    } catch (err) {
      console.error(err);
      toast.error("Unable to initiate payment.");

    } finally {
      setLoadingPlanId(null);
    }
  };

  if (isLoading) {
    return (
      <section
        id="pricing"
        className="bg-slate-950 px-4 py-20 sm:px-6 lg:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <Skeleton className="mx-auto h-8 w-48 rounded-full bg-slate-800" />
            <Skeleton className="mx-auto mt-6 h-12 w-3/4 bg-slate-800" />
            <Skeleton className="mx-auto mt-4 h-5 w-2/3 bg-slate-800" />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <PricingCardSkeleton key={item} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-slate-950 px-4 sm:px-6 lg:px-8 py-20 lg:py-32"
    >
      {/* Animated Glowing Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-75 sm:w-150 h-75 sm:h-150 bg-indigo-600/20 rounded-full blur-[120px] sm:blur-[180px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mx-auto mb-14 sm:mb-20 max-w-3xl space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-md"
          >
            <FaWandMagicSparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span>Simple, Transparent Pricing</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
          >
            Plans built for every stage of growth.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto"
          >
            Choose the right plan to manage invoices, streamline operations, and scale your business effortlessly.
          </motion.p>

          {/* Billing Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-4"
          >
            <span className={`text-sm transition-colors ${!isAnnual ? "font-medium text-white" : "text-slate-400"}`}>
              Monthly
            </span>

            <button
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle annual billing"
              className="relative cursor-pointer h-7 w-14 rounded-full border border-slate-800 bg-slate-900 p-1 transition-colors hover:border-slate-700 focus:outline-none"
            >
              <motion.div
                animate={{ x: isAnnual ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="h-5 w-5 rounded-full bg-linear-to-r from-indigo-500 to-violet-500 shadow-md"
              />
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-sm transition-colors ${isAnnual ? "font-medium text-white" : "text-slate-400"}`}>
                Annually
              </span>
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-300"
              >
                Save 20%
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, index) => {
            const isCurrentPlan =
              currentPlan?.toUpperCase() === plan.name?.toUpperCase();

            const isPopular = plan.name?.toUpperCase() === "PRO";

            const formatLimit = (value) =>
              value === -1 ? "Unlimited" : value;

            const features = [
              `${formatLimit(plan.invoiceLimit)} Invoices`,
              `${formatLimit(plan.customerLimit)} Customers`,
              `${formatLimit(plan.itemLimit)} Items`,
              `${formatLimit(plan.userLimit)} Team Members`,
              ...(plan.emailEnabled ? ["Email Notifications"] : []),
              ...(plan.apiEnabled ? ["Developer API"] : []),
              ...(plan.aiEnabled ? ["AI Assistant"] : []),
              ...(plan.customTemplates ? ["Custom Invoice Templates"] : []),
            ];

            const calculatedPrice = isAnnual
              ? Math.round(plan.monthlyPrice * 0.8)
              : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 ${isPopular
                  ? "bg-slate-900/90 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10 ring-4 ring-indigo-500/10"
                  : "bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
              >
                {isPopular && (
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-indigo-500 to-violet-600 px-4 py-1 text-xs font-semibold tracking-wide text-white shadow-lg"
                  >
                    Most Popular
                  </motion.div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{plan.name}</h3>
                    {isCurrentPlan && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                        <FiShield className="h-3 w-3" /> Active
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-slate-400 min-h-9">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <FaIndianRupeeSign className="h-5 w-5 text-white self-center" />
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                      {calculatedPrice}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-400">/ month</span>
                  </div>

                  <div className="mt-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                      What's included
                    </p>
                    <ul className="space-y-3 border-t border-slate-800/80 pt-5">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-xs sm:text-sm text-slate-300"
                        >
                          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400 mt-0.5">
                            <FiCheck className="h-2.5 w-2.5 stroke-3" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/80">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoggedIn && (isCurrentPlan || loadingPlanId === plan.id)}
                    onClick={() => handleUpgrade(plan)}
                    className={`flex w-full items-center cursor-pointer justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all shadow-md ${isLoggedIn && isCurrentPlan
                      ? "cursor-default bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-none"
                      : isPopular
                        ? "bg-linear-to-r from-indigo-500 to-violet-600 text-white hover:opacity-95 hover:shadow-lg hover:shadow-indigo-500/25"
                        : "border border-slate-700 bg-slate-800/60 text-white hover:bg-slate-800 hover:border-slate-600"
                      }`}
                  >
                    {isLoggedIn ? (
                      isCurrentPlan ? (
                        "Current Active Plan"
                      ) : loadingPlanId === plan.id ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        "Upgrade Plan"
                      )
                    ) : (
                      "Get Started"
                    )}

                    {!(isLoggedIn && isCurrentPlan) && loadingPlanId !== plan.id && (
                      <FiArrowRight className="h-4 w-4" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}