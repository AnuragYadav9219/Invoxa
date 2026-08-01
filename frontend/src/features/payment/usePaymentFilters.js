import { useEffect } from "react";
import { useFilterPaymentsMutation, useGetAllPaymentsQuery } from "./paymentApi";

export default function usePaymentFilters({
    page,
    size,
    search,
    method,
    sort,
}) {
    const isFilterActive =
        (search && search.trim() !== "") ||
        (method && method !== "ALL");

    const query = useGetAllPaymentsQuery(
        { page, size },
        {
            skip: isFilterActive,
        }
    );

    const [
        filterPayments,
        {
            data: filteredData,
            isLoading: isFiltering,
            isError,
            error,
        },
    ] = useFilterPaymentsMutation();

    useEffect(() => {
        if (!isFilterActive) return;

        filterPayments({
            page,
            size,
            filter: {
                search: search || undefined,
                method:
                    method && method !== "ALL"
                        ? method
                        : undefined,
                sort: sort || "date_desc",
            },
        });
    }, [
        page,
        size,
        search,
        method,
        sort,
        isFilterActive,
        filterPayments,
    ]);

    const data = isFilterActive ? filteredData : query.data;

    return {
        payments: data?.content ?? [],
        totalPages: data?.totalPages ?? 1,
        totalElements: data?.totalElements ?? 0,

        isLoading: query.isLoading || isFiltering,
        isFetching: query.isFetching || isFiltering,
        isError: query.isError || isError,
        error: query.error || error,
        refetch: query.refetch,
    };
}