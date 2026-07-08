import { memo } from "react";
import { Eye, CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { sampleInvoice } from "@/features/user/sampleInvoice";
import InvoiceRenderer from "@/features/invoice/pages/InvoiceRenderer";

function InvoiceTemplateCard({
    template,
    selectedTemplate,
    onPreview,
    onSelect,
}) {
    const isSelected = selectedTemplate === template.id;

    return (
        <Card className="overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-all">

            {/* Preview */}
            <div className="relative h-72 overflow-hidden bg-slate-100">

                {/* Selected Badge */}
                {isSelected && (
                    <Badge className="absolute right-3 top-3 z-20">
                        Current
                    </Badge>
                )}

                {/* Invoice */}
                <div
                    className="origin-top-left pointer-events-none"
                    style={{
                        transform: "scale(.23)",
                        width: "210mm",
                    }}
                >
                    <InvoiceRenderer
                        template={template.id}
                        data={sampleInvoice}
                    />
                </div>

            </div>

            {/* Footer */}
            <div className="space-y-4 p-4">
                <div>
                    <h3 className="font-semibold">
                        {template.name}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {template.description}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => onPreview(template.id)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </Button>

                    <Button
                        className="flex-1"
                        disabled={isSelected}
                        onClick={() => onSelect(template.id)}
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {isSelected
                            ? "Selected"
                            : "Use"}
                    </Button>

                </div>
            </div>
        </Card>
    );
}

export default memo(InvoiceTemplateCard);