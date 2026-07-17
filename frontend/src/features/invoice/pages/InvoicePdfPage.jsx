import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import {
    useGetPdfInvoiceQuery,
    useGetPdfShopQuery,
} from "../invoicePdfApi";

import { mapInvoice } from "../invoiceMapper";
import InvoiceRenderer from "./InvoiceRenderer";

export default function InvoicePdfPage() {

    const { invoiceId } = useParams();

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    // Reset every render
    useEffect(() => {
        window.__PDF_READY__ = false;
    }, []);

    const {
        data: invoice,
        isLoading: invoiceLoading,
        isError: invoiceError,
    } = useGetPdfInvoiceQuery({
        invoiceId,
        token,
    });

    const {
        data: shop,
        isLoading: shopLoading,
        isError: shopError,
    } = useGetPdfShopQuery(invoice?.shopId, {
        skip: !invoice?.shopId,
    });

    const loading = invoiceLoading || shopLoading;

    useEffect(() => {

        const markReady = async () => {

            if (document.fonts) {
                await document.fonts.ready;
            }

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.__PDF_READY__ = true;
                    console.log("PDF READY");
                });
            });
        };

        if (
            !loading &&
            !invoiceError &&
            !shopError &&
            invoice &&
            shop
        ) {
            markReady();
        }
    }, [loading, invoiceError, shopError, invoice, shop]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading invoice...
            </div>
        );
    }

    if (invoiceError || shopError || !invoice || !shop) {

        return (
            <div className="flex min-h-screen items-center justify-center">
                Invoice not found
            </div>
        );
    }

    const data = mapInvoice(invoice, shop, null);

    const template =
        searchParams.get("template") ||
        invoice.template ||
        shop.invoiceTemplate ||
        "classic";

    return (
        <div id="invoice-root">
            <InvoiceRenderer
                template={template}
                data={data}
            />
        </div>
    );
}