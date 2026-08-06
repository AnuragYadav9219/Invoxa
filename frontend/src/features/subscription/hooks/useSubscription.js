import {
    useGetSubscriptionDashboardQuery,
    useGetPaymentHistoryQuery,
    useGetPlansQuery,
} from "../subscriptionApi";

import { tokenService } from "@/services/tokenService";
import { useCheckout } from "./useCheckout";

export function useSubscription() {

    const isLoggedIn =
        !!tokenService.getToken() &&
        !!localStorage.getItem("shopId");

    const plansQuery = useGetPlansQuery();

    const dashboardQuery = useGetSubscriptionDashboardQuery(undefined, {
        skip: !isLoggedIn,
    });

    console.log("Dashboard Query", dashboardQuery.data);

    const paymentHistoryQuery = useGetPaymentHistoryQuery(undefined, {
        skip: !isLoggedIn,
    });

    const {
        checkout,
        checkoutLoading,
    } = useCheckout();

    const upgrade = async (plan) => {

        const result = await checkout(
            plan,
            dashboardQuery.data
        );

        if (result?.success) {
            await dashboardQuery.refetch();
            await paymentHistoryQuery.refetch();
        }
    };

    return {
        plans: plansQuery.data ?? [],

        currentPlan: dashboardQuery.data,

        payments: paymentHistoryQuery.data ?? [],

        loading:
            plansQuery.isLoading ||
            dashboardQuery.isLoading,

        paymentLoading:
            paymentHistoryQuery.isLoading,

        checkoutLoading,

        upgrade,

        isLoggedIn,

        refetchPlans: plansQuery.refetch,

        refetchDashboard: dashboardQuery.refetch,

        refetchPayments: paymentHistoryQuery.refetch,
    };
}