import ClassicInvoice from "../templates/ClassicInvoice";
import CorporateInvoice from "../templates/CorporateInvoice";
import MinimalInvoice from "../templates/MinimalInvoice";
import ModernInvoice from "../templates/ModernInvoice";

export default function InvoiceRenderer({ template, data }) {
    switch (template) {
        case 'classic':
            return <ClassicInvoice data={data} />;

        case 'modern':
            return <ModernInvoice data={data} />;

        case 'minimal':
            return <MinimalInvoice data={data} />;

        case 'corporate':
            return <CorporateInvoice data={data} />;

        default:
            return <ClassicInvoice data={data} />;
    }
}