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
                toast.error("Unable to load Razorpay.");
                return { success: false };
            }

            const order = await createOrder(invoice.id).unwrap();

            return new Promise((resolve, reject) => {
                const razorpay = new window.Razorpay({
                    key: order.key,
                    amount: order.amountInPaise ?? Number(order.amount) * 100,
                    currency: order.currency,
                    order_id: order.orderId,

                    image: "/logo.png",

                    name: "Invoxa",

                    description: `Invoice ${invoice.invoiceNumber}`,

                    prefill: {
                        name: invoice.customerName,
                        email: invoice.customerEmail,
                        contact: invoice.customerPhone
                            ?.replace(/\D/g, "")
                            .slice(-10),
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

                    remember_customer: true,

                    modal: {
                        ondismiss() {
                            toast.info("Payment cancelled");

                            resolve({
                                success: false,
                            });
                        },
                    },

                    handler: async (response) => {
                        try {
                            await verifyPayment({
                                invoiceId: invoice.id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                            }).unwrap();

                            toast.success("Payment Successful");

                            if (refetch) {
                                await refetch();
                            }

                            navigate("/payment/success");

                            resolve({
                                success: true,
                            });

                        } catch (e) {

                            toast.error("Payment verification failed");

                            navigate(
                                `/payment/failed?token=${invoice.paymentToken}`
                            );

                            reject(e);
                        }
                    },
                });

                razorpay.on("payment.failed", (response) => {
                    toast.error(
                        response.error.description
                    );

                    navigate(
                        `/payment/failed?token=${invoice.paymentToken}`
                    );

                    reject(response.error);
                });

                razorpay.open();
            });

        } catch (e) {
            toast.error(
                e?.data?.message ??
                "Unable to initiate payment."
            );

            navigate(
                `/payment/failed?token=${invoice.paymentToken}`
            );

            throw e;
        }
    };

    return {
        payNow,
        loading: orderState.isLoading,
    };
}