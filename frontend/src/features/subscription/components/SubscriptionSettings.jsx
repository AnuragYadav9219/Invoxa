import PlanGrid from "../components/PlanGrid";
import { useSubscription } from "../hooks/useSubscription";
import BillingInformationCard from "./BillingInformationCard";
import PaymentHistory from "./PaymentHistory";
import SubscriptionOverviewCard from "./SubscriptionOverviewCard";

export default function SubscriptionSettings() {
    const {
        plans,
        currentPlan,
        loading,
        upgrade,
        checkoutLoading,
    } = useSubscription();

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center bg-white rounded-2xl border border-slate-200/90">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    <span className="text-xs font-medium text-slate-500">Loading subscription details...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <SubscriptionOverviewCard
                    currentPlan={currentPlan}
                />

                <BillingInformationCard />
            </div>

            {/* Available Plans */}
            <PlanGrid
                plans={plans}
                currentPlan={currentPlan}
                checkoutLoading={checkoutLoading}
                onUpgrade={upgrade}
            />

            {/* Payment History */}
            <PaymentHistory
                payments={[]}
            />
        </div>
    );
}