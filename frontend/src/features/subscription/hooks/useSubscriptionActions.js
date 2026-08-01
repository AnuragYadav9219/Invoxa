import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "./useCheckout";
import { useSubscription } from "./useSubscription";

export function useSubscriptionActions() {
    const navigate = useNavigate();

    const {
        currentPlan,
        isLoggedIn,
        refetchDashboard,
    } = useSubscription();

    const {
        checkout,
        checkoutLoading,
    } = useCheckout();

    const upgrade = async (plan) => {
        if (!isLoggedIn) {
            navigate(`/register?plan=${plan.name}`);
            return;
        }

        if (currentPlan?.planName?.toUpperCase() === plan.name?.toUpperCase()) {
            toast.info("Already using this plan.");
            return;
        }

        if (plan.monthlyPrice === 0) {
            toast.info("FREE plan is already active.");
            return;
        }

        const result = await checkout(plan);

        if (result?.success) {
            await refetchDashboard();
            toast.success("Welcome to " + plan.name);
        }
    };

    return {
        upgrade,
        checkoutLoading,
    };
}