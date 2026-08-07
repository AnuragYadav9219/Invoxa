import { toast } from "sonner";
import {
    useCreateOrderMutation,
    useVerifyPaymentMutation,
} from "../paymentApi";
import { useNavigate } from "react-router-dom";
import { loadRazorpay } from "@/utils/loadRazorpay";

export default function useRazorpayPayment() {

    const navigate = useNavigate();

    const [createOrder, orderState] = useCreateOrderMutation();
    const [verifyPayment] = useVerifyPaymentMutation();

    const payNow = async (invoice, refetch = null) => {
        try {
            const loaded = await loadRazorpay();

            if (!loaded) {
                toast.error("Unable to load payment gateway.");
                return { success: false };
            }

            const order = await createOrder(invoice.id).unwrap();

            if (!order?.key || !order?.orderId) {
                toast.error("Unable to initialize payment.");
                return { success: false };
            }

            return new Promise((resolve) => {
                const razorpay = new window.Razorpay({
                    key: order.key,

                    amount:
                        order.amountInPaise ??
                        Number(order.amount) * 100,

                    currency: order.currency,
                    order_id: order.orderId,
                    name: "Invoxa",
                    description: `Invoice ${invoice.invoiceNumber}`,
                    image: "/logo.png",

                    config: {
                        display: {
                            hide: [
                                { method: "paylater" },
                                { method: "emi" },
                                { method: "wallet" },
                            ],
                        },
                    },

                    notes: {
                        invoiceId: invoice.id,
                        invoiceNumber: invoice.invoiceNumber,
                    },

                    retry: {
                        enabled: true,
                        max_count: 3,
                    },

                    theme: {
                        color: "#4f46e5",
                    },

                    modal: {
                        escape: true,
                        ondismiss() {
                            toast.info("Payment cancelled.");

                            resolve({
                                success: false,
                            });
                        },
                    },

                    handler: async (response) => {
                        try {
                            await verifyPayment({
                                invoiceId: invoice.id,

                                razorpayOrderId:
                                    response.razorpay_order_id,

                                razorpayPaymentId:
                                    response.razorpay_payment_id,

                                razorpaySignature:
                                    response.razorpay_signature,
                            }).unwrap();

                            if (refetch) {
                                await refetch();
                            }

                            toast.success(
                                "Payment completed successfully."
                            );

                            resolve({
                                success: true,
                            });

                            navigate(
                                "/payment/success",
                                {
                                    replace: true,
                                }
                            );

                        } catch (err) {
                            console.error(
                                "Verification Failed",
                                err
                            );

                            toast.error(
                                err?.data?.message ??
                                "Payment verification failed."
                            );

                            resolve({
                                success: false,
                            });

                            navigate(
                                `/payment/failed?token=${invoice.paymentToken}`,
                                {
                                    replace: true,
                                }
                            );
                        }
                    },
                });

                razorpay.on(
                    "payment.failed",
                    ({ error }) => {

                        console.error(
                            "Payment Failed",
                            error
                        );

                        toast.error(
                            error?.description ??
                            "Payment failed."
                        );

                        resolve({
                            success: false,
                        });

                        navigate(
                            `/payment/failed?token=${invoice.paymentToken}`,
                            {
                                replace: true,
                            }
                        );
                    }
                );
                razorpay.open();
            });

        } catch (err) {

            console.error(
                "Create Order Failed",
                err
            );

            toast.error(
                err?.data?.message ??
                err?.message ??
                "Unable to initiate payment."
            );

            navigate(
                `/payment/failed?token=${invoice.paymentToken}`,
                {
                    replace: true,
                }
            );

            return {
                success: false,
            };
        }
    };

    return {
        payNow,
        loading: orderState.isLoading,
    };
}