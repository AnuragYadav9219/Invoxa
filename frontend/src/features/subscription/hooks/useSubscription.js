import {
    useGetSubscriptionDashboardQuery,
    useGetPaymentHistoryQuery,
    useGetPlansQuery,
} from "../subscriptionApi";

import { tokenService } from "@/services/tokenService";
import { useCheckout } from "./useCheckout";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";

export function useSubscription() {

    const isLoggedIn =
        !!tokenService.getToken() &&
        !!localStorage.getItem("shopId");

    const plansQuery = useGetPlansQuery();

    const dashboardQuery = useGetSubscriptionDashboardQuery(undefined, {
        skip: !isLoggedIn,
    });

    const paymentHistoryQuery = useGetPaymentHistoryQuery(undefined, {
        skip: !isLoggedIn,
    });

    const {
        checkout,
        checkoutLoading,
        loadingPlanId,
    } = useCheckout();

    const [searchParams, setSearchParams] = useSearchParams();
    const checkoutStarted = useRef(false);

    const upgrade = useCallback(async (plan) => {

        const result = await checkout(
            plan,
            dashboardQuery.data
        );

        if (result?.success) {
            await dashboardQuery.refetch();
            await paymentHistoryQuery.refetch();
        }
    }, [
        checkout,
        dashboardQuery,
        paymentHistoryQuery,
    ]);

    useEffect(() => {
        if (!isLoggedIn) return;
        if (checkoutStarted.current) return;

        if (plansQuery.isLoading) return;
        if (dashboardQuery.isLoading) return;

        if (!plansQuery.data?.length) return;
        if (!dashboardQuery.data) return;

        const selectedPlanId = searchParams.get("planId");
        if (!selectedPlanId) return;

        const selectedPlan = plansQuery.data.find(
            (plan) => String(plan.id) === selectedPlanId
        );

        if (!selectedPlan) return;

        checkoutStarted.current = true;

        upgrade(selectedPlan);

        const params = new URLSearchParams(searchParams);
        params.delete("planId");

        setSearchParams(params, { replace: true });

    }, [
        isLoggedIn,
        plansQuery.data,
        plansQuery.isLoading,
        dashboardQuery.data,
        dashboardQuery.isLoading,
        searchParams,
        setSearchParams,
        upgrade,
    ]);

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

        loadingPlanId,

        upgrade,

        isLoggedIn,

        refetchPlans: plansQuery.refetch,

        refetchDashboard: dashboardQuery.refetch,

        refetchPayments: paymentHistoryQuery.refetch,
    };
}