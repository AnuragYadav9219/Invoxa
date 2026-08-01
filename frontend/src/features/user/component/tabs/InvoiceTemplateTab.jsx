import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LayoutTemplate, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
    useGetShopQuery,
    useUpdateInvoiceTemplateMutation,
} from "@/features/shop/shopApi";
import InvoiceTemplateGrid from "../template/component/InvoiceTemplateGrid";
import { motion, AnimatePresence } from "framer-motion";
import { useGetDashboardQuery } from "@/features/subscription/subscriptionApi";

export default function InvoiceTemplateTab() {
    const user = useSelector((state) => state.auth.user);
    const shopId = user?.shopId;

    const {
        data: shopResponse,
        isLoading,
        refetch,
    } = useGetShopQuery(shopId, {
        skip: !shopId,
    });

    const shop = shopResponse?.data;
    const [selectedTemplate, setSelectedTemplate] = useState("classic");

    const [
        updateInvoiceTemplate,
        { isLoading: isSaving },
    ] = useUpdateInvoiceTemplateMutation();

    const {
        data: dashboard,
        isLoading: dashboardLoading,
        isError: dashboardError,
        error,
    } = useGetDashboardQuery(undefined, {
        skip: !shopId,
    });

    useEffect(() => {
        if (shop?.invoiceTemplate) {
            setSelectedTemplate(shop.invoiceTemplate.toLowerCase());
        }
    }, [shop]);

    const templates = dashboard?.templates ?? [];

    const handleTemplateChange = async (templateId) => {

        const template = templates.find(
            t => t.code.toLowerCase() === templateId.toLowerCase()
        );

        if (!template?.accessible) {
            toast.info("Upgrade your subscription to use this template.");
            return;
        }

        if (template.code.toLowerCase() === selectedTemplate.toLowerCase()) return;

        try {
            await updateInvoiceTemplate({
                shopId,
                invoiceTemplate: template.code.toUpperCase(),
            }).unwrap();

            setSelectedTemplate(template);
            toast.success("Invoice template updated successfully.");
            refetch();
        } catch (error) {
            toast.error(
                error?.data?.message || "Failed to update invoice template."
            );
        }
    };

    /* LOADING STATE */
    if (isLoading) {
        return (
            <div className="flex h-72 items-center justify-center bg-white rounded-3xl border border-slate-200/80 shadow-xl w-full">
                <div className="space-y-3 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
                    <p className="text-xs font-semibold text-slate-500">
                        Loading invoice templates...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-full min-w-0 space-y-6 overflow-x-hidden">

            {/* HEADER CARD */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 relative overflow-hidden transition-all">

                {/* Top Accent Gradient Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                            <LayoutTemplate className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Customization
                                </h3>
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
                                    <Sparkles size={10} />
                                    Dynamic Layouts
                                </span>
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                Invoice Templates
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">
                                Choose the default template design for all newly generated business invoices.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* TEMPLATE GALLERY GRID WRAPPER */}
            <div className="w-full max-w-full min-w-0 overflow-x-hidden">
                <InvoiceTemplateGrid
                    currentTemplate={selectedTemplate}
                    onTemplateChange={handleTemplateChange}
                    templates={templates}
                />
            </div>

            {/* FOOTER STATUS CARD */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between relative overflow-hidden">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Active Layout Theme
                    </p>
                    <h3 className="mt-0.5 text-lg font-black capitalize text-slate-900 tracking-tight">
                        {selectedTemplate.name} Template
                    </h3>
                </div>

                <div className="pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex items-center">
                    <AnimatePresence mode="wait">
                        {isSaving ? (
                            <motion.span
                                key="saving"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100"
                            >
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Updating layout preference...
                            </motion.span>
                        ) : (
                            <motion.span
                                key="saved"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60"
                            >
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                Changes synchronized automatically
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
}