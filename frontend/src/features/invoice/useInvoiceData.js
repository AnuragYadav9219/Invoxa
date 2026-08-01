import { useSelector } from "react-redux";
import { useDownloadInvoicePDFMutation, useGetInvoiceByIdQuery } from "./invoiceApi";
import { useGetShopQuery } from "../shop/shopApi";

export default function useInvoiceData(id) {

    const user = useSelector(state => state.auth.user);

    const {
        data: invoice,
        isLoading,
        isError,
        refetch,
        error
    } = useGetInvoiceByIdQuery(id);

    const {
        data: shopData
    } = useGetShopQuery(user?.shopId, {
        skip: !user?.shopId
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
        isError,
        refetch,
        error,
        downloadPDF,
        isDownloading
    };
}