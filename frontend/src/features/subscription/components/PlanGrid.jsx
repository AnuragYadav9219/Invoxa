import PlanCard from "./PlanCard";
import { FiLayers } from "react-icons/fi";

const planOrder = {
    FREE: 1,
    PRO: 2,
    BUSINESS: 3,
};

export default function PlanGrid({
    plans = [],
    currentPlan,
    checkoutLoading,
    loadingPlanId,
    onUpgrade,
}) {

    const currentPlanLevel =
        planOrder[currentPlan?.planName?.toUpperCase()] ?? 0;

    const sortedPlans = [...plans].sort(
        (a, b) =>
            (planOrder[a.name?.toUpperCase()] ?? 999) -
            (planOrder[b.name?.toUpperCase()] ?? 999)
    );

    return (
        <section
            id="upgrade-plan"
            className="space-y-6 scroll-mt-16"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
                <div>
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium tracking-wide text-indigo-600 mb-1.5 border border-indigo-100/80 shadow-2xs">
                        <FiLayers className="h-3 w-3" />
                        <span>Pricing</span>
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight text-slate-800">
                        Available Plans
                    </h3>

                    <p className="text-xs text-slate-500 mt-0.5">
                        Choose the right plan to scale your business seamlessly.
                    </p>
                </div>

                <span className="inline-flex items-center rounded-full bg-slate-200/70 px-2.5 py-1 text-xs font-medium text-slate-600 self-start sm:self-auto">
                    {sortedPlans.length}{" "}
                    {sortedPlans.length === 1 ? "Plan" : "Plans"} Available
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {sortedPlans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        current={
                            currentPlan?.planName?.toUpperCase() ===
                            plan.name?.toUpperCase()
                        }
                        isDowngrade={
                            (planOrder[plan.name?.toUpperCase()] ?? 0) <
                            currentPlanLevel
                        }
                        checkoutLoading={checkoutLoading}
                        loadingPlanId={loadingPlanId}
                        onUpgrade={() => onUpgrade(plan)}
                    />
                ))}
            </div>
        </section>
    );
}