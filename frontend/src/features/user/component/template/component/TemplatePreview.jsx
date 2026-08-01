import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { CheckCircle2, LayoutTemplate, Lock, X } from "lucide-react";

import InvoiceRenderer from "@/features/invoice/pages/InvoiceRenderer";
import { sampleInvoice } from "@/features/user/sampleInvoice";
import { useNavigate } from "react-router-dom";

export default function TemplatePreview({
    open,
    template,
    accessible,
    onClose,
    onUseTemplate,
}) {
    const navigate = useNavigate();
    if (!template) return null;

    return (
        <Dialog
            open={open}
            onOpenChange={onClose}
        >
            <DialogContent className="max-w-[95vw] lg:max-w-6xl h-[92vh] sm:h-[88vh] p-0 bg-slate-900 border border-slate-800 flex flex-col rounded-3xl shadow-2xl overflow-hidden">

                {/* Top Accent Gradient Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 z-50" />

                {/* Header */}
                <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                            <LayoutTemplate size={20} />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-black text-slate-900 tracking-tight capitalize">
                                {template.name} Template Preview
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Live sample rendering of the selected invoice design layout.
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                {/* Invoice Canvas Area */}
                <div className="flex-1 overflow-auto bg-slate-100/80 p-4 sm:p-8 flex justify-center items-start">
                    <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl border border-slate-200/80 overflow-hidden">
                        <InvoiceRenderer
                            template={template.id}
                            data={sampleInvoice}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 bg-white px-6 py-4 flex items-center justify-between gap-4 shrink-0">
                    <p className="text-xs font-medium text-slate-400 hidden sm:block">
                        You can switch or customize this layout anytime from settings.
                    </p>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="cursor-pointer h-11 px-5 rounded-xl border-slate-200 hover:bg-slate-50 font-semibold text-xs transition-all"
                        >
                            Close Preview
                        </Button>

                        <Button
                            onClick={() => {
                                if (template.accessible) {
                                    onUseTemplate(template.id);
                                } else {
                                    onClose(); 
                                    navigate("/settings?tab=subscription");
                                }
                            }}
                            className={`h-11 px-6 font-bold rounded-xl shadow-lg transition-all text-xs active:scale-95
                                ${template.accessible
                                    ? "cursor-pointer bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/20"
                                    : "cursor-pointer bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                                }`}
                        >
                            {template.accessible ? (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Use This Template
                                </>
                            ) : (
                                <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Upgrade to {template.minimumPlan}
                                </>
                            )}
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}