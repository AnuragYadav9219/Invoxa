import { useCrudActions } from "@/hooks/useCrudActions";
import {
    useAddPaymentMutation,
    useDeletePaymentMutation,
    useMarkAsPaidMutation,
    usePermanentDeletePaymentMutation,
    useRestorePaymentMutation,
    useUpdatePaymentMutation,
} from "../paymentApi";

import { showSuccess, showError } from "@/components/toast/toast";

export function usePaymentActions() {
    const [addPayment, { isLoading: isCreating }] = useAddPaymentMutation();
    const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();
    const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();
    const [restorePayment, { isLoading: isRestoring }] = useRestorePaymentMutation();
    const [permanentDeletePayment, { isLoading: isPermanentDeleting }] =
        usePermanentDeletePaymentMutation();

    const [markAsPaid, { isLoading: isMarkingPaid }] = useMarkAsPaidMutation();

    const crud = useCrudActions({
        createFn: addPayment,
        updateFn: updatePayment,
        deleteFn: deletePayment,
        restoreFn: restorePayment,
        permanentDeleteFn: permanentDeletePayment,
        entityName: "Payment",
        getLabel: (p) => `₹${p?.amount || 0} (${p?.method || "N/A"})`,
    });

    const handleMarkAsPaid = async (invoiceId) => {
        try {
            await markAsPaid(invoiceId).unwrap();
            showSuccess("Invoice marked as paid");
        } catch (err) {
            showError("Failed to mark as paid");
        }
    };

    const isLoadingAny =
        isCreating ||
        isUpdating ||
        isDeleting ||
        isRestoring ||
        isPermanentDeleting ||
        isMarkingPaid;

    return {
        ...crud,
        handleMarkAsPaid,
        isCreating,
        isUpdating,
        isMarkingPaid,
        isDeleting,
        isRestoring,
        isPermanentDeleting,
        isLoadingAny,
    };
}