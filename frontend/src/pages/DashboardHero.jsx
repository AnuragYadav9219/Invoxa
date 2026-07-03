import { useMemo } from "react";
import {
    Store,
    CalendarDays,
    MapPin,
    TrendingUp,
    Receipt,
    Users,
    IndianRupee,
    ArrowUpRight,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useGetProfileQuery } from "@/features/user/userApi";
import { useGetCustomerSummaryQuery } from "@/features/invoice/invoiceApi";

export default function DashboardHero({ stats }) {
    const { data, isLoading: profileLoading } = useGetProfileQuery();
    const user = data?.data;

    const { data: customers = [], isLoading, isFetching } =
        useGetCustomerSummaryQuery();

    const totalCustomers = customers.length;

    // const filtered = customers.filter((c) =>
    //     c.name?.toLowerCase()
    // );

    const change = stats.revenueChangePercent ?? 0;
    const isProfit = change >= 0;

    const greeting = useMemo(() => {
        const hour = new Date().getHours();

        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    }, []);

    const today = formatDate(new Date());

    return (
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-slate-200 bg-linear-to-r from-sky-50 via-white to-indigo-50 shadow-lg">

            {/* Background */}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,.10),transparent_35%)]" />

            <div className="absolute -right-20 -top-20 h-56 w-56 md:h-72 md:w-72 rounded-full bg-sky-300/20 blur-3xl" />

            <div className="absolute -left-20 bottom-0 h-52 w-52 md:h-60 md:w-60 rounded-full bg-indigo-300/20 blur-3xl" />

            <div className="relative z-10 p-4 sm:p-6 lg:p-8">

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 lg:gap-8">

                    {/* Left */}

                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">

                        {/* Logo */}

                        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-md shrink-0">

                            <Store
                                size={28}
                                className="text-indigo-600 sm:h-9 sm:w-9"
                            />

                        </div>

                        {/* Shop Info */}

                        <div className="min-w-0">

                            <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                                {greeting}
                            </span>

                            <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 wrap-break-word">
                                {user?.shopName}
                            </h1>

                            <p className="mt-1 text-sm sm:text-base text-slate-500">
                                Welcome back! Here's what's happening today.
                            </p>

                            <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-sm text-slate-500">

                                <div className="flex items-center gap-2">
                                    <CalendarDays size={16} className="text-indigo-600" />
                                    <span>{today}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-rose-600" />
                                    {profileLoading ? (
                                        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                                    ) : (
                                        <p>{user?.address || "Address not available"}</p>
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Right */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full xl:max-w-lg">

                        {/* Revenue */}

                        <div className="rounded-2xl border border-white/60 bg-white/70 p-4 sm:p-5 backdrop-blur-xl shadow-sm">

                            <div className="flex items-center justify-between">

                                <p className="text-sm font-medium text-slate-500">
                                    Revenue
                                </p>

                                <div className="rounded-full bg-emerald-100 p-2">

                                    <TrendingUp
                                        size={16}
                                        className="text-emerald-600"
                                    />

                                </div>

                            </div>

                            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 break-all">
                                {formatCurrency(stats?.totalRevenue)}
                            </h2>

                            <div
                                className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs sm:text-sm font-medium ${isProfit
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-red-50 text-red-600"
                                    }`}
                            >
                                <ArrowUpRight
                                    size={14}
                                    className={isProfit ? "" : "rotate-180"}
                                />

                                {Math.abs(change).toFixed(1)}% from last month
                            </div>

                        </div>

                        {/* Summary */}

                        <div className="rounded-2xl border border-white/60 bg-white/70 p-4 sm:p-5 backdrop-blur-xl shadow-sm">

                            <p className="text-sm font-medium text-slate-500">
                                Business Summary
                            </p>

                            <div className="mt-4 space-y-3">

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="rounded-lg bg-indigo-100 p-2">

                                            <Receipt
                                                size={16}
                                                className="text-indigo-600"
                                            />

                                        </div>

                                        <span className="text-sm text-slate-600">
                                            Invoices
                                        </span>

                                    </div>

                                    <span className="font-semibold text-slate-900">
                                        {stats?.totalInvoices || 0}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="rounded-lg bg-cyan-100 p-2">

                                            <Users
                                                size={16}
                                                className="text-cyan-600"
                                            />

                                        </div>

                                        <span className="text-sm text-slate-600">
                                            Customers
                                        </span>

                                    </div>

                                    {isLoading || isFetching ? (
    <div className="h-5 w-10 animate-pulse rounded bg-slate-200" />
) : (
    <span className="font-semibold text-slate-900">
        {totalCustomers}
    </span>
)}

                                    {/* <span className="font-semibold text-slate-900">
                                        {filtered.length || 0}
                                    </span> */}

                                </div>

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="rounded-lg bg-amber-100 p-2">

                                            <IndianRupee
                                                size={16}
                                                className="text-amber-600"
                                            />

                                        </div>

                                        <span className="text-sm text-slate-600">
                                            Pending
                                        </span>

                                    </div>

                                    <span className="font-semibold text-slate-900 break-all text-right">
                                        {formatCurrency(stats.totalPending)}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}