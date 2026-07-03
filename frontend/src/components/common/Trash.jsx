import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import TrashPage from "@/components/common/TrashPage";

import { useGetDeletedItemsQuery } from "@/features/item/itemApi";
import { useItemActions } from "@/features/item/hooks/useItemActions";

import { useGetDeletedInvoicesQuery } from "@/features/invoice/invoiceApi";
import { useInvoiceActions } from "@/features/invoice/hooks/useInvoiceActions";

import { useGetDeletedPaymentsQuery } from "@/features/payment/paymentApi";
import { usePaymentActions } from "@/features/payment/hooks/usePaymentActions";

import { getEntityLabel } from "@/utils/entityHelpers";

export default function Trash() {
    const { data: items = [], isLoading: itemsLoading } =
        useGetDeletedItemsQuery();

    const { data: invoices = [], isLoading: invoicesLoading } =
        useGetDeletedInvoicesQuery();

    const { data: payments = [], isLoading: paymentsLoading } =
        useGetDeletedPaymentsQuery();

    const isLoading =
        itemsLoading || invoicesLoading || paymentsLoading;

    const {
        handleRestore: restoreItem,
        handlePermanentDelete: deleteItem,
    } = useItemActions();

    const {
        handleRestore: restoreInvoice,
        handlePermanentDelete: deleteInvoice,
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

    const handleRestore = (item) => {
        if (!item?.id) return;

        switch (item.type) {
            case "item":
                return restoreItem(item);

            case "invoice":
                return restoreInvoice(item);

            case "payment":
                return restorePayment(item);

            default:
                return;
        }
    };

    const handlePermanentDelete = (item) => {
        if (!item?.id) return;

        switch (item.type) {
            case "item":
                return deleteItem(item);

            case "invoice":
                return deleteInvoice(item);

            case "payment":
                return deletePayment(item);

            default:
                return;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-70px)] p-2 overflow-hidden">

            {/* Header */}

            <div className="flex items-start sm:items-center gap-3 mb-4 shrink-0">

                <div className="p-2 rounded-xl bg-red-50 text-red-600">
                    <Trash2 size={18} />
                </div>

                <div>
                    <h1 className="text-xl font-semibold">
                        Trash
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage deleted data. Auto-deleted after 30 days.
                    </p>
                </div>

            </div>

            {/* Tabs */}

            <Tabs
                defaultValue="all"
                className="flex flex-col flex-1 overflow-hidden"
            >

                <TabsList className="flex w-full sm:w-auto overflow-x-auto bg-muted rounded-lg p-1 shrink-0">

                    <TabsTrigger
                        value="all"
                        className="flex-1 sm:flex-none"
                    >
                        All ({allTrash.length})
                    </TabsTrigger>

                    <TabsTrigger
                        value="items"
                        className="flex-1 sm:flex-none"
                    >
                        Items ({items.length})
                    </TabsTrigger>

                    <TabsTrigger
                        value="invoices"
                        className="flex-1 sm:flex-none"
                    >
                        Invoices ({invoices.length})
                    </TabsTrigger>

                    <TabsTrigger
                        value="payments"
                        className="flex-1 sm:flex-none"
                    >
                        Payments ({payments.length})
                    </TabsTrigger>

                </TabsList>

                {/* ALL */}

                <TabsContent
                    value="all"
                    className="flex-1 overflow-hidden mt-4"
                >
                    <TrashPage
                        title="All Trash"
                        items={allTrash}
                        isLoading={isLoading}
                        onRestore={handleRestore}
                        onPermanentDelete={handlePermanentDelete}
                        getLabel={getEntityLabel}
                        renderItem={(item) => (
                            <>
                                <p className="font-medium">
                                    {item.name || item.customerName}

                                    <span className="ml-2 text-xs text-gray-400 capitalize">
                                        ({item.type})
                                    </span>
                                </p>

                                <p className="text-sm text-gray-500">
                                    {item.type === "payment"
                                        ? `₹${item.amount || 0}`
                                        : item.type === "item"
                                        ? `₹${item.price}`
                                        : `₹${item.totalAmount || 0}`}
                                </p>
                            </>
                        )}
                    />
                </TabsContent>

                {/* ITEMS */}

                <TabsContent
                    value="items"
                    className="flex-1 overflow-hidden mt-4"
                >
                    <TrashPage
                        title="Items Trash"
                        items={items.map((i) => ({
                            ...i,
                            type: "item",
                        }))}
                        isLoading={isLoading}
                        onRestore={restoreItem}
                        onPermanentDelete={deleteItem}
                        getLabel={getEntityLabel}
                        renderItem={(item) => (
                            <>
                                <p className="font-medium">
                                    {item.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    ₹{item.price}
                                </p>
                            </>
                        )}
                    />
                </TabsContent>

                {/* INVOICES */}

                <TabsContent
                    value="invoices"
                    className="flex-1 overflow-hidden mt-4"
                >
                    <TrashPage
                        title="Invoices Trash"
                        items={invoices.map((i) => ({
                            ...i,
                            type: "invoice",
                        }))}
                        isLoading={isLoading}
                        onRestore={restoreInvoice}
                        onPermanentDelete={deleteInvoice}
                        getLabel={getEntityLabel}
                        renderItem={(item) => (
                            <>
                                <p className="font-medium">
                                    {item.customerName}
                                </p>

                                <p className="text-sm text-gray-500">
                                    ₹{item.totalAmount || 0}
                                </p>
                            </>
                        )}
                    />
                </TabsContent>

                {/* PAYMENTS */}

                <TabsContent
                    value="payments"
                    className="flex-1 overflow-hidden mt-4"
                >
                    <TrashPage
                        title="Payments Trash"
                        items={payments.map((i) => ({
                            ...i,
                            type: "payment",
                        }))}
                        isLoading={isLoading}
                        onRestore={restorePayment}
                        onPermanentDelete={deletePayment}
                        getLabel={getEntityLabel}
                        renderItem={(item) => (
                            <>
                                <p className="font-medium">
                                    {item.customerName}
                                </p>

                                <p className="text-sm text-gray-500">
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