import { useState, useEffect } from "react";
import { LayoutTemplate } from "lucide-react";
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import InvoiceTemplateGrid from "./components/InvoiceTemplateGrid";

import {
    useGetShopQuery,
    useUpdateInvoiceTemplateMutation,
} from "@/features/shop/shopApi";

import { useSelector } from "react-redux";

export default function InvoiceTemplateTab() {
    const user = useSelector((state) => state.auth.user);
    const shopId = user?.shopId;

    const { data: shopResponse, isLoading, refetch } = useGetShopQuery(shopId, {
        skip: !shopId,
    });

    const shop = shopResponse?.data;

    const [selectedTemplate, setSelectedTemplate] = useState("classic");

    const [updateInvoiceTemplate, { isLoading: isSaving }] =
        useUpdateInvoiceTemplateMutation();

    console.log(shop)

    useEffect(() => {
        console.log("Invoice Template:", shop?.invoiceTemplate);

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

            await refetch();

            setSelectedTemplate(template);

            toast.success("Invoice template updated successfully.");
        } catch (error) {
            toast.error("Failed to update invoice template.");
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-10 text-center">
                    Loading templates...
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="rounded-2xl">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                            <LayoutTemplate className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                            <CardTitle>
                                Invoice Templates
                            </CardTitle>

                            <CardDescription>
                                Choose the default template used for all new invoices.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <InvoiceTemplateGrid
                currentTemplate={selectedTemplate}
                onTemplateChange={handleTemplateChange}
            />

            <Card>
                <CardContent className="flex items-center justify-between py-5">
                    <div>
                        <h3 className="font-medium">
                            Current Template
                        </h3>

                        <p className="text-sm text-muted-foreground capitalize">
                            {selectedTemplate}
                        </p>
                    </div>

                    <Button
                        disabled
                        variant="secondary"
                    >
                        {isSaving
                            ? "Saving..."
                            : "Saved Automatically"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}