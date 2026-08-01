import { toast } from "sonner";
import {
    useCreateOrderMutation,
    useVerifyPaymentMutation,
} from "../paymentApi";
import { useNavigate } from "react-router-dom";
import { loadRazorpay } from "@/utils/loadRazorpay";

export default function useRazorpayPayment() {
    const navigate = useNavigate();

    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const [verifyPayment] = useVerifyPaymentMutation();

    // ================= PAY NOW =================
    const payNow = async (invoice, refetch = null) => {
        try {
            const loaded = await loadRazorpay();

            if (!loaded) {
                toast.error("Unable to load Razorpay.");
                return;
            }

            // Create Order
            const order = await createOrder(invoice.id).unwrap();

            const options = {
                key: order.key,
                // If backend returns amountInPaise, use this:
                amount: order.amountInPaise ?? Number(order.amount) * 100,
                currency: order.currency,
                image: "/logo.png",
                name: "Invoxa",
                description: `Invoice ${invoice.invoiceNumber}`,
                order_id: order.orderId,

                prefill: {
                    name: invoice.customerName,
                    email: invoice.customerEmail,
                    contact: invoice.customerPhone?.replace(/\D/g, "").slice(-10),
                },

                notes: {
                    invoiceId: invoice.id,
                    invoiceNumber: invoice.invoiceNumber,
                },

                theme: {
                    color: "#4f46e5",
                },

                retry: {
                    enabled: true,
                    max_count: 3,
                },

                remember_customer: true,

                modal: {
                    ondismiss() {
                        toast.info("Payment cancelled");
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

                    } catch (err) {
                        console.error(err);

                        toast.error(
                            err?.data?.message ||
                            "Payment verification failed"
                        );

                        navigate(
                            `/payment/failed?token=${invoice.paymentToken}`
                        );
                    }
                },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response) {
                console.log(response.error);
                toast.error(response.error.description);

                navigate(
                    `/payment/failed?token=${invoice.paymentToken}`
                );
            });

            razorpay.open();

        } catch (err) {
            console.error(err);
            toast.error(
                err?.data?.message ||
                "Unable to initiate payment."
            );

            navigate(
                `/payment/failed?token=${invoice.paymentToken}`
            );
        }
    };

    return {
        payNow,
        loading: isLoading,
    };
}