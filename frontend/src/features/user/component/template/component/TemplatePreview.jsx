import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { CheckCircle2 } from "lucide-react";

import InvoiceRenderer from "@/features/invoice/pages/InvoiceRenderer";
import { sampleInvoice } from "@/features/user/sampleInvoice";

export default function TemplatePreview({
    open,
    template,
    onClose,
    onUseTemplate,
}) {

    if (!template) return null;
    return (
        <Dialog
            open={open}
            onOpenChange={onClose}
        >
            <DialogContent className="max-w-[95vw] lg:max-w-7xl h-[95vh] p-0 overflow-hidden">

                {/* Header */}
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle className="capitalize">
                        {template} Template
                    </DialogTitle>

                    <DialogDescription>
                        Preview this invoice template before selecting it.
                    </DialogDescription>
                </DialogHeader>

                {/* Invoice */}
                <div className="flex-1 overflow-auto bg-slate-100 p-8">
                    <InvoiceRenderer
                        template={template}
                        data={sampleInvoice}
                    />
                </div>

                {/* Footer */}
                <div className="border-t bg-white px-6 py-4 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Close
                    </Button>

                    <Button
                        onClick={() => onUseTemplate(template)}
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Use This Template
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    );
}