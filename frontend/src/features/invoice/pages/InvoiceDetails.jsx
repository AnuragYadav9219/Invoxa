import { useParams } from "react-router-dom";

import InvoiceRenderer from "./InvoiceRenderer";
import PageLoader from "@/components/loaders/PageLoader";
import useInvoiceData from "../useInvoiceData";
import { mapInvoice } from "../invoiceMapper";
import InvoiceToolbar from "./InvoiceToolbar";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutTemplate, Sparkles } from "lucide-react";
import { templateData } from "@/features/user/component/template/data/templateData";

export default function InvoiceDetails() {
  const { id } = useParams();

  const {
    invoice,
    shop,
    user,
    isLoading,
    error,
    downloadPDF,
  } = useInvoiceData(id);

  const [selectedTemplate, setSelectedTemplate] = useState(
    shop?.invoiceTemplate?.toLowerCase() || "classic"
  );

  useEffect(() => {
    if (shop?.invoiceTemplate ) {
      setSelectedTemplate(shop.invoiceTemplate.toLowerCase());
    }
  }, [shop]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !invoice) {
    return (
      <div className="p-6 text-center text-gray-500">
        Invoice not found
      </div>
    );
  }

  if (!invoice || !user) {
    return <PageLoader />;
  }

  const data = mapInvoice(invoice, shop, user);

  return (
    <div className="min-h-screen bg-slate-100 py-4 md:py-6">

      {/* ================= HEADER ================= */}
      <div className="mx-auto mb-6 w-full max-w-[210mm] px-3">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-4 md:p-5 lg:flex-row lg:items-end lg:justify-between">

            {/* Template Selector */}
            <div className="w-full lg:max-w-sm">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-white">
                  <LayoutTemplate className="h-5 w-5 text-slate-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Invoice Template
                  </p>

                  <Select
                    value={selectedTemplate}
                    onValueChange={setSelectedTemplate}
                  >
                    <SelectTrigger className="h-9 border-0 bg-transparent px-0 shadow-none focus:ring-0">
                      <SelectValue placeholder="Choose Template" />
                    </SelectTrigger>

                    <SelectContent className="max-h-80">

                      {templateData.map((template) => {
                        const Icon = template.icon;

                        return (
                          <SelectItem
                            key={template.id}
                            value={template.id}
                            className="py-2"
                          >
                            <div className="flex items-start gap-1.5">
                              <div>
                                <Icon className="h-4 w-4 text-slate-600" />
                              </div>

                              <div className="min-w-0">
                                <p className="font-medium leading-none">
                                  {template.name}
                                </p>
                              </div>

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

          {/* Bottom Info */}
          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />

              <span>
                Template changes affect only the preview and downloaded PDF.
              </span>
            </div>

            <span className="text-xs font-medium text-slate-400">
              Invoice data remains unchanged.
            </span>
          </div>
        </div>
      </div>

      {/* ================= INVOICE ================= */}

      <div
        id="invoice-root"
        className="mx-auto w-full"
      >
        <InvoiceRenderer
          template={selectedTemplate}
          data={data}
        />
      </div>

    </div>
  );
}