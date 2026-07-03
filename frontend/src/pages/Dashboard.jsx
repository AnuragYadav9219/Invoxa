import DashboardSkeleton from "@/components/loaders/DashboardSkeleton";
import Spinner from "@/components/loaders/Spinner";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDashboardQuery } from "@/features/dashboard/dashboardApi";
import InvoiceTable from "@/features/invoice/components/InvoiceTable";
import { useGetRecentInvoiceQuery } from "@/features/invoice/invoiceApi";
import { formatCurrency } from "@/utils/formatters";
import {
    Clock,
    AlertTriangle,
    FileText,
    TrendingUp,
    Wallet,
    IndianRupee,
} from "lucide-react";
import { useEffect, useState } from "react";
import DashboardHero from "./DashboardHero";

export default function Dashboard() {
    const { data: dashboardData, isLoading: dashboardLoading } = useGetDashboardQuery();

    const stats = dashboardData || {};

    const {
        data: invoiceData,
        isLoading: invoicesLoading,
        isFetching: invoicesFetching,
    } = useGetRecentInvoiceQuery(5);

    const invoices = invoiceData || [];

    if (dashboardLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden">

            <div className="fixed inset-0 -z-10 bg-linear-to-br from-indigo-100 via-white to-white" />

            <div className="fixed top-0 right-0 w-96 h-96 bg-indigo-300 opacity-20 blur-3xl rounded-full -z-10" />
            <div className="fixed bottom-0 left-0 w-96 h-96 bg-green-300 opacity-20 blur-3xl rounded-full -z-10" />

            {/* CONTENT */}
            <div className="p-4 space-y-6">
                {/* HEADER */}
                <DashboardHero stats={stats} />

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                    <StatCard
                        title="Total Invoices"
                        value={stats.totalInvoices || 0}
                        icon={<FileText size={20} />}
                    />

                    <StatCard
                        title="Paid"
                        value={stats.paidInvoices || 0}
                        icon={<TrendingUp size={20} />}
                        color="green"
                    />

                    <StatCard
                        title="Pending"
                        value={stats.pendingInvoices || 0}
                        icon={<Clock size={20} />}
                        color="yellow"
                    />

                    <StatCard
                        title="Overdue"
                        value={stats.overdueInvoices || 0}
                        icon={<AlertTriangle size={20} />}
                        color="red"
                    />

                    <StatCard
                        title="Revenue"
                        value={stats.totalRevenue || 0}
                        icon={<IndianRupee size={20} />}
                        color="green"
                        isCurrency
                    />

                    <StatCard
                        title="Pending Amount"
                        value={stats.totalPending || 0}
                        icon={<Wallet size={20} />}
                        color="yellow"
                        isCurrency
                    />

                    <StatCard
                        title="Overdue Amount"
                        value={stats.totalOverdue || 0}
                        icon={<AlertTriangle size={20} />}
                        color="red"
                        isCurrency
                    />

                </div>

                {/* TABLE */}
                <Card>
                    <CardContent className="p-5 space-y-4">

                        {/* HEADER */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                Recent Invoices
                            </h2>

                            {invoicesFetching && (
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <Spinner size={16} />
                                    Updating...
                                </div>
                            )}
                        </div>

                        {/* TABLE */}
                        <div className="relative">
                            <InvoiceTable
                                invoices={invoices}
                                isLoading={invoicesLoading}
                                limit={5}
                                showActions={false}
                            />

                            {invoicesFetching && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
                                    <Spinner size={24} />
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

/* ================= STAT CARD ================= */

function StatCard({ title, value, icon, color = "green", isCurrency = false }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = Number(value) || 0;
        const duration = 800;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(start);
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    const colors = {
        green: {
            bg: "bg-green-100",
            text: "text-green-600",
            glow: "hover:shadow-green-200",
            gradient: "from-green-400 to-green-600",
        },
        yellow: {
            bg: "bg-yellow-100",
            text: "text-yellow-600",
            glow: "hover:shadow-yellow-200",
            gradient: "from-yellow-400 to-yellow-600",
        },
        red: {
            bg: "bg-red-100",
            text: "text-red-600",
            glow: "hover:shadow-red-200",
            gradient: "from-red-400 to-red-600",
        },
    };

    const theme = colors[color] || colors.green;

    return (
        <Card className={`group relative overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme.glow}`}>

            {/* Gradient Hover Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-linear-to-r ${theme.gradient} blur-xl transition`} />

            <CardContent className="p-5 flex items-center justify-between relative z-10">

                <div>
                    <p className="text-sm text-gray-500">{title}</p>

                    <h2 className="text-2xl font-bold mt-1 tracking-tight">
                        {isCurrency
                            ? formatCurrency(displayValue)
                            : Math.floor(displayValue)}
                    </h2>
                </div>

                <div className={`p-3 rounded-xl ${theme.bg} ${theme.text} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}