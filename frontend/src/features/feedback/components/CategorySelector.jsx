import {
    Palette,
    Zap,
    Sparkles,
    CreditCard,
    Monitor,
    Package,
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
    {
        value: "USER_EXPERIENCE",
        label: "User Experience",
        icon: Sparkles,
    },
    {
        value: "PERFORMANCE",
        label: "Performance",
        icon: Zap,
    },
    {
        value: "FEATURES",
        label: "Features",
        icon: Package,
    },
    {
        value: "DESIGN",
        label: "Design",
        icon: Palette,
    },
    {
        value: "BILLING",
        label: "Billing",
        icon: CreditCard,
    },
    {
        value: "OTHER",
        label: "Other",
        icon: Monitor,
    },
];

export default function CategorySelector({ value, onChange }) {
    return (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {categories.map((category) => {
                const Icon = category.icon;
                const selected = value === category.value;

                return (
                    <motion.button
                        key={category.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onChange(category.value)}
                        className={`group relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all duration-300 ${
                            selected
                                ? "border-indigo-500/60 bg-indigo-500/15 shadow-md shadow-indigo-500/10"
                                : "border-slate-800/80 bg-slate-950/60 hover:border-slate-700/80 hover:bg-slate-900/50"
                        }`}
                    >
                        {selected && (
                            <motion.div
                                layoutId="categoryIndicator"
                                className="absolute inset-0 rounded-xl border border-white/10"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                        )}
                        <div
                            className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                selected
                                    ? "bg-indigo-500/20 text-indigo-400"
                                    : "bg-slate-900 text-slate-400 group-hover:text-slate-300"
                            }`}
                        >
                            <Icon size={14} />
                        </div>

                        <span
                            className={`relative z-10 truncate text-xs font-semibold tracking-wide ${
                                selected ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                            }`}
                        >
                            {category.label}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}