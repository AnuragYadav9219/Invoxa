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
            <div className="min-h-screen bg-slate-100/70 flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (isError || !invoice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100/70 p-6">
                <div className="bg-slate-50 border border-slate-200/90 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] p-8 w-full max-w-md text-center space-y-4">
                    <div className="inline-flex p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 shadow-2xs">
                        <AlertTriangle size={32} />
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Invoice Not Found
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            This payment link is invalid or has expired.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100/70 py-10 px-4 flex items-center justify-center">
            <CustomerInvoiceCard
                invoice={invoice}
                refetch={refetch}
            />
        </div>
    )
}