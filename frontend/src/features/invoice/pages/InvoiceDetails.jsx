import { useParams } from "react-router-dom";

import InvoiceRenderer from "./InvoiceRenderer";
import PageLoader from "@/components/loaders/PageLoader";
import useInvoiceData from "../useInvoiceData";
import { mapInvoice } from "../invoiceMapper";

export default function InvoiceDetails() {
  const { id } = useParams();

  const {
    invoice,
    shop,
    user,
    isLoading,
    error,
  } = useInvoiceData(id);

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

  // Later this can come from user settings/API
  const selectedTemplate = "corporate";

  return (
    <InvoiceRenderer
      template={selectedTemplate}
      data={data}
    />
  );
}