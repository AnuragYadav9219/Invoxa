import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import TrashPage from "@/components/common/TrashPage";

import {
    useGetDeletedItemsQuery,
} from "@/features/item/itemApi";
import { useItemActions } from "@/features/item/hooks/useItemActions";
import { useGetDeletedInvoicesQuery } from "@/features/invoice/invoiceApi";
import { useInvoiceActions } from "@/features/invoice/hooks/useInvoiceActions";
import { useGetDeletedPaymentsQuery } from "@/features/payment/paymentApi";
import { usePaymentActions } from "@/features/payment/hooks/usePaymentActions";
import { getEntityLabel } from "@/utils/entityHelpers";

export default function Trash() {
    const { data: items = [], isLoading: itemsLoading } = useGetDeletedItemsQuery();
    const { data: invoices = [], isLoading: invoicesLoading } = useGetDeletedInvoicesQuery();
    const { data: payments = [], isLoading: paymentsLoading } = useGetDeletedPaymentsQuery();

    const isLoading = itemsLoading || invoicesLoading || paymentsLoading;

    const {
        handleRestore: restoreItem,
        handlePermanentDelete: deleteItem,
    } = useItemActions();

    const {
        handleRestore: restoreInvoice,
        handlePermanentDelete: deleteInvoice
    } = useInvoiceActions();

    const {
        handleRestore: restorePayment,
        handlePermanentDelete: deletePayment,
    } = usePaymentActions();

    const allTrash = [
        ...items.map((i) => ({ ...i, type: "item" })),
        ...invoices.map((i) => ({ ...i, type: "invoice" })),
        ...payments.map((i) => ({ ...i, type: "payment" })),
    ];

    /* =============== HANDLERS =================== */

    const handleRestore = (item) => {
        if (!item?.id) {
            console.error("Invalid item:", item);
            return;
        }

        if (item.type === 'item') return restoreItem(item);
        if (item.type === 'invoice') return restoreInvoice(item);
        if (item.type === 'payment') return restorePayment(item);
    }

    const handlePermanentDelete = (item) => {
        if (!item?.id) {
            console.error("Invalid item:", item);
            return;
        }

        if (item.type === 'item') return deleteItem(item);
        if (item.type === 'invoice') return deleteInvoice(item);
        if (item.type === 'payment') return deletePayment(item);
    }

    return (
        <div className="space-y-6 h-screen p-2">

            {/* HEADER */}
            <div className="flex items-start sm:items-center gap-3">
                <div className="p-2 rounded-xl bg-red-50 text-red-600 shrink-0">
                    <Trash2 size={18} />
                </div>

                <div>
                    <h1 className="text-lg sm:text-xl font-semibold">Trash</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Manage deleted data. Auto-deleted after 30 days.
                    </p>
                </div>
            </div>

            {/* TABS */}
            <Tabs defaultValue="all">

                <TabsList className="flex w-full sm:w-auto overflow-x-auto bg-muted p-1 rounded-lg">
                    <TabsTrigger value="all" className="flex-1 cursor-pointer sm:flex-none ">
                        All ({allTrash.length})
                    </TabsTrigger>

                    <TabsTrigger value="items" className="flex-1 cursor-pointer sm:flex-none">
                        Items ({items.length})
                    </TabsTrigger>

                    <TabsTrigger value="invoices" className="flex-1 cursor-pointer sm:flex-none">
                        Invoices ({invoices.length})
                    </TabsTrigger>

                    <TabsTrigger value="payments" className="flex-1 cursor-pointer sm:flex-none">
                        Payments ({payments.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <TrashPage
                        title="All Trash"
                        items={allTrash}
                        isLoading={isLoading}
                        onRestore={handleRestore}
                        onPermanentDelete={handlePermanentDelete}
                        getLabel={getEntityLabel}
                        renderItem={(item) => (
                            <>
                                <p className="font-medium text-sm sm:text-base">
                                    {item.name || item.customerName}
                                    <span className="ml-2 text-xs text-gray-400 capitalize">
                                        ({item.type})
                                    </span>
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    {
                                        item.type === "payment"
                                            ? `₹${item.amount || 0}`
                                            : item.type === "item"
                                                ? `₹${item.price}`
                                                : `₹${item.totalAmount || 0}`
                                    }
                                </p>
                            </>
                        )}
                    />
                </TabsContent>

                {/* ===================== ITEMS ======================= */}
                <TabsContent value="items">
                    <TrashPage
                        title="Items Trash"
                        items={items.map((i) => ({ ...i, type: "item" }))}
                        isLoading={isLoading}
                        onRestore={restoreItem}
                        onPermanentDelete={deleteItem}
                        getLabel={getEntityLabel}
                        renderItem={(item) => (
                            <>
                                <p className="font-medium text-sm sm:text-base">{item.name}</p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    ₹{item.price}
                                </p>
                            </>
                        )}
                    />
                </TabsContent>

                {/* ===================== INVOICES ======================= */}
                <TabsContent value="invoices">
                    <TrashPage
                        title="Invoices Trash"
                        items={invoices.map((i) => ({ ...i, type: "invoice" }))}
                        isLoading={isLoading}
                        onRestore={restoreInvoice}
                        onPermanentDelete={deleteInvoice}
                        getLabel={getEntityLabel}
                        renderItem={(item) => (
                            <>
                                <p className="font-medium text-sm sm:text-base">
                                    {item.customerName}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    ₹{item.totalAmount || 0}
                                </p>
                            </>
                        )}
                    />
                </TabsContent>

                {/* ===================== PAYMENTS ======================= */}
                <TabsContent value="payments">
                    <TrashPage
                        title="Payments Trash"
                        items={payments.map((i) => ({ ...i, type: "payment" }))}
                        isLoading={isLoading}
                        onRestore={restorePayment}
                        onPermanentDelete={deletePayment}
                        getLabel={getEntityLabel}
                        renderItem={(item) => (
                            <>
                                <p className="font-medium text-sm sm:text-base">
                                    {item.customerName}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    ₹{item.amount || 0}
                                </p>
                            </>
                        )}
                    />
                </TabsContent>

            </Tabs>
        </div>
    );
}