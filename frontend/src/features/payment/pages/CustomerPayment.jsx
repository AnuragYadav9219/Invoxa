import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetPublicInvoiceQuery } from '../paymentApi';
import Spinner from '@/components/loaders/Spinner';
import { AlertTriangle } from 'lucide-react';
import CustomerInvoiceCard from '../components/CustomerInvoiceCard';

export default function CustomerPayment() {
    const { paymentToken } = useParams();

    const {
        data: invoice,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetPublicInvoiceQuery(paymentToken);

    if (isLoading || isFetching) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (isError || !invoice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
                <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
                    <AlertTriangle
                        className="mx-auto text-red-500"
                        size={60}
                    />

                    <h2 className="text-2xl font-bold mt-4">
                        Invoice Not Found
                    </h2>

                    <p className="text-gray-500 mt-3">
                        This payment link is invalid or has expired.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50 to-slate-100 py-10 px-4">
            <CustomerInvoiceCard
                invoice={invoice}
                refetch={refetch}
            />
        </div>
    )
}
