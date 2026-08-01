import {
    useGetDashboardQuery,
    useGetPlansQuery,
} from "../subscriptionApi";

import { tokenService } from "@/services/tokenService";
import { useCheckout } from "./useCheckout";

export function useSubscription() {

    const isLoggedIn =
        !!tokenService.getToken() &&
        !!localStorage.getItem("shopId");

    const plansQuery = useGetPlansQuery();

    const dashboardQuery =
        useGetDashboardQuery(undefined, {
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

        if (result?.success && !dashboardQuery.isUninitialized) {
            await dashboardQuery.refetch();
        }
    };

    return {

        plans: plansQuery.data ?? [],

        currentPlan: dashboardQuery.data,

        loading: plansQuery.isLoading || dashboardQuery.isLoading,

        isLoggedIn,

        checkoutLoading,

        upgrade,

        refetchPlans: plansQuery.refetch,

        refetchDashboard: dashboardQuery.refetch,
    };
}