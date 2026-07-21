// import { useEffect, useState } from "react";

// import { mapInvoice } from "../invoiceMapper";
// import InvoiceRenderer from "./InvoiceRenderer";

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// export default function InvoicePdfPage() {

//     const params = new URLSearchParams(window.location.search);

//     const invoiceId = params.get("invoiceId");
//     const token = params.get("token");
//     const templateParam = params.get("template");

//     const [invoice, setInvoice] = useState(null);
//     const [shop, setShop] = useState(null);

//     const [isLoading, setIsLoading] = useState(true);
//     const [isError, setIsError] = useState(false);

//     // Tell Playwright when JS actually starts
//     useEffect(() => {
//         window.javaTime?.();
//     }, []);

//     // Initialize ready flag
//     useEffect(() => {

//         window.__PDF_READY__ = false;

//         return () => {
//             window.__PDF_READY__ = false;
//         };

//     }, []);

//     // Fetch invoice
//     useEffect(() => {

//         let cancelled = false;

//         async function loadInvoice() {

//             try {

//                 if (!invoiceId || !token) {
//                     throw new Error("Missing invoiceId or token.");
//                 }

//                 console.time("Fetch Invoice");

//                 const response = await fetch(
//                     `${API_BASE_URL}/public/print/${invoiceId}`,
//                     {
//                         headers: {
//                             "X-Print-Token": token,
//                         },
//                     }
//                 );

//                 console.timeEnd("Fetch Invoice");

//                 if (!response.ok) {
//                     throw new Error("Failed to load invoice");
//                 }

//                 const json = await response.json();

//                 if (cancelled) return;

//                 setInvoice(json.data.invoice);
//                 setShop(json.data.shop);

//             } catch (err) {

//                 console.error(err);

//                 if (!cancelled) {
//                     setIsError(true);
//                 }

//             } finally {

//                 if (!cancelled) {
//                     setIsLoading(false);
//                 }

//             }

//         }

//         loadInvoice();

//         return () => {
//             cancelled = true;
//         };

//     }, [invoiceId, token]);

//     // Wait until invoice is completely rendered
//     useEffect(() => {

//         if (isLoading || isError || !invoice || !shop) {
//             return;
//         }

//         let cancelled = false;

//         async function ready() {

//             console.time("PDF Ready");

//             try {

//                 // Wait for React render
//                 await new Promise(requestAnimationFrame);
//                 await new Promise(requestAnimationFrame);

//                 // Wait for fonts
//                 if (document.fonts) {
//                     await document.fonts.ready;
//                 }

//                 // Wait another frame
//                 await new Promise(requestAnimationFrame);

//                 // Ensure invoice DOM exists
//                 const root = document.getElementById("invoice-root");

//                 if (!root) {
//                     throw new Error("invoice-root not found");
//                 }

//                 if (root.offsetHeight === 0) {
//                     throw new Error("invoice-root not rendered");
//                 }

//                 if (!cancelled) {
//                     window.__PDF_READY__ = true;
//                     console.log("PDF READY");
//                 }

//             } finally {

//                 console.timeEnd("PDF Ready");

//             }

//         }

//         ready();

//         return () => {
//             cancelled = true;
//         };

//     }, [isLoading, isError, invoice, shop]);

//     if (isLoading) {
//         return (
//             <div className="flex min-h-screen items-center justify-center">
//                 Loading invoice...
//             </div>
//         );
//     }

//     if (isError || !invoice || !shop) {
//         return (
//             <div className="flex min-h-screen items-center justify-center">
//                 Invoice not found
//             </div>
//         );
//     }

//     console.time("Map Invoice");

//     const dataModel = mapInvoice(invoice, shop, null);

//     console.timeEnd("Map Invoice");

//     const template =
//         templateParam ||
//         invoice.template ||
//         shop.invoiceTemplate ||
//         "classic";

//     return (
//         <div id="invoice-root">
//             <InvoiceRenderer
//                 template={template}
//                 data={dataModel}
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

    const templateParam = params.get("template");

    const [state, setState] = useState({
        loading: true,
        error: null,
        invoice: null,
        shop: null
    });

    useEffect(() => {

        window.__PDF_READY__ = false;
        window.__PDF_ERROR__ = null;

        window.javaTime?.();

        return () => {

            window.__PDF_READY__ = false;
            window.__PDF_ERROR__ = null;

        };

    }, []);

    useEffect(() => {

        let cancelled = false;

        const controller = new AbortController();

        async function load() {

            try {

                if (!invoiceId || !token) {
                    throw new Error("Missing invoiceId or token");
                }

                console.time("Fetch Invoice");

                const response = await fetch(
                    `${API_BASE_URL}/public/print/${invoiceId}`,
                    {
                        headers: {
                            "X-Print-Token": token
                        },
                        signal: controller.signal
                    }
                );

                console.timeEnd("Fetch Invoice");

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const json = await response.json();

                if (cancelled) return;

                setState({
                    loading: false,
                    error: null,
                    invoice: json.data.invoice,
                    shop: json.data.shop
                });

            }

            catch (e) {

                console.error(e);

                if (cancelled) return;

                window.__PDF_ERROR__ = e.message;

                setState({
                    loading: false,
                    error: e.message,
                    invoice: null,
                    shop: null
                });

            }

        }

        load();

        return () => {

            cancelled = true;
            controller.abort();

        };

    }, [invoiceId, token]);

    useEffect(() => {

        if (
            state.loading ||
            state.error ||
            !state.invoice ||
            !state.shop
        ) {
            return;
        }

        requestAnimationFrame(() => {

            const root = document.getElementById("invoice-root");

            if (!root) {

                window.__PDF_ERROR__ = "invoice-root missing";

                return;

            }

            if (root.offsetHeight === 0) {

                window.__PDF_ERROR__ = "invoice-root empty";

                return;

            }

            window.__PDF_READY__ = true;

            console.log("PDF READY");

        });

    }, [state]);

    if (state.loading) {

        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading invoice...
            </div>
        );

    }

    if (state.error) {

        return (
            <div className="flex min-h-screen items-center justify-center">
                Invoice not found
            </div>
        );

    }

    const data = mapInvoice(
        state.invoice,
        state.shop,
        null
    );

    return (

        <div id="invoice-root">

            <InvoiceRenderer
                template={
                    templateParam ||
                    state.invoice.template ||
                    state.shop.invoiceTemplate ||
                    "classic"
                }
                data={data}
            />

        </div>

    );

}