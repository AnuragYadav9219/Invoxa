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
        <Card
            className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary/50 ${isSelected
                ? "border-primary shadow-md shadow-primary/10 ring-2 ring-primary/20 bg-linear-to-b from-card to-primary/2"
                : "border-border/60 shadow-sm hover:shadow-md"
                }`}
        >
            {/* ================= PREVIEW CONTAINER ================= */}
            <div className="relative flex h-48 w-full items-start justify-center overflow-hidden bg-linear-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950/50 sm:h-56 md:h-64">

                {/* Decorative Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[1.5rem_1.5rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)]" />

                {/* Highlight Badge */}
                {isSelected && (
                    <Badge
                        variant="default"
                        className="absolute right-3 top-3 z-20 shadow-sm animate-in fade-in zoom-in-95 duration-200"
                    >
                        Active Template
                    </Badge>
                )}

                {/* Scaled Invoice Document Wrapper */}
                <div
                    className={`mt-4 rounded-lg bg-white shadow-xl transition-transform duration-300 group-hover:scale-[0.24] sm:group-hover:scale-[0.26] md:group-hover:scale-[0.30] pointer-events-none origin-top scale-[0.22] sm:scale-[0.24] md:scale-[0.28] ${isSelected ? "ring-2 ring-primary/40" : ""
                        }`}
                    style={{
                        transformOrigin: "top center",
                        width: "210mm",
                        height: "297mm",
                    }}
                >
                    <InvoiceRenderer
                        template={template.id}
                        data={sampleInvoice}
                    />
                </div>

                {/* Subtle bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-slate-50/80 to-transparent dark:from-slate-950/80" />
            </div>

            {/* ================= DETAILS & ACTIONS ================= */}
            <div className="flex flex-1 flex-col justify-between border-t border-border/50 p-4 sm:p-5">
                <div className="mb-4 space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                            {template.name}
                        </h3>
                        {isSelected && (
                            <span className="flex h-2 w-2 rounded-full bg-primary" />
                        )}
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {template.description}
                    </p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-full rounded-xl cursor-pointer font-medium shadow-sm hover:bg-secondary/80"
                        onClick={() => onPreview(template.id)}
                    >
                        <Eye className="mr-1.5 h-4 w-4 opacity-70" />
                        Preview
                    </Button>

                    <Button
                        size="sm"
                        variant={isSelected ? "secondary" : "default"}
                        className={`h-9 w-full rounded-xl font-medium cursor-pointer shadow-sm transition-all ${isSelected
                            ? "cursor-default border border-primary/20 bg-primary/10 text-primary hover:bg-primary/10"
                            : "hover:opacity-90"
                            }`}
                        disabled={isSelected}
                        onClick={() => onSelect(template.id)}
                    >
                        <CheckCircle2 className={`mr-1.5 h-4 w-4 ${isSelected ? "text-primary fill-primary/10" : "opacity-90"}`} />
                        {isSelected ? "Active" : "Activate"}
                    </Button>
                </div>
            </div>
        </Card>
    );
}

export default memo(InvoiceTemplateCard);