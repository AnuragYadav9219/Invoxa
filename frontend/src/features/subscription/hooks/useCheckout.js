import { toast } from "sonner";

import {
    useCreateCheckoutMutation,
    useVerifyPaymentMutation,
} from "../subscriptionApi";
import { loadRazorpay } from "@/utils/loadRazorpay";
import { useState } from "react";

export function useCheckout() {

    const [loadingPlanId, setLoadingPlanId] = useState(null);
    const [createCheckout, checkoutState] = useCreateCheckoutMutation();
    const [verifyPayment] = useVerifyPaymentMutation();

    const checkout = async (plan, currentPlan) => {

        setLoadingPlanId(plan.id);

        if (currentPlan?.plan?.id === plan.id) {
            toast.info("You're already subscribed to this plan.");
            return { success: false };
        }

        try {

            const loaded = await loadRazorpay();

            if (!loaded) {
                toast.error("Unable to load Razorpay.");
                return { success: false };
            }

            const order = await createCheckout({
                planId: plan.id,
            }).unwrap();

            return new Promise((resolve, reject) => {
                const razorpay = new window.Razorpay({
                    key: order.key,
                    amount: Number(order.amount) * 100,
                    currency: order.currency,
                    order_id: order.orderId,
                    name: "Invoxa",
                    description: `${plan.name} Subscription`,
                    theme: { color: "#4f46e5" },

                    retry: {
                        enabled: true,
                        max_count: 3,
                    },

                    modal: {
                        ondismiss() {
                            toast.info("Checkout cancelled");
                            resolve({
                                success: false
                            });
                        },
                    },

                    handler: async (response) => {
                        try {
                            await verifyPayment({
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                            }).unwrap();

                            toast.success("Subscription Activated");

                            resolve({
                                success: true
                            });

                        } catch (e) {
                            toast.error("Payment verification Failed");
                            reject(e);
                        }

                    },
                });

                razorpay.on("payment.failed", (response) => {

                    console.error(response.error);

                    toast.error(
                        response.error.description
                    );

                    reject(response.error);

                });

                razorpay.open();
            });

        } catch (e) {
            toast.error("Unable to create checkout.");
            throw e;
        } finally {
            setLoadingPlanId(null);
        }
    };

    return {
        checkout,
        checkoutLoading: checkoutState.isLoading,
        loadingPlanId,
    };
}