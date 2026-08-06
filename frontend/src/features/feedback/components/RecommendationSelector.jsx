import { ThumbsDown, ThumbsUp, Meh } from "lucide-react";
import { motion } from "framer-motion";

const options = [
    {
        value: "YES",
        label: "Yes",
        icon: ThumbsUp,
        activeClass: "border-emerald-500/60 bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/10",
        iconColor: "text-emerald-400",
    },
    {
        value: "MAYBE",
        label: "Maybe",
        icon: Meh,
        activeClass: "border-amber-500/60 bg-amber-500/15 text-amber-400 shadow-lg shadow-amber-500/10",
        iconColor: "text-amber-400",
    },
    {
        value: "NO",
        label: "No",
        icon: ThumbsDown,
        activeClass: "border-rose-500/60 bg-rose-500/15 text-rose-400 shadow-lg shadow-rose-500/10",
        iconColor: "text-rose-400",
    },
];

export default function RecommendationSelector({ value, onChange }) {
    return (
        <div className="grid grid-cols-3 gap-2.5">
            {options.map((option) => {
                const Icon = option.icon;
                const selected = value === option.value;

                return (
                    <motion.button
                        key={option.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onChange(option.value)}
                        className={`relative flex items-center cursor-pointer justify-center gap-2 rounded-xl border px-3 py-2.5 transition-all duration-300 ${selected
                                ? option.activeClass
                                : "border-slate-800/80 bg-slate-950/60 text-slate-400 hover:border-slate-700/80 hover:bg-slate-900/50 hover:text-slate-300"
                            }`}
                    >
                        {selected && (
                            <motion.div
                                layoutId="recommendationIndicator"
                                className="absolute inset-0 rounded-xl border border-white/10"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                        )}
                        <Icon
                            size={15}
                            className={`relative z-10 transition-colors ${selected ? option.iconColor : "text-slate-500"
                                }`}
                        />
                        <span className="relative z-10 text-xs font-semibold tracking-wide">
                            {option.label}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}