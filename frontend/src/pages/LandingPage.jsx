import React from 'react';
import { motion } from 'framer-motion';
import {
    FiArrowRight,
    FiTrendingUp,
    FiFileText,
    FiPieChart,
    FiShield,
    FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
            {/* Background Radial Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-600/10 to-transparent blur-[120px] pointer-events-none" />

            {/* Navbar */}
            <nav className="border-b border-slate-800/60 backdrop-blur-md bg-slate-950/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                            I
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Invoxa
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                        <a href="#docs" className="hover:text-white transition-colors">Docs</a>
                    </div>
                    <div>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-4 py-2 text-sm font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-200 transition-all hover:bg-slate-800">
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl mx-auto space-y-6"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-medium text-indigo-400 backdrop-blur-sm">
                        <span>Introducing Invoxa 1.0</span>
                        <FiArrowRight className="w-3 h-3" />
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15]">
                        Manage your business{' '}
                        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                            smarter & faster
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Automate invoicing, track operations, and register clients effortlessly. The all-in-one SaaS platform built to let you focus on growth.
                    </motion.p>

                    <motion.div variants={itemVariants} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="w-full sm:w-auto px-6 py-3 text-sm font-medium bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 group">
                            <span>Get Started Free</span>
                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full sm:w-auto px-6 py-3 text-sm font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl transition-all">
                            Book a Demo
                        </button>
                    </motion.div>
                </motion.div>

                {/* Dashboard Mockup Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                    className="mt-16 border border-slate-800/80 rounded-2xl bg-slate-900/40 backdrop-blur-sm p-4 shadow-2xl shadow-indigo-500/5 max-w-5xl mx-auto relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="flex items-center space-x-2 pb-3 border-b border-slate-800/60 mb-4">
                        <div className="w-3 h-3 rounded-full bg-rose-500/40" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                        <div className="h-4 w-32 bg-slate-800 rounded mx-auto opacity-40" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[240px]">
                        <div className="border border-slate-800/60 bg-slate-950/40 rounded-xl p-5 flex flex-col justify-between text-left">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</span>
                                <FiTrendingUp className="text-emerald-400 w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold tracking-tight text-slate-200">$48,250.00</div>
                                <p className="text-xs text-slate-500 mt-1">+12% from last month</p>
                            </div>
                        </div>
                        <div className="border border-slate-800/60 bg-slate-950/40 rounded-xl p-5 flex flex-col justify-between text-left">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Invoices Sent</span>
                                <FiFileText className="text-indigo-400 w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold tracking-tight text-slate-200">184</div>
                                <p className="text-xs text-slate-500 mt-1">99.1% paid on time</p>
                            </div>
                        </div>
                        <div className="border border-slate-800/60 bg-slate-950/40 rounded-xl p-5 flex flex-col justify-between text-left">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Clients</span>
                                <FiPieChart className="text-violet-400 w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold tracking-tight text-slate-200">42</div>
                                <p className="text-xs text-slate-500 mt-1">4 new integrations this week</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to scale operations.</h2>
                    <p className="text-slate-400">Stop juggling spreadsheets and disconnected tools. Invoxa handles the heavy lifting.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 border border-slate-900 rounded-2xl bg-gradient-to-b from-slate-900/50 to-transparent hover:border-slate-800 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                            <FiFileText className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-200 mb-2">Automated Invoicing</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">Generate sleek dynamic invoices, track real-time status updates, and streamline native billing setups.</p>
                    </div>

                    <div className="p-6 border border-slate-900 rounded-2xl bg-gradient-to-b from-slate-900/50 to-transparent hover:border-slate-800 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4">
                            <FiShield className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-200 mb-2">Secure Business CRM</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">Securely store client profiles, corporate data, and history milestones in an encrypted workspace.</p>
                    </div>

                    <div className="p-6 border border-slate-900 rounded-2xl bg-gradient-to-b from-slate-900/50 to-transparent hover:border-slate-800 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4">
                            <FiCheckCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-200 mb-2">Insight Analytics</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">Track your cash flow velocity, monitor active integrations, and overview operational trends directly.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-900 text-slate-600 text-xs py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>&copy; 2026 Invoxa Inc. All rights reserved.</div>
                    <div className="flex space-x-6 text-slate-500">
                        <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}