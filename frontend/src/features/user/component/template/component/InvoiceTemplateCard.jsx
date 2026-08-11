import { memo } from "react";
import { Eye, CheckCircle2, Sparkles, Crown, Lock, ArrowUpRight } from "lucide-react";
import { sampleInvoice } from "@/features/user/sampleInvoice";
import InvoiceRenderer from "@/features/invoice/pages/InvoiceRenderer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function InvoiceTemplateCard({
    template,
    selectedTemplate,
    onPreview,
    onSelect,
    unlocked,
}) {
    const navigate = useNavigate();
    const isSelected =
        String(selectedTemplate).trim().toLowerCase() === String(template?.id).trim().toLowerCase();

    return (
        <motion.div variants={itemVariants} className="h-full">
            <div
                className={`group relative flex flex-col h-full overflow-hidden rounded-[24px] border transition-all duration-300 hover:-translate-y-1.5
                    ${unlocked
                        ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
                        : "bg-slate-50/90 opacity-95"
                    }
                    ${isSelected
                        ? "border-indigo-600/80 shadow-[0_12px_35px_rgba(79,70,229,0.15)] ring-4 ring-indigo-50"
                        : "border-slate-200/90 hover:border-indigo-300/80"
                    }`}
            >
                {/* ================= PREVIEW CONTAINER ================= */}
                <div className={`relative flex h-52 sm:h-60 md:h-68 w-full items-start justify-center overflow-hidden transition-colors ${isSelected ? "bg-indigo-50/50" : "bg-slate-100/70"
                    }`}>

                    {/* Subtle Dot Matrix Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] bg-size-[16px_16px] opacity-30" />

                    {/* Locked State Overlay */}
                    {!unlocked && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/65 backdrop-blur-md p-6 text-center transition-all">
                            {/* Plan Badge Inside Overlay */}
                            <div className="mb-3.5">
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-lg
                                        ${template.minimumPlan === "BUSINESS"
                                            ? "bg-amber-500 text-white shadow-amber-500/20"
                                            : "bg-violet-600 text-white shadow-violet-600/20"
                                        }`}
                                >
                                    {template.minimumPlan === "BUSINESS" ? (
                                        <>
                                            <Crown className="h-3.5 w-3.5" />
                                            Business Plan
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-3.5 w-3.5" />
                                            Pro Plan
                                        </>
                                    )}
                                </span>
                            </div>

                            {/* Lock Icon */}
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/15 text-white shadow-xl backdrop-blur-sm">
                                <Lock className="h-5 w-5" />
                            </div>

                            <p className="font-semibold text-white text-sm tracking-tight">
                                Exclusive Template
                            </p>

                            <p className="mt-1 text-xs text-slate-300 font-normal max-w-50">
                                Upgrade to <span className="text-white font-medium underline decoration-indigo-400 underline-offset-2">{template.minimumPlan}</span> to unlock this style
                            </p>
                        </div>
                    )}

                    {/* Active Highlight Badge */}
                    {isSelected && (
                        <div className="absolute right-4 top-4 z-20 animate-in fade-in zoom-in-95 duration-300">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md shadow-indigo-600/30">
                                <Sparkles size={12} className="animate-pulse" />
                                Active Template
                            </span>
                        </div>
                    )}

                    {/* Top-Left Plan Badge (Restored) */}
                    {template.minimumPlan !== "FREE" && (
                        <div className="absolute left-4 top-4 z-25">
                            <span
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md transition-all
                                    ${unlocked
                                        ? template.minimumPlan === "BUSINESS"
                                            ? "bg-amber-500/90 text-white border border-amber-400/30 shadow-amber-500/20"
                                            : "bg-violet-600/90 text-white border border-violet-500/30 shadow-violet-600/20"
                                        : "bg-slate-900/80 text-white border border-white/15"
                                    }`}
                            >
                                {unlocked ? (
                                    template.minimumPlan === "BUSINESS" ? (
                                        <>
                                            <Crown size={13} className="text-amber-200" />
                                            Business
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={13} className="text-violet-200" />
                                            Pro
                                        </>
                                    )
                                ) : (
                                    <>
                                        <Lock size={13} className="text-slate-300" />
                                        {template.minimumPlan}
                                    </>
                                )}
                            </span>
                        </div>
                    )}

                    {/* Scaled Invoice Document Wrapper */}
                    <div
                        className={`mt-7 rounded-xl bg-white shadow-2xl transition-transform duration-500 group-hover:scale-[0.26] sm:group-hover:scale-[0.28] md:group-hover:scale-[0.32] pointer-events-none origin-top scale-[0.23] sm:scale-[0.25] md:scale-[0.29] ${isSelected ? "ring-4 ring-indigo-500/20" : "ring-1 ring-slate-900/10"
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

                    {/* Smooth Gradient Fade at Bottom */}
                    <div className={`absolute inset-x-0 bottom-0 h-16 bg-linear-to-t to-transparent ${isSelected ? "from-indigo-50/90" : "from-slate-100/90"
                        }`} />
                </div>

                {/* ================= DETAILS & ACTIONS ================= */}
                <div className="flex flex-1 flex-col justify-between border-t border-slate-100/80 p-5 sm:p-6 bg-white relative z-10">
                    <div className="mb-6 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {template.name}
                            </h3>
                        </div>

                        <p className="line-clamp-2 text-xs font-normal leading-relaxed text-slate-500">
                            {template.description}
                        </p>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="group/btn flex items-center justify-center h-11 w-full rounded-xl cursor-pointer font-medium text-xs border border-slate-200/90 text-slate-700 bg-white shadow-2xs hover:bg-slate-50/80 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-95"
                            onClick={onPreview}
                        >
                            <Eye className="mr-1.5 h-4 w-4 text-slate-400 group-hover/btn:text-slate-600 transition-colors" />
                            Preview
                        </button>

                        <button
                            type="button"
                            disabled={isSelected}
                            onClick={() => {
                                if (isSelected) return;

                                if (!unlocked) {
                                    navigate("/settings?tab=subscription");
                                    return;
                                }

                                onSelect(template.id);
                            }}
                            className={`flex items-center justify-center h-11 w-full rounded-xl font-medium text-xs transition-all shadow-xs
                                ${isSelected
                                    ? "cursor-default border border-emerald-200 bg-emerald-50 text-emerald-700 pointer-events-none font-semibold"
                                    : unlocked
                                        ? "cursor-pointer bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-indigo-500/25 shadow-md active:scale-95 font-semibold"
                                        : "cursor-pointer border border-amber-200/80 bg-amber-50/80 text-amber-800 hover:bg-amber-100 font-semibold"
                                }`}
                        >
                            {isSelected ? (
                                <>
                                    <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" />
                                    Activated
                                </>
                            ) : unlocked ? (
                                <>
                                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                                    Activate
                                </>
                            ) : (
                                <>
                                    <ArrowUpRight className="mr-1.5 h-4 w-4" />
                                    Upgrade
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default memo(InvoiceTemplateCard);