import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export default function BottomCTA() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden">
            {/* Container Box */}
            <div className="border border-slate-900 rounded-3xl bg-gradient-to-b from-slate-900/40 to-slate-950/80 p-12 md:p-20 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

                {/* Subtle grid pattern background trick */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

                <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100">
                        Ready to supercharge operational flow?
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                        Create an instantaneous sandbox account today. Experience pixel-perfect business automation out of the box.
                    </p>
                    <div className="pt-4">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 bg-white text-slate-950 text-sm font-bold rounded-xl shadow-xl shadow-white/5 inline-flex items-center space-x-2 group hover:bg-slate-100 transition-colors"
                        >
                            <span>Get Access Instantly</span>
                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </section>
    );
}