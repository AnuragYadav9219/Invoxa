import { useState } from "react";
import {
    Clock,
    AlertTriangle,
    FileText,
    TrendingUp,
    Wallet,
    IndianRupee,
    Filter,
    Calendar,
} from "lucide-react";

import DashboardSkeleton from "@/components/loaders/DashboardSkeleton";
import Spinner from "@/components/loaders/Spinner";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import DashboardHero from "./DashboardHero";
import RevenueChart from "@/features/dashboard/components/RevenueChart";
import InvoiceTable from "@/features/invoice/components/InvoiceTable";

import { useGetDashboardQuery } from "@/features/dashboard/dashboardApi";
import { useGetRecentInvoiceQuery } from "@/features/invoice/invoiceApi";
import StatCard from "@/features/dashboard/components/StatCard";
import StatCardCompact from "@/features/dashboard/components/StatCardCompact";
import InvoiceDistributionChart from "@/features/dashboard/components/InvoiceDistributionChart";
import { FallbackPage } from "@/components/errorWrapper/components";

export default function Dashboard() {
    const [days, setDays] = useState("30");

    const { data: dashboardData, isLoading: dashboardLoading, } = useGetDashboardQuery(Number(days));

    const stats = dashboardData || {};

    const {
        data: invoiceData,
        isLoading: invoicesLoading,
        isFetching: invoicesFetching,
        isError: invoicesError,
        refetch: refetchInvoices,
    } = useGetRecentInvoiceQuery(5);

    const invoices = invoiceData || [];

    if (dashboardLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col bg-slate-50/50 dark:bg-slate-950">
            {/* Background Ambience Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-indigo-500/10 blur-[140px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-150 h-150 bg-emerald-500/10 blur-[140px] rounded-full" />
            </div>

            <div className="w-full flex-1 md:p-6 space-y-6">

                {/* HERO SECTION */}
                <div className="w-full bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/60 dark:border-slate-800 backdrop-blur-md shadow-2xs">
                    <DashboardHero stats={stats} />
                </div>

                {/* METRICS & OVERVIEW SECTION */}
                <div className="space-y-4">

                    {/* Integrated Action Header & Range Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/50 dark:bg-slate-900/50 p-3 px-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 backdrop-blur-xs">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                                    Dashboard Overview
                                </h2>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Financial performance for selected timeline
                                </p>
                            </div>
                        </div>

                        {/* Filter Dropdown */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                <Filter size={13} />
                                <span>Period:</span>
                            </div>
                            <Select value={days} onValueChange={setDays}>
                                <SelectTrigger className="w-40 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-2xs font-medium text-xs rounded-xl h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                                    <SelectItem value="7">Last 7 Days</SelectItem>
                                    <SelectItem value="30">Last 30 Days</SelectItem>
                                    <SelectItem value="90">Last 90 Days</SelectItem>
                                    <SelectItem value="365">Last Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Primary Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Revenue"
                            value={stats.totalRevenue || 0}
                            icon={<IndianRupee size={22} />}
                            color="indigo"
                            isCurrency
                            trend={`${Math.abs(stats.revenueChangePercent ?? 0).toFixed(1)}%`}
                            trendUp={(stats.revenueChangePercent ?? 0) >= 0}
                            description="Compared to previous period"
                        />
                        <StatCard
                            title="Pending Amount"
                            value={stats.totalPending || 0}
                            icon={<Wallet size={22} />}
                            color="amber"
                            isCurrency
                            trend="Awaiting pay"
                            description="Invoices sent"
                        />
                        <StatCard
                            title="Overdue Amount"
                            value={stats.totalOverdue || 0}
                            icon={<AlertTriangle size={22} />}
                            color="rose"
                            isCurrency
                            trend="Requires action"
                            trendUp={false}
                            description="Past due date"
                        />
                        <StatCard
                            title="Total Invoices"
                            value={stats.totalInvoices || 0}
                            icon={<FileText size={22} />}
                            color="slate"
                            description="Generated total"
                        />
                    </div>

                    {/* Compact Status Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCardCompact
                            title="Paid Invoices"
                            value={stats.paidInvoices || 0}
                            icon={<TrendingUp size={18} />}
                            color="emerald"
                            total={stats.totalInvoices || 1}
                        />
                        <StatCardCompact
                            title="Pending Invoices"
                            value={stats.pendingInvoices || 0}
                            icon={<Clock size={18} />}
                            color="amber"
                            total={stats.totalInvoices || 1}
                        />
                        <StatCardCompact
                            title="Overdue Invoices"
                            value={stats.overdueInvoices || 0}
                            icon={<AlertTriangle size={18} />}
                            color="rose"
                            total={stats.totalInvoices || 1}
                        />
                    </div>
                </div>

                {/* CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
                    <div className="lg:col-span-7 h-full">
                        <RevenueChart days={Number(days)} />
                    </div>

                    <div className="lg:col-span-3 h-full">
                        <InvoiceDistributionChart dashboard={stats} />
                    </div>
                </div>

                {/* RECENT INVOICES TABLE */}
                <Card className="w-full border border-slate-200/80 dark:border-slate-800 shadow-2xs rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                    Recent Invoices
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Latest active billing transactions across system
                                </p>
                            </div>

                            {invoicesFetching && (
                                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-full">
                                    <Spinner size={14} />
                                    Refreshing...
                                </div>
                            )}
                        </div>

                        <div className="relative min-h-55 w-full overflow-x-auto">
                            {invoicesError ? (
                                <FallbackPage
                                    variant="server"
                                    title="Unable to load recent invoices"
                                    description="Please try again."
                                    retry={refetchInvoices}
                                    showHome={false}
                                />) : (
                                <InvoiceTable
                                    invoices={invoices}
                                    isLoading={invoicesLoading}
                                    limit={5}
                                    showActions={false}
                                />
                            )}

                            {invoicesFetching && !invoicesLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300 rounded-xl">
                                    <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                                        <Spinner size={20} />
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                            Updating table...
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}