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
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-gray-500">
                    Overview of your business performance
                </p>
            </div>

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
                    value={formatCurrency(stats.totalRevenue)}
                    icon={<IndianRupee size={20} />}
                    color="green"
                />

                <StatCard
                    title="Pending Amount"
                    value={formatCurrency(stats.totalPending)}
                    icon={<Wallet size={20} />}
                    color="yellow"
                />

                <StatCard
                    title="Overdue Amount"
                    value={formatCurrency(stats.totalOverdue)}
                    icon={<AlertTriangle size={20} />}
                    color="red"
                />

            </div>

            {/* TABLE */}
            <Card>
                <CardContent className="p-5 space-y-4">

                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Recent Invoices
                            </h2>
                        </div>

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

                        {/* OVERLAY SPINNER */}
                        {invoicesFetching && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
                                <Spinner size={24} />
                            </div>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}

/* ================= STAT CARD ================= */

function StatCard({ title, value, icon, color }) {
    const colors = {
        green: "bg-green-100 text-green-600",
        yellow: "bg-yellow-100 text-yellow-600",
        red: "bg-red-100 text-red-600",
    };

    return (
        <Card className="shadow-sm hover:shadow-md transition rounded-2xl">
            <CardContent className="p-4 flex items-center justify-between">

                {/* TEXT */}
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h2 className="text-2xl font-bold mt-1">{value}</h2>
                </div>

                {/* ICON */}
                <div
                    className={`p-3 rounded-xl ${colors[color] || "bg-gray-100 text-gray-600"
                        }`}
                >
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}