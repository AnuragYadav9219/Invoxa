import { useSelector } from "react-redux";
import { useDownloadInvoicePDFMutation, useGetInvoiceByIdQuery } from "./invoiceApi";
import { useGetShopQuery } from "../shop/shopApi";

export default function useInvoiceData(id) {

    const user = useSelector(state => state.auth.user);

    const {
        data: invoice,
        isLoading,
        error
    } = useGetInvoiceByIdQuery(id);

    const {
        data: shopData
    } = useGetShopQuery(user?.shopid, {
        skip: !user?.shopid
    });

    const shop = shopData?.data;

    const [downloadPDF, {
        isLoading: isDownloading
    }] = useDownloadInvoicePDFMutation();

    return {
        invoice,
        shop,
        user,
        isLoading,
        error,
        downloadPDF,
        isDownloading
    };
}