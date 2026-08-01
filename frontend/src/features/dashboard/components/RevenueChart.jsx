import React from 'react';
import { useGetRevenueTrendQuery } from '../dashboardApi';
import Spinner from '@/components/loaders/Spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp } from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function RevenueChart({ days = 30 }) {
    const { data = [], isLoading, isFetching } = useGetRevenueTrendQuery(Number(days));

    const totalPeriodRevenue = data.reduce((acc, curr) => acc + (curr.revenue || 0), 0);

    if (isLoading) {
        return <ChartSkeleton />;
    }

    return (
        <Card className="w-full border h-full border-slate-200/80 dark:border-slate-800 shadow-2xs rounded-2xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col justify-between">
            {/* HEADER WITH CONTROLS */}
            <CardHeader className="p-5 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60">
                <div>
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            Revenue Analytics
                        </CardTitle>
                        {isFetching && (
                            <span className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full">
                                <Spinner size={12} />
                                Updating
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Total for selected timeframe:{" "}
                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                            {formatCurrency(totalPeriodRevenue)}
                        </span>
                    </p>
                </div>

            </CardHeader>

            {/* CHART CONTAINER */}
            <CardContent className="p-5 pt-6 h-85 w-full">
                {data.length === 0 ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 text-sm">
                        <TrendingUp className="mb-2 opacity-40" size={32} />
                        <span>No revenue data available for this timeframe</span>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                        >
                            <defs>
                                {/* Revenue Gradient */}
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                                </linearGradient>

                                {/* Volume Gradient */}
                                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e2e8f0"
                                className="dark:stroke-slate-800"
                            />

                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                                dy={10}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                tickFormatter={(val) =>
                                    val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`
                                }
                            />

                            <Tooltip content={<CustomTooltip />} />

                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#6366f1"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                animationDuration={1200}
                                animationEasing="ease-in-out"
                                activeDot={{
                                    r: 6,
                                    fill: "#4f46e5",
                                    stroke: "#ffffff",
                                    strokeWidth: 2,
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

/* ================= CUSTOM TOOLTIP COMPONENT ================= */

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;

    return (
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs space-y-1.5">
            <p className="font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                {label}
            </p>

            <div className="flex items-center justify-between gap-4">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Revenue
                </span>

                <span className="font-bold text-slate-900 dark:text-slate-50">
                    {formatCurrency(data.revenue || 0)}
                </span>
            </div>
        </div>
    );
}

/* ================= LOADING SKELETON ================= */

function ChartSkeleton() {
    return (
        <Card className="w-full border border-slate-200/80 dark:border-slate-800 shadow-2xs rounded-2xl p-5 space-y-4 bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center pb-2">
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
                    <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
                </div>
                <div className="h-8 w-36 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            </div>
            <div className="h-80 w-full bg-slate-50 dark:bg-slate-950/50 rounded-xl flex items-center justify-center">
                <Spinner size={24} />
            </div>
        </Card>
    );
}