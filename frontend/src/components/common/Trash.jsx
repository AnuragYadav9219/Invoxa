import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, AlertCircle } from "lucide-react";
import TrashPage from "@/components/common/TrashPage";
import { motion } from "framer-motion";

import { useGetDeletedItemsQuery } from "@/features/item/itemApi";
import { useItemActions } from "@/features/item/hooks/useItemActions";

import { useGetDeletedInvoicesQuery, usePermanentDeleteAllInvoicesMutation } from "@/features/invoice/invoiceApi";
import { useInvoiceActions } from "@/features/invoice/hooks/useInvoiceActions";

import { useGetDeletedPaymentsQuery } from "@/features/payment/paymentApi";
import { usePaymentActions } from "@/features/payment/hooks/usePaymentActions";

import { getEntityLabel } from "@/utils/entityHelpers";
import { toast } from "sonner";
import { useState } from "react";

const tabContentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function Trash() {
    const { data: items = [], isLoading: itemsLoading, error: itemsError, isError: itemsIsError, refetch: itemsRefetch } =
        useGetDeletedItemsQuery();

    const { data: invoices = [], isLoading: invoicesLoading, error: invoicesError, isError: invoicesIsError, refetch: invoiceRefetch } =
        useGetDeletedInvoicesQuery();

    const { data: payments = [], isLoading: paymentsLoading, error: paymentsError, isError: paymentsIsError, refetch: paymentsRefetch } =
        useGetDeletedPaymentsQuery();

    const [deleteAllInvoices, { isDeletingAllInvoices }] = usePermanentDeleteAllInvoicesMutation();

    const isLoading = itemsLoading || invoicesLoading || paymentsLoading;
    const error = itemsError || invoicesError || paymentsError;
    const isError = itemsIsError || invoicesIsError || paymentsIsError;
    const refetch = itemsRefetch || invoiceRefetch || paymentsRefetch;

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
            case "item": return restoreItem(item);
            case "invoice": return restoreInvoice(item);
            case "payment": return restorePayment(item);
            default: return;
        }
    };

    const handlePermanentDelete = (item) => {
        if (!item?.id) return;
        switch (item.type) {
            case "item": return deleteItem(item);
            case "invoice": return deleteInvoice(item);
            case "payment": return deletePayment(item);
            default: return;
        }
    };

    const handleDeleteAll = async () => {
        if (invoices.length === 0) {
            toast.info("No deleted invoices found");
            return;
        }

        try {
            const res = await deleteAllInvoices().unwrap();

            toast.success("Invoices deleted permanently.");

        } catch (error) {
            toast.error("Failed to delete invoices.");
        }
    }

    return (
        <div className="flex flex-col h-screen p-1 sm:p-4 md:p-6 bg-slate-50/50 dark:bg-background overflow-hidden w-full max-w-[96vw]">

            {/* Animated Header Card - Fixed Text Wrapping */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 shrink-0 p-4 sm:p-5 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-slate-800 shadow-sm w-full"
            >
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-500 ring-1 ring-rose-500/20 shrink-0"
                >
                    <Trash2 size={22} strokeWidth={2.5} />
                </motion.div>

                <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                        Trash
                    </h1>
                    <div className="flex items-start sm:items-center gap-1.5 mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        <AlertCircle size={14} className="shrink-0 mt-0.5 sm:mt-0" />
                        <p className="wrap-break-word whitespace-normal leading-relaxed">
                            Items are automatically deleted after 30 days.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Tabs Interface */}
            <Tabs defaultValue="all" className="flex flex-col flex-1 overflow-hidden w-full">

                <div className="w-full overflow-x-auto no-scrollbar pb-1">
                    <TabsList className="inline-flex w-max min-w-full sm:min-w-0 sm:w-auto justify-start h-auto p-1.5 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl sm:rounded-full border border-slate-200 dark:border-slate-700/50 flex-nowrap">
                        {[
                            { value: "all", label: "All", count: allTrash.length },
                            { value: "items", label: "Items", count: items.length },
                            { value: "invoices", label: "Invoices", count: invoices.length },
                            { value: "payments", label: "Payments", count: payments.length }
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="relative rounded-lg sm:rounded-full py-3 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm shrink-0 whitespace-nowrap"
                            >
                                {tab.label}
                                <span className="ml-2 py-0.5 px-2 rounded-full bg-slate-100 dark:bg-slate-900/50 text-[10px] sm:text-xs font-semibold">
                                    {tab.count}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* ALL TAB */}
                <TabsContent value="all" className="flex-1 overflow-hidden mt-3 sm:mt-6 outline-none">
                    <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="h-full">
                        <TrashPage
                            title="All Trash"
                            items={allTrash}
                            isLoading={isLoading}
                            isError={isError}
                            refetch={refetch}
                            error={error}
                            onRestore={handleRestore}
                            onPermanentDelete={handlePermanentDelete}
                            getLabel={getEntityLabel}
                            renderItem={(item) => (
                                <div className="flex flex-col w-full min-w-0">
                                    <div className="flex items-start sm:items-center justify-between gap-2">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                            {item.name || item.customerName}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs sm:text-sm shrink-0">
                                            {item.type === "payment" ? `₹${item.amount || 0}` : item.type === "item" ? `₹${item.price}` : `₹${item.totalAmount || 0}`}
                                        </p>
                                    </div>
                                    <span className="mt-2 w-max px-2 py-0.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                        {item.type}
                                    </span>
                                </div>
                            )}
                        />
                    </motion.div>
                </TabsContent>

                {/* ITEMS TAB */}
                <TabsContent value="items" className="flex-1 overflow-hidden mt-3 sm:mt-6 outline-none">
                    <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="h-full">
                        <TrashPage
                            title="Items Trash"
                            items={items.map((i) => ({ ...i, type: "item" }))}
                            isLoading={isLoading}
                            onRestore={restoreItem}
                            onPermanentDelete={deleteItem}
                            getLabel={getEntityLabel}
                            renderItem={(item) => (
                                <div className="flex flex-col w-full min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                                        <p className="font-medium text-slate-900 dark:text-slate-100 shrink-0">₹{item.price}</p>
                                    </div>
                                </div>
                            )}
                        />
                    </motion.div>
                </TabsContent>

                {/* INVOICES TAB */}
                <TabsContent value="invoices" className="flex-1 overflow-hidden mt-3 sm:mt-6 outline-none">
                    <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="h-full">
                        <TrashPage
                            title="Invoices Trash"
                            items={invoices.map((i) => ({ ...i, type: "invoice" }))}
                            isLoading={isLoading}
                            onRestore={restoreInvoice}
                            onPermanentDelete={deleteInvoice}
                            onDeleteAll={handleDeleteAll}
                            deleteAllLoading={isDeletingAllInvoices}
                            getLabel={getEntityLabel}
                            renderItem={(item) => (
                                <div className="flex flex-col w-full min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.customerName}</p>
                                        <p className="font-medium text-slate-900 dark:text-slate-100 shrink-0">₹{item.totalAmount || 0}</p>
                                    </div>
                                </div>
                            )}
                        />
                    </motion.div>
                </TabsContent>

                {/* PAYMENTS TAB */}
                <TabsContent value="payments" className="flex-1 overflow-hidden mt-3 sm:mt-6 outline-none">
                    <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="h-full">
                        <TrashPage
                            title="Payments Trash"
                            items={payments.map((i) => ({ ...i, type: "payment" }))}
                            isLoading={isLoading}
                            onRestore={restorePayment}
                            onPermanentDelete={deletePayment}
                            getLabel={getEntityLabel}
                            renderItem={(item) => (
                                <div className="flex flex-col w-full min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.customerName}</p>
                                        <p className="font-medium text-slate-900 dark:text-slate-100 shrink-0">₹{item.amount || 0}</p>
                                    </div>
                                </div>
                            )}
                        />
                    </motion.div>
                </TabsContent>

            </Tabs>
        </div>
    );
}