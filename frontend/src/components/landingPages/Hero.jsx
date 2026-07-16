import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp, FiFileText, FiPieChart } from 'react-icons/fi';

export default function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <section className="max-w-7xl mx-auto px-6 pt-28 pb-24 text-center relative z-10">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-3xl mx-auto space-y-6"
            >
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-medium text-indigo-400 backdrop-blur-sm cursor-pointer select-none"
                >
                    <span>Introducing Invoxa 1.0</span>
                    <FiArrowRight className="w-3 h-3" />
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                    Manage your business{' '}
                    <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                        smarter & faster
                    </span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Automate invoicing, track operations, and register clients effortlessly. The all-in-one SaaS platform built to let you focus on growth.
                </motion.p>

                <motion.div variants={itemVariants} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto px-8 py-4 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl shadow-xl shadow-indigo-500/20 flex items-center justify-center space-x-2 group"
                    >
                        <span>Get Started Free</span>
                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02, bg: '#1e293b' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto px-8 py-4 text-sm font-semibold bg-slate-900 border border-slate-800 text-slate-300 rounded-xl transition-colors"
                    >
                        Book a Demo
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Dynamic Dashboard App Preview Block */}
            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-20 border border-slate-800/80 rounded-2xl bg-slate-900/20 backdrop-blur-md p-5 shadow-2xl shadow-indigo-500/5 max-w-5xl mx-auto relative group overflow-hidden"
            >
                <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/20 via-transparent to-violet-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="flex items-center space-x-2 pb-4 border-b border-slate-800/60 mb-5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/40" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                    {[
                        { label: 'Total Revenue', value: '$48,250.00', sub: '+12% from last month', icon: FiTrendingUp, color: 'text-emerald-400' },
                        { label: 'Invoices Sent', value: '184', sub: '99.1% paid on time', icon: FiFileText, color: 'text-indigo-400' },
                        { label: 'Active Clients', value: '42', sub: '4 new this week', icon: FiPieChart, color: 'text-violet-400' }
                    ].map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={i}
                                whileHover={{ y: -4, borderColor: 'rgb(51 65 85)' }}
                                className="border border-slate-800/80 bg-slate-950/60 rounded-xl p-6 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.label}</span>
                                    <Icon className={`${card.color} w-5 h-5`} />
                                </div>
                                <div className="text-3xl font-bold tracking-tight text-slate-100">{card.value}</div>
                                <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}