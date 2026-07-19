// import { useEffect } from "react";
// import { useParams, useSearchParams } from "react-router-dom";

// import {
//     useGetPdfInvoiceQuery,
//     useGetPdfShopQuery,
// } from "../invoicePdfApi";

// import { mapInvoice } from "../invoiceMapper";
// import InvoiceRenderer from "./InvoiceRenderer";

// export default function InvoicePdfPage() {

//     const { invoiceId } = useParams();
//     const [searchParams] = useSearchParams();
//     const token = searchParams.get("token");

//     // Reset PDF ready flag
//     useEffect(() => {
//         window.__PDF_READY__ = false;
//     }, []);

//     const {
//         data: invoice,
//         isLoading: invoiceLoading,
//         isError: invoiceError,
//     } = useGetPdfInvoiceQuery({
//         invoiceId,
//         token,
//     });

//     const {
//         data: shop,
//         isLoading: shopLoading,
//         isError: shopError,
//     } = useGetPdfShopQuery(invoice?.shopId, {
//         skip: !invoice?.shopId,
//     });

//     const loading = invoiceLoading || shopLoading;

//     useEffect(() => {
//         console.log("Invoice:", invoice);
//         console.log("Shop:", shop);
//         console.log("Loading:", loading);
//         console.log("Invoice Error:", invoiceError);
//         console.log("Shop Error:", shopError);
//     }, [loading, invoice, shop, invoiceError, shopError]);

//     // useEffect(() => {
//     //     if (!loading && invoice && shop) {
//     //         console.log("Setting PDF READY");
//     //         window.__PDF_READY__ = true;
//     //     }
//     // }, [loading, invoice, shop]);

//     useEffect(() => {
//         let cancelled = false;

//         const markReady = async () => {

//             if (loading || invoiceError || shopError || !invoice || !shop) {
//                 return;
//             }

//             console.time("PDF Ready");

//             try {

//                 console.time("Fonts");
//                 if (document.fonts) {
//                     await document.fonts.ready;
//                 }
//                 console.timeEnd("Fonts");

//                 console.time("RAF 1");
//                 await new Promise(requestAnimationFrame);
//                 console.timeEnd("RAF 1");

//                 console.time("RAF 2");
//                 await new Promise(requestAnimationFrame);
//                 console.timeEnd("RAF 2");

//             } finally {

//                 console.timeEnd("PDF Ready");

//                 if (!cancelled) {
//                     console.log("Setting PDF READY");
//                     window.__PDF_READY__ = true;
//                 }
//             }
//         };

//         markReady();

//         return () => {
//             cancelled = true;
//         };

//     }, [loading, invoiceError, shopError, invoice, shop]);

//     if (loading) {
//         return (
//             <div className="flex min-h-screen items-center justify-center">
//                 Loading invoice...
//             </div>
//         );
//     }

//     if (invoiceError || shopError || !invoice || !shop) {
//         return (
//             <div className="flex min-h-screen items-center justify-center">
//                 Invoice not found
//             </div>
//         );
//     }

//     const data = mapInvoice(invoice, shop, null);

//     const template =
//         searchParams.get("template") ||
//         invoice.template ||
//         shop.invoiceTemplate ||
//         "classic";

//     return (
//         <div id="invoice-root">
//             <InvoiceRenderer
//                 template={template}
//                 data={data}
//             />
//         </div>
//     );
// }


















import { useEffect, useState } from "react";

import { mapInvoice } from "../invoiceMapper";
import InvoiceRenderer from "./InvoiceRenderer";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function InvoicePdfPage() {

    const params = new URLSearchParams(window.location.search);

    const invoiceId = params.get("invoiceId");
    const token = params.get("token");

    const [invoice, setInvoice] = useState(null);
    const [shop, setShop] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        window.__PDF_READY__ = false;
    }, []);

    useEffect(() => {

        async function loadInvoice() {

            try {

                const response = await fetch(
                    `${API_BASE_URL}/public/print/${invoiceId}`,
                    {
                        headers: {
                            "X-Print-Token": token,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load invoice");
                }

                const json = await response.json();

                setInvoice(json.data.invoice);
                setShop(json.data.shop);

            } catch (error) {

                console.error(error);
                setIsError(true);

            } finally {

                setIsLoading(false);

            }
        }

        loadInvoice();

    }, [invoiceId, token]);

    useEffect(() => {

        let cancelled = false;

        async function markReady() {

            if (
                isLoading ||
                isError ||
                !invoice ||
                !shop
            ) {
                return;
            }

            console.time("PDF Ready");

            try {

                if (document.fonts) {
                    await document.fonts.ready;
                }

                await new Promise(requestAnimationFrame);
                await new Promise(requestAnimationFrame);

            } finally {

                console.timeEnd("PDF Ready");

                if (!cancelled) {
                    window.__PDF_READY__ = true;
                }

            }

        }

        markReady();

        return () => {
            cancelled = true;
        };

    }, [isLoading, isError, invoice, shop]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading invoice...
            </div>
        );
    }

    if (isError || !invoice || !shop) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Invoice not found
            </div>
        );
    }

    const dataModel = mapInvoice(invoice, shop, null);

    const template =
        params.get("template") ||
        invoice.template ||
        shop.invoiceTemplate ||
        "classic";

    return (
        <div id="invoice-root">
            <InvoiceRenderer
                template={template}
                data={dataModel}
            />
        </div>
    );
}