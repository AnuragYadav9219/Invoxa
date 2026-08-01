import { useMemo } from "react";

const STYLES = {
    emerald: {
        iconBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
        bar: "bg-emerald-500",
    },
    amber: {
        iconBg: "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
        bar: "bg-amber-500",
    },
    rose: {
        iconBg: "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400",
        bar: "bg-rose-500",
    },
};

export default function StatCardCompact({ title, value, icon, color, total }) {
    const percentage = useMemo(() => {
        return total > 0 ? Math.min(Math.round((value / total) * 100), 100) : 0;
    }, [value, total]);

    const style = useMemo(() => STYLES[color] || STYLES.emerald, [color]);

    return (
        <div className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${style.iconBg}`}>{icon}</div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {title}
                    </span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {(value || 0).toLocaleString()}
                </span>
            </div>

            {/* Visual Ratio Progress Bar */}
            <div className="space-y-1">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${style.bar} transition-all duration-500 rounded-full`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="flex justify-end text-[10px] text-slate-400 font-medium">
                    {percentage}% of total
                </div>
            </div>
        </div>
    );
}