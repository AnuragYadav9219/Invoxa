import React from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiShield,
  FiTrendingUp,
  FiZap,
  FiCheckCircle,
  FiLock,
  FiCpu,
  FiArrowRight,
  FiCode
} from 'react-icons/fi';

const FEATURES = [
  {
    id: 'invoicing',
    title: 'Automated Billing Triggers',
    desc: 'Generate dynamic invoices based on usage, milestones, or recurring schedules. Reconcile payments automatically with zero manual effort.',
    icon: FiFileText,
    accent: 'from-indigo-500/20 via-indigo-500/10 to-transparent',
    iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    colSpan: 'md:col-span-2 lg:col-span-2',
    preview: 'invoice-preview'
  },
  {
    id: 'security',
    title: 'Enterprise Identity Vault',
    desc: 'AES-256 encrypted client data storage with automated audit logging and compliance triggers.',
    icon: FiShield,
    accent: 'from-violet-500/20 via-violet-500/10 to-transparent',
    iconColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    colSpan: 'md:col-span-1 lg:col-span-1',
    preview: 'security-preview'
  },
  {
    id: 'analytics',
    title: 'Real-Time Financial Velocity',
    desc: 'Track collection speed, pending ledger amounts, and cash flow projections on live dynamic dashboards.',
    icon: FiTrendingUp,
    accent: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    colSpan: 'md:col-span-1 lg:col-span-1',
    preview: 'analytics-preview'
  },
  {
    id: 'developer',
    title: 'Developer-First APIs & Webhooks',
    desc: 'Integrate billing pipelines directly into your app using REST endpoints, SDKs, and instant webhook dispatches.',
    icon: FiCode,
    accent: 'from-sky-500/20 via-sky-500/10 to-transparent',
    iconColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    colSpan: 'md:col-span-2 lg:col-span-2',
    preview: 'code-preview'
  }
];

export default function Features() {
  return (
    <section id="features" className="relative py-28 sm:py-36 bg-slate-950 overflow-hidden border-t border-white/8">

      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-175 h-100 bg-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider"
          >
            <FiZap className="text-sm" /> Built for Modern Scale
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight"
          >
            Everything you need to{' '}
            <span className="bg-linear-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
              automate cash flow.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto"
          >
            Stop juggling fragmented apps. Invoxa combines smart billing, enterprise security, and cash flow analytics into a single engine.
          </motion.p>
        </div>

        {/* Bento Grid Features Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feat, index) => {
            const Icon = feat.icon;

            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`group relative p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/8 backdrop-blur-xl flex flex-col justify-between overflow-hidden hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 ${feat.colSpan}`}
              >
                {/* Subtle Card Top Ambient Accent */}
                <div className={`absolute top-0 left-0 right-0 h-32 bg-linear-to-b ${feat.accent} opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                <div>
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-5 relative z-10">
                    <div className={`p-3 rounded-2xl border ${feat.iconColor} shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {feat.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-8 relative z-10 max-w-lg">
                    {feat.desc}
                  </p>
                </div>

                {/* Interactive Mini-UI Visual Previews */}
                <div className="relative z-10 pt-2">

                  {/* Feature Preview 1: Automated Invoicing */}
                  {feat.preview === 'invoice-preview' && (
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/6 space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-white/6">
                        <span className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                          <FiCheckCircle className="text-emerald-400" /> Auto-Trigger Executed
                        </span>
                        <span className="text-[10px] text-slate-500">2ms ago</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Inv #2026-104</span>
                        <span className="font-semibold text-white">$8,450.00</span>
                      </div>
                    </div>
                  )}

                  {/* Feature Preview 2: Security Vault */}
                  {feat.preview === 'security-preview' && (
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/6 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <FiLock className="text-violet-400" />
                        <span className="font-medium">AES-256 Vault</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                        Compliant
                      </span>
                    </div>
                  )}

                  {/* Feature Preview 3: Analytics Bar Graph */}
                  {feat.preview === 'analytics-preview' && (
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/6 flex items-end justify-between gap-2 h-20">
                      {[40, 65, 50, 85, 70, 95].map((h, i) => (
                        <div key={i} className="w-full bg-slate-800 rounded-t-md relative overflow-hidden h-full flex items-end">
                          <div
                            style={{ height: `${h}%` }}
                            className="w-full bg-linear-to-t from-indigo-600 to-emerald-400 rounded-t-md group-hover:brightness-125 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Feature Preview 4: Code Snippet */}
                  {feat.preview === 'code-preview' && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/6 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
                      <div className="text-slate-500">// Trigger automated invoice via API</div>
                      <div>
                        <span className="text-indigo-400">await</span> invoxa.<span className="text-violet-300">invoices</span>.<span className="text-sky-300">create</span>({`{ client: `}<span className="text-emerald-300">'Acme Corp'</span>{`, amount: `}<span className="text-amber-300">8450</span>{` }`});
                      </div>
                    </div>
                  )}

                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}