
// import { useEffect, useState } from "react";

// import { mapInvoice } from "../invoiceMapper";
// import InvoiceRenderer from "./InvoiceRenderer";

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// export default function InvoicePdfPage() {
//     console.log("Rendering InvoicePdfPage");

//     useEffect(() => {
//         window.javaTime?.();
//     }, []);

//     useEffect(() => {
//         console.log("Mounted");
//     }, []);

//     console.log(location.href);
//     console.log(performance.now());

//     const params = new URLSearchParams(window.location.search);

//     const invoiceId = params.get("invoiceId");
//     const token = params.get("token");
//     const templateParam = params.get("template");

//     console.log("invoiceId =", invoiceId);
//     console.log("token =", token);
//     console.log("template =", templateParam);

//     const [invoice, setInvoice] = useState(null);
//     const [shop, setShop] = useState(null);

//     const [isLoading, setIsLoading] = useState(true);
//     const [isError, setIsError] = useState(false);

//     useEffect(() => {
//         return () => {
//             console.log("UNMOUNTED");
//         };
//     }, []);

//     console.log(
//         "Navigation:",
//         performance.getEntriesByType("navigation")[0]
//     );

//     useEffect(() => {

//         window.__PDF_READY__ = false;

//         return () => {
//             window.__PDF_READY__ = false;
//         };

//     }, []);

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

//             } catch (error) {

//                 console.error(error);

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

//     useEffect(() => {

//         let cancelled = false;

//         async function markReady() {

//             if (
//                 isLoading ||
//                 isError ||
//                 !invoice ||
//                 !shop
//             ) {
//                 return;
//             }

//             console.time("PDF Ready");

//             try {

//                 if (document.fonts) {
//                     await document.fonts.ready;
//                 }

//                 await new Promise(requestAnimationFrame);
//                 await new Promise(requestAnimationFrame);

//             } finally {

//                 console.timeEnd("PDF Ready");

//                 if (!cancelled) {
//                     window.__PDF_READY__ = true;
//                     console.log("PDF READY");
//                 }

//             }

//         }

//         markReady();

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

    const [invoice, setInvoice] = useState(null);
    const [shop, setShop] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    // Tell Playwright when JS actually starts
    useEffect(() => {
        window.javaTime?.();
    }, []);

    // Initialize ready flag
    useEffect(() => {

        window.__PDF_READY__ = false;

        return () => {
            window.__PDF_READY__ = false;
        };

    }, []);

    // Fetch invoice
    useEffect(() => {

        let cancelled = false;

        async function loadInvoice() {

            try {

                if (!invoiceId || !token) {
                    throw new Error("Missing invoiceId or token.");
                }

                console.time("Fetch Invoice");

                const response = await fetch(
                    `${API_BASE_URL}/public/print/${invoiceId}`,
                    {
                        headers: {
                            "X-Print-Token": token,
                        },
                    }
                );

                console.timeEnd("Fetch Invoice");

                if (!response.ok) {
                    throw new Error("Failed to load invoice");
                }

                const json = await response.json();

                if (cancelled) return;

                setInvoice(json.data.invoice);
                setShop(json.data.shop);

            } catch (err) {

                console.error(err);

                if (!cancelled) {
                    setIsError(true);
                }

            } finally {

                if (!cancelled) {
                    setIsLoading(false);
                }

            }

        }

        loadInvoice();

        return () => {
            cancelled = true;
        };

    }, [invoiceId, token]);

    // Wait until invoice is completely rendered
    useEffect(() => {

        if (isLoading || isError || !invoice || !shop) {
            return;
        }

        let cancelled = false;

        async function ready() {

            console.time("PDF Ready");

            try {

                // Wait for React render
                await new Promise(requestAnimationFrame);
                await new Promise(requestAnimationFrame);

                // Wait for fonts
                if (document.fonts) {
                    await document.fonts.ready;
                }

                // Wait another frame
                await new Promise(requestAnimationFrame);

                // Ensure invoice DOM exists
                const root = document.getElementById("invoice-root");

                if (!root) {
                    throw new Error("invoice-root not found");
                }

                if (root.offsetHeight === 0) {
                    throw new Error("invoice-root not rendered");
                }

                if (!cancelled) {
                    window.__PDF_READY__ = true;
                    console.log("PDF READY");
                }

            } finally {

                console.timeEnd("PDF Ready");

            }

        }

        ready();

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

    console.time("Map Invoice");

    const dataModel = mapInvoice(invoice, shop, null);

    console.timeEnd("Map Invoice");

    const template =
        templateParam ||
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