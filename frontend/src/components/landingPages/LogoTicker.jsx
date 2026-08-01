import React from 'react';
import { motion } from 'framer-motion';
import {
  FiZap,
  FiLayers,
  FiCpu,
  FiCommand,
  FiDatabase,
  FiSend,
  FiGitBranch,
  FiGlobe
} from 'react-icons/fi';

const STICKERS = [
  {
    name: "PDF Invoices",
    tag: "Professional",
    icon: FiLayers,
    color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    name: "Email Delivery",
    tag: "Instant",
    icon: FiSend,
    color: "from-sky-500/20 to-cyan-500/20 text-sky-400 border-sky-500/30",
  },
  {
    name: "Payment Tracking",
    tag: "Smart",
    icon: FiZap,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    name: "Customer Manager",
    tag: "CRM",
    icon: FiDatabase,
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    name: "Revenue Dashboard",
    tag: "Analytics",
    icon: FiCpu,
    color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
  },
  {
    name: "Secure Login",
    tag: "JWT",
    icon: FiCommand,
    color: "from-violet-500/20 to-fuchsia-500/20 text-violet-400 border-violet-500/30",
  },
  {
    name: "Multi-Tenant",
    tag: "Cloud",
    icon: FiGlobe,
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    name: "Overdue Alerts",
    tag: "Automation",
    icon: FiGitBranch,
    color: "from-red-500/20 to-orange-500/20 text-red-400 border-red-500/30",
  },
];

export default function LogoTicker() {
  const duplicatedStickers = [...STICKERS, ...STICKERS];

  return (
    <section className="py-16 bg-slate-950 border-t border-b border-white/8 overflow-hidden relative">

      {/* Side Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-28 sm:w-48 bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-28 sm:w-48 bg-linear-to-l from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />

      {/* Header Label */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          One platform for invoicing, payments & business growth
        </p>
        <p className="mt-3 text-sm text-slate-400">
  Professional invoicing, customer management, payment tracking, and business insights—all in one modern platform.
</p>
      </div>

      {/* Auto-Scrolling Sticker Track */}
      <div className="flex overflow-hidden select-none py-4">
        <motion.div
          className="flex gap-6 sm:gap-8 items-center whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            ease: 'linear',
            duration: 30,
            repeat: Infinity,
          }}
        >
          {duplicatedStickers.map((sticker, idx) => {
            const Icon = sticker.icon;

            const floatY = idx % 2 === 0 ? [-3, 3, -3] : [3, -3, 3];

            return (
              <motion.div
                key={idx}
                animate={{ y: floatY }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: (idx % 4) * 0.5,
                }}
                whileHover={{ scale: 1.08, rotate: idx % 2 === 0 ? 2 : -2, zIndex: 30 }}
                className={`group relative flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-linear-to-br ${sticker.color} border backdrop-blur-xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer`}
              >
                {/* Glowing Icon Container */}
                <div className="p-2 rounded-xl bg-slate-950/60 border border-white/10 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Sticker Content */}
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    {sticker.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    {sticker.tag}
                  </span>
                </div>

                {/* Subtle Sheen / Reflection Effect */}
                <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}