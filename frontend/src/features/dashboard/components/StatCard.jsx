import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

const THEMES = {
    indigo: {
        bg: "bg-indigo-50 dark:bg-indigo-950/40",
        text: "text-indigo-600 dark:text-indigo-400",
        border: "hover:border-indigo-200 dark:hover:border-indigo-800",
        indicator: "bg-indigo-500",
    },
    emerald: {
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "hover:border-emerald-200 dark:hover:border-emerald-800",
        indicator: "bg-emerald-500",
    },
    amber: {
        bg: "bg-amber-50 dark:bg-amber-950/40",
        text: "text-amber-600 dark:text-amber-400",
        border: "hover:border-amber-200 dark:hover:border-amber-800",
        indicator: "bg-amber-500",
    },
    rose: {
        bg: "bg-rose-50 dark:bg-rose-950/40",
        text: "text-rose-600 dark:text-rose-400",
        border: "hover:border-rose-200 dark:hover:border-rose-800",
        indicator: "bg-rose-500",
    },
    slate: {
        bg: "bg-slate-100 dark:bg-slate-800",
        text: "text-slate-700 dark:text-slate-300",
        border: "hover:border-slate-300 dark:hover:border-slate-700",
        indicator: "bg-slate-500",
    },
};

export default function StatCard({
    title,
    value,
    icon,
    color = "indigo",
    isCurrency = false,
    trend,
    trendUp,
    description,
}) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let animationFrameId;
        let startTimestamp = null;
        const endValue = Number(value) || 0;
        const duration = 600;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setDisplayValue(progress * endValue);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step);
            }
        };

        animationFrameId = requestAnimationFrame(step);

        return () => cancelAnimationFrame(animationFrameId);
    }, [value]);

    const theme = useMemo(() => THEMES[color] || THEMES.indigo, [color]);

    const formattedValue = useMemo(() => {
        return isCurrency
            ? formatCurrency(displayValue)
            : Math.floor(displayValue).toLocaleString();
    }, [displayValue, isCurrency]);

    return (
        <Card
            className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${theme.border}`}
        >
            {/* Top Accent Stripe */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${theme.indicator} opacity-80`} />

            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                        {title}
                    </span>
                    <div
                        className={`p-2.5 rounded-xl ${theme.bg} ${theme.text} transition-transform duration-300 group-hover:scale-105`}
                    >
                        {icon}
                    </div>
                </div>

                <div>
                    <div className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        {formattedValue}
                    </div>

                    {(trend || description) && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs">
                            {trend && (
                                <span
                                    className={`inline-flex items-center font-semibold ${trendUp === true
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : trendUp === false
                                                ? "text-rose-600 dark:text-rose-400"
                                                : "text-slate-500"
                                        }`}
                                >
                                    {trendUp === true && <ArrowUpRight size={14} />}
                                    {trendUp === false && <ArrowDownRight size={14} />}
                                    {trend}
                                </span>
                            )}
                            {description && (
                                <span className="text-slate-400 dark:text-slate-500">
                                    {description}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}