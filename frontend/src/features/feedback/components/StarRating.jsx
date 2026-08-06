import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function StarRating({
    value,
    onChange,
    max = 5,
}) {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex items-center justify-center gap-2">
            {[...Array(max)].map((_, index) => {
                const rating = index + 1;
                const active = hovered
                    ? rating <= hovered
                    : rating <= value;

                return (
                    <motion.button
                        key={rating}
                        type="button"
                        whileHover={{ scale: 1.2, rotate: -8 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHovered(rating)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => onChange(rating)}
                        className="outline-none"
                    >
                        <Star
                            size={40}
                            className={`transition-all duration-200 ${active
                                    ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                    : "text-slate-600 hover:text-yellow-300"
                                }`}
                        />
                    </motion.button>
                );
            })}
        </div>
    );
}