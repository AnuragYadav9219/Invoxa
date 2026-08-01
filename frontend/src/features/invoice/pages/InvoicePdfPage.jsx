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

        // window.javaTime?.();

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

                // console.time("Fetch Invoice");

                const response = await fetch(
                    `${API_BASE_URL}/public/print/${invoiceId}`,
                    {
                        headers: {
                            "X-Print-Token": token
                        },
                        signal: controller.signal
                    }
                );

                // console.timeEnd("Fetch Invoice");

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

            // console.log("PDF READY");

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