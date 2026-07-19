import { useEffect, useState } from "react";

import { mapInvoice } from "../invoiceMapper";
import InvoiceRenderer from "./InvoiceRenderer";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function InvoicePdfPage() {

    console.log(window.location.search);

    const params = new URLSearchParams(window.location.search);

    console.log(params.toString());
    console.log("invoiceId =", params.get("invoiceId"));
    console.log("token =", params.get("token"));
    console.log("template =", params.get("template"));

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