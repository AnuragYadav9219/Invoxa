import { useEffect, useMemo, useState } from "react";
import { useGetInvoicesQuery } from "@/features/invoice/invoiceApi";

/* ================= DEBOUNCE ================= */
const useDebounce = (value, delay = 500) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return debounced;
};

/* ================= MAIN HOOK ================= */
export default function useInvoiceFilters({
    page = 0,
    size = 10,
    externalStatus,
    externalSort,
    search: externalSearch,
    fromDate,
    toDate,
}) {
    const finalSearch = externalSearch ?? "";
    const debouncedSearch = useDebounce(finalSearch.trim(), 500);

    /* ================= SORT MAPPING ================= */
    const sortValue = useMemo(() => {
        switch (externalSort) {
            case "DATE_ASC":
                return "dueDate,asc";
            case "DATE_DESC":
                return "dueDate,desc";
            case "AMOUNT_DESC":
                return "totalAmount,desc";
            case "AMOUNT_ASC":
                return "totalAmount,asc";
            case "PAID_DESC":
                return "paidAmount,desc";
            case "PAID_ASC":
                return "paidAmount,asc";
            case "REMAINING_DESC":
                return "remainingAmount,desc";
            case "REMAINING_ASC":
                return "remainingAmount,asc";
            default:
                return "dueDate,desc";
        }
    }, [externalSort]);

    /* ================= FINAL QUERY PARAMS ================= */
    const queryParams = useMemo(() => ({
        page,
        size,
        search: debouncedSearch.length > 0 ? debouncedSearch : null,
        status: externalStatus === "ALL" ? null : externalStatus, 
        fromDate: fromDate || null,
        toDate: toDate || null,
        sort: sortValue,
    }), [page, debouncedSearch, externalStatus, fromDate, toDate, sortValue]);

    /* ================= RTK QUERY ================= */
    const {
        data,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetInvoicesQuery(queryParams, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
        skip: false,
    });

    return {
        invoices: data?.content || [],
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
        isLoading,
        isFetching,
        error,
        refetch,
    };
}