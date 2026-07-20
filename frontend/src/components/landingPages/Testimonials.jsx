import React from 'react';
import { motion } from 'framer-motion';
import { HiStar } from 'react-icons/hi2';
import { FiZap } from 'react-icons/fi';

const FEEDBACK = [
  {
    quote: "Migrating our core balance ledgers to Invoxa cut manual engineering overhead by almost 40%. The automated billing triggers work seamlessly.",
    author: "Elena Rostova",
    role: "VP of Operations",
    company: "StrataInc",
    avatar: "ER",
    highlight: "40% Less Overhead",
    rating: 5,
  },
  {
    quote: "The programmatic execution matrix is immaculate. We handle all contract structures and invoice cycles instantly using their developer pipelines.",
    author: "Devon Reynolds",
    role: "Founder",
    company: "CoreStack Systems",
    avatar: "DR",
    highlight: "Instant Execution",
    rating: 5,
  },
  {
    quote: "Invoxa solved our global cross-border collection delays. Their dynamic dashboards give us absolute corporate cash flow velocity updates instantly.",
    author: "Marcus Vance",
    role: "Chief Financial Officer",
    company: "Apex Corp",
    avatar: "MV",
    highlight: "Zero Payment Delays",
    rating: 5,
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-28 sm:py-36 overflow-hidden bg-slate-950">
      
      {/* Background Ambient Glow & Grid Pattern */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />
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
            <FiZap className="text-sm" /> Customer Success
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
          >
            Validated by engineering <br />
            <span className="bg-linear-to-r from-indigo-300 via-indigo-100 to-violet-300 bg-clip-text text-transparent">
              and financial leaders.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto"
          >
            Discover how scale-stage platforms rely on Invoxa to keep revenue flow accurate and fully automated.
          </motion.p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {FEEDBACK.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="group relative p-8 rounded-3xl bg-slate-900/40 border border-white/8 backdrop-blur-xl flex flex-col justify-between hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              {/* Top Card Badge & Star Rating */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center text-[11px] font-medium tracking-wide text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    {card.highlight}
                  </span>
                  
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(card.rating)].map((_, i) => (
                      <HiStar key={i} className="w-4 h-4" />
                    ))}
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 group-hover:text-white transition-colors">
                  "{card.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/6">
                <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 p-px shadow-md shadow-indigo-500/20">
                  <div className="w-full h-full rounded-[15px] bg-slate-950 flex items-center justify-center text-xs font-bold text-indigo-300 group-hover:bg-transparent group-hover:text-white transition-colors">
                    {card.avatar}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-indigo-200 transition-colors">
                    {card.author}
                  </div>
                  <div className="text-xs text-slate-400">
                    {card.role} · <span className="text-slate-300 font-medium">{card.company}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}