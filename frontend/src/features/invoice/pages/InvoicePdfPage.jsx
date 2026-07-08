// import { useEffect } from "react";
// import { useParams } from "react-router-dom";

// import { useGetPdfInvoiceQuery, useGetPdfShopQuery } from "../invoicePdfApi";
// import { mapInvoice } from "../invoiceMapper";
// import InvoiceRenderer from "./InvoiceRenderer";

// export default function InvoicePdfPage() {
//     const { invoiceId } = useParams();


//     useEffect(() => {
//         const ready = async () => {
//             if (document.fonts) {
//                 await document.fonts.ready;
//             }

//             requestAnimationFrame(() => {
//                 requestAnimationFrame(() => {
//                     window.__PDF_READY__ = true;
//                 });
//             });
//         };

//         ready();
//     }, []);

//     const {
//         data: invoice,
//         isLoading: invoiceLoading,
//     } = useGetPdfInvoiceQuery(invoiceId);

//     const {
//         data: shop,
//         isLoading: shopLoading,
//     } = useGetPdfShopQuery(invoice?.shopId, {
//         skip: !invoice?.shopId,
//     });

//     const loading = invoiceLoading || shopLoading;

//     if (loading) {
//         return (
//             <div className="flex min-h-screen items-center justify-center">
//                 Loading...
//             </div>
//         );
//     }

//     if (!invoice || !shop) {
//         return (
//             <div className="flex min-h-screen items-center justify-center">
//                 Invoice not found
//             </div>
//         );
//     }

//     const data = mapInvoice(invoice, shop, null);

//     return (
//         <div id="invoice-root">
            
//             {console.log(invoice)}
//             {console.log(shop)}

//             <InvoiceRenderer
//                 template={invoice.template || shop.invoiceTemplate || data.shop.invoiceTemplate}
//                 data={data}
//             />
//         </div>
//     );
// }
























import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { useGetPdfInvoiceQuery, useGetPdfShopQuery } from "../invoicePdfApi";
import { mapInvoice } from "../invoiceMapper";
import InvoiceRenderer from "./InvoiceRenderer";

export default function InvoicePdfPage() {

    const { invoiceId } = useParams();

    useEffect(() => {
        window.__PDF_READY__ = false;
    }, []);

    const {
        data: invoice,
        isLoading: invoiceLoading,
    } = useGetPdfInvoiceQuery(invoiceId);

    const {
        data: shop,
        isLoading: shopLoading,
    } = useGetPdfShopQuery(invoice?.shopId, {
        skip: !invoice?.shopId,
    });

    const loading = invoiceLoading || shopLoading;

    useEffect(() => {

        if (loading) return;
        if (!invoice || !shop) return;

        const ready = async () => {

            if (document.fonts) {
                await document.fonts.ready;
            }

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.__PDF_READY__ = true;
                });
            });
        };

        ready();

    }, [loading, invoice, shop]);

    const [searchParams] = useSearchParams();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading invoice...
            </div>
        );
    }

    if (!invoice || !shop) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Invoice not found
            </div>
        );
    }

    console.log("Invoice =", invoice);
    console.log("Shop =", shop);

    console.log("Invoice Template =", invoice.template);
    console.log("Shop Template =", shop.invoiceTemplate);

    const data = mapInvoice(invoice, shop, null);

    const template =
        searchParams.get("template")
        || invoice.template 
        || shop.invoiceTemplate 
        || "classic";

    return (
        <div id="invoice-root">

            <InvoiceRenderer
                template={template}
                data={data}
            />

        </div>
    );
}