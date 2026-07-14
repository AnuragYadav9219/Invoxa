import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LayoutTemplate } from "lucide-react";
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    useGetShopQuery,
    useUpdateInvoiceTemplateMutation,
} from "@/features/shop/shopApi";
import InvoiceTemplateGrid from "../template/component/InvoiceTemplateGrid";

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
        {
            isLoading: isSaving,
        },
    ] = useUpdateInvoiceTemplateMutation();

    useEffect(() => {
        if (shop?.invoiceTemplate) {
            setSelectedTemplate(
                shop.invoiceTemplate.toLowerCase()
            );
        }
    }, [shop]);

    const handleTemplateChange = async (template) => {

        if (template === selectedTemplate) {
            return;
        }

        try {

            await updateInvoiceTemplate({
                shopId,
                invoiceTemplate: template.toUpperCase(),
            }).unwrap();

            setSelectedTemplate(template);

            toast.success("Invoice template updated successfully.");

            refetch();

        } catch (error) {

            toast.error(
                error?.data?.message ||
                "Failed to update invoice template."
            );

        }

    };

    if (isLoading) {
        return (
            <Card className="rounded-2xl shadow-sm">
                <CardContent className="flex h-72 items-center justify-center">
                    <div className="space-y-3 text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <p className="text-sm text-muted-foreground">
                            Loading templates...
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                            <LayoutTemplate className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                            <CardTitle>
                                Invoice Templates
                            </CardTitle>

                            <CardDescription>
                                Choose the default template for all newly created invoices.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Gallery */}
            <InvoiceTemplateGrid
                currentTemplate={selectedTemplate}
                onTemplateChange={handleTemplateChange}
            />

            {/* Footer */}
            <Card className="rounded-2xl shadow-sm">
                <CardContent className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Current Template
                        </p>

                        <h3 className="mt-1 text-lg font-semibold capitalize">
                            {selectedTemplate}
                        </h3>
                    </div>

                    <div>
                        {isSaving ? (
                            <span className="text-sm text-primary">
                                Saving...
                            </span>
                        ) : (
                            <span className="text-sm text-emerald-600 font-medium">
                                ✓ Changes saved automatically
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}