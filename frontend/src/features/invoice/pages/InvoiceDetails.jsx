import { useNavigate, useParams } from "react-router-dom";

import InvoiceRenderer from "./InvoiceRenderer";
import PageLoader from "@/components/loaders/PageLoader";
import useInvoiceData from "../useInvoiceData";
import { mapInvoice } from "../invoiceMapper";
import InvoiceToolbar from "./InvoiceToolbar";
import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, LayoutTemplate, Lock, Sparkles, ShieldCheck } from "lucide-react";
import { templateData } from "@/features/user/component/template/data/templateData";
import { useGetSubscriptionDashboardQuery } from "@/features/subscription/subscriptionApi";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    invoice,
    shop,
    user,
    isLoading,
    downloadPDF,
  } = useInvoiceData(id);

  const { data: subscription } = useGetSubscriptionDashboardQuery();

  const [selectedTemplate, setSelectedTemplate] = useState(
    shop?.invoiceTemplate?.toLowerCase() || "classic"
  );

  useEffect(() => {
    if (shop?.invoiceTemplate) {
      setSelectedTemplate(shop.invoiceTemplate.toLowerCase());
    }
  }, [shop]);

  const templates = useMemo(() => {
    return templateData.map((localTemplate) => {
      const serverTemplate = subscription?.templates?.find(
        t => t.code.toLowerCase() === localTemplate.id.toLowerCase()
      );

      return {
        ...localTemplate,
        minimumPlan: serverTemplate?.minimumPlan ?? "FREE",
        accessible: serverTemplate?.accessible ?? true,
      };
    });
  }, [subscription]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!invoice || !user) {
    return <PageLoader />;
  }

  const data = mapInvoice(invoice, shop, user);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100/80 via-slate-100 to-slate-200/50 py-6 md:py-8">

      {/* ================= HEADER ================= */}
      <div className="mx-auto mb-6 w-full max-w-[210mm] px-3 sm:px-0">
        <div className="rounded-[24px] border border-slate-200/80 bg-white shadow-[0_10px_30px_rgb(0,0,0,0.03)] backdrop-blur-xl overflow-hidden">
          <div className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Template Selector */}
            <div className="w-full lg:max-w-sm">
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition-all hover:bg-slate-50 hover:border-slate-300">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white shadow-xs text-indigo-600">
                  <LayoutTemplate className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Active Invoice Style
                  </p>

                  <Select
                    value={selectedTemplate}
                    onValueChange={(value) => {
                      const template = templates.find(t => t.id === value);

                      if (!template) return;

                      if (!template.accessible) {
                        navigate("/settings?tab=subscription");
                        return;
                      }

                      setSelectedTemplate(value);
                    }}
                  >
                    <SelectTrigger className="h-8 border bg-transparent p-0 px-2 border-gray-500 cursor-pointer shadow-none focus:ring-0 text-slate-900 font-semibold text-sm">
                      <SelectValue placeholder="Choose Template" />
                    </SelectTrigger>

                    <SelectContent className="max-h-80 rounded-2xl p-1 shadow-2xl border-slate-200">
                      {templates.map((template) => {
                        return (
                          <SelectItem
                            key={template.id}
                            value={template.id}
                            disabled={!template.accessible}
                            className="rounded-xl py-2.5 px-3 my-0.5 focus:bg-indigo-50/70 focus:text-indigo-900 transition-colors"
                          >
                            <div className="flex items-center justify-between cursor-pointer w-full gap-3">
                              <div className="flex items-center gap-2.5">
                                <template.icon className="h-4 w-4 text-slate-500" />
                                <span className="font-medium text-xs sm:text-sm">{template.name}</span>
                              </div>

                              {template.minimumPlan !== "FREE" && (
                                template.accessible ? (
                                  template.minimumPlan === "BUSINESS" ? (
                                    <span className="flex items-center gap-1 bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                      <Crown className="h-3 w-3 text-amber-500" /> Business
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 bg-violet-500/10 text-violet-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                      <Sparkles className="h-3 w-3 text-violet-500" /> Pro
                                    </span>
                                  )
                                ) : (
                                  <span className="flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                    <Lock className="h-3 w-3 text-slate-400" /> Locked
                                  </span>
                                )
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex w-full justify-end lg:w-auto">
              <InvoiceToolbar
                invoice={invoice}
                selectedTemplate={selectedTemplate}
                downloadPDF={downloadPDF}
              />
            </div>
          </div>

          {/* Bottom Info Banner */}
          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
              <span className="font-medium text-slate-700">
                Template customization applies instantly to live previews & downloaded PDFs.
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Core invoice data stays safe and untouched.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= INVOICE ================= */}
      <div
        id="invoice-root"
        className="mx-auto w-full transition-all duration-300"
      >
        <InvoiceRenderer
          template={selectedTemplate}
          data={data}
        />
      </div>

    </div>
  );
}