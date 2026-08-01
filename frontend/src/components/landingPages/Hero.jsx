import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiTrendingUp,
  FiFileText,
  FiPieChart,
  FiCheckCircle,
  FiClock,
  FiPlayCircle,
  FiCompass
} from 'react-icons/fi';

export default function Hero() {
  const [activeTab, setActiveTab] = useState('overview');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-slate-950 text-center">

      {/* Background Ambient Lighting & Grid Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-250 h-125 bg-linear-to-tr from-indigo-600/20 via-violet-600/15 to-pink-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Main Content Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Release Badge Link */}
          <motion.div variants={itemVariants} className="inline-block">
            <Link to="/changelog">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300 backdrop-blur-md cursor-pointer select-none ring-1 ring-white/10 hover:border-indigo-500/50 transition-colors"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span>Invoxa is now live</span>
                <span className="text-slate-500">|</span>
                <span className="flex items-center gap-1 text-slate-300 font-medium">
                  See what's new <FiArrowRight className="w-3 h-3 text-indigo-400" />
                </span>
              </motion.div>
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Invoice smarter{', '}
            <span className="block mt-2 bg-linear-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
              Grow faster
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to create invoices, send PDFs, track payments, and grow your business—all in one secure cloud platform.
          </motion.p>

          {/* Call-To-Action Buttons with Links */}
          <motion.div variants={itemVariants} className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">

            {/* Primary Action Button -> Register */}
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 flex items-center justify-center gap-2 group transition-all"
              >
                <span>Get Started Free</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Secondary Action Button -> Demo/Contact */}
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 text-sm font-semibold bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white rounded-xl backdrop-blur-md flex items-center justify-center gap-2.5 transition-all"
              >
                <FiCompass className="w-4 h-4 text-indigo-400" />
                <span>See How It Works</span>
              </a>
            </motion.div>

          </motion.div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-400" />
              <span>No credit card required</span>
            </div>

            <div className="flex items-center gap-2">
              <FiFileText className="text-indigo-400" />
              <span>Professional PDF invoices</span>
            </div>

            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-cyan-400" />
              <span>Revenue dashboard included</span>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}