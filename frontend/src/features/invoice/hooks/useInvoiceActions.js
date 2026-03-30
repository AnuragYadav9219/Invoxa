import { useCrudActions } from '@/hooks/useCrudActions';
import { useCreateInvoiceMutation, useDeleteInvoiceMutation, usePermanentDeleteInvoiceMutation, useRestoreInvoiceMutation, useUpdateInvoiceMutation } from '../invoiceApi'


export function useInvoiceActions() {
    const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
    const [updateInvoice, { isLoading: isUpdating }] = useUpdateInvoiceMutation();
    const [deleteInvoice, { isLoading: isDeleting }] = useDeleteInvoiceMutation();
    const [restoreInvoice] = useRestoreInvoiceMutation();
    const [permanentDeleteInvoice] = usePermanentDeleteInvoiceMutation();

    const crud = useCrudActions({
        createFn: createInvoice,
        updateFn: updateInvoice,
        deleteFn: deleteInvoice,
        restoreFn: restoreInvoice,
        permanentDeleteFn: permanentDeleteInvoice,
        entityName: "Invoice",
        getLabel: (inv) => `${inv.customerName} (#${inv.invoiceNumber})`,
    });

    return {
        ...crud,
        isCreating,
        isUpdating,
        isDeleting,
    };
}
