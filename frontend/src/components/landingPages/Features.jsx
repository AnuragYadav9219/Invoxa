import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiShield, FiCheckCircle } from 'react-icons/fi';

const featureData = [
  {
    title: 'Automated Invoicing',
    desc: 'Generate dynamic invoices, track status triggers in real-time, and get paid via native financial setups safely.',
    icon: FiFileText,
    glow: 'group-hover:shadow-indigo-500/10'
  },
  {
    title: 'Secure Business CRM',
    desc: 'Store enterprise identity vectors, secure continuous workflows, and maintain pristine profile data vaults securely.',
    icon: FiShield,
    glow: 'group-hover:shadow-violet-500/10'
  },
  {
    title: 'Insight Analytics',
    desc: 'Map cash flow projections, overview processing performance, and optimize operational velocity metrics accurately.',
    icon: FiCheckCircle,
    glow: 'group-hover:shadow-pink-500/10'
  }
];

export default function Features() {
  // Scroll reveal setup
  const scrollVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-32 border-t border-slate-900/60">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={scrollVariants}
        className="text-center max-w-3xl mx-auto mb-20 space-y-4"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-100">
          Everything you need to scale operations.
        </h2>
        <p className="text-slate-400 text-lg">
          Stop juggling fragmented apps. Invoxa handles the end-to-end heavy lifting flawlessly.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featureData.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
              }}
              whileHover={{ y: -6 }}
              className={`group relative p-8 border border-slate-900 rounded-2xl bg-gradient-to-b from-slate-900/30 to-transparent hover:border-slate-800 transition-all duration-300 hover:shadow-2xl ${feat.glow}`}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-md">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-3 group-hover:text-white transition-colors">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                {feat.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}