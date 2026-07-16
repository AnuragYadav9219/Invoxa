import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight } from 'react-icons/fi';

const plans = [
  {
    name: 'Starter',
    desc: 'Perfect for freelancers and solo builders.',
    priceMonthly: 19,
    priceAnnually: 15,
    features: ['Up to 20 automated invoices/mo', 'Basic CRM controls', '1 team seat', 'Standard email help'],
    isPopular: false,
  },
  {
    name: 'Pro',
    desc: 'Ideal for rapidly scaling businesses.',
    priceMonthly: 49,
    priceAnnually: 39,
    features: ['Unlimited custom invoices', 'Advanced identity CRM infrastructure', 'Up to 5 team seats', 'Priority 1h support matrix', 'Custom analytics suite'],
    isPopular: true,
  },
  {
    name: 'Enterprise',
    desc: 'For massive high-velocity setups.',
    priceMonthly: 149,
    priceAnnually: 119,
    features: ['Dedicated execution pipelines', 'Custom API webhooks access', 'Unlimited team seats', '24/7 dedicated account lead', 'SLA uptime parameters'],
    isPopular: false,
  }
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-32 border-t border-slate-900/60 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none" />
      
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-100">Transparent, scalable pricing.</h2>
        <p className="text-slate-400 text-lg">Pick the path that works for your operations. Switch scales or cancel anytime.</p>
        
        {/* Toggle Mechanism */}
        <div className="pt-6 flex justify-center items-center space-x-4">
          <span className={`text-sm ${!isAnnual ? 'text-white font-medium' : 'text-slate-500'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 rounded-full bg-slate-900 border border-slate-800 p-1 flex items-center relative transition-colors duration-300"
          >
            <motion.div 
              layout 
              className="w-4 h-4 rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50" 
              animate={{ x: isAnnual ? 22 : 0 }} 
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-sm ${isAnnual ? 'text-white font-medium' : 'text-slate-500'} flex items-center gap-1.5`}>
            Annually <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10">
        {plans.map((plan, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -4 }}
            className={`border rounded-2xl p-8 bg-slate-950/40 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between min-h-[520px] ${
              plan.isPopular ? 'border-indigo-500 ring-1 ring-indigo-500/30 relative shadow-xl shadow-indigo-500/5' : 'border-slate-900 hover:border-slate-800'
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg shadow-indigo-500/20">
                Most Popular
              </span>
            )}

            <div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">{plan.desc}</p>
              
              <div className="mb-8 flex items-baseline">
                <span className="text-4xl font-extrabold tracking-tight text-slate-100">
                  ${isAnnual ? plan.priceAnnually : plan.priceMonthly}
                </span>
                <span className="text-slate-500 text-sm ml-2">/ month</span>
              </div>

              <ul className="space-y-4 border-t border-slate-900 pt-6">
                {plan.features.map((feat, index) => (
                  <li key={index} className="flex items-start text-sm text-slate-300 space-x-3">
                    <FiCheck className="text-indigo-400 w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 mt-8 flex items-center justify-center space-x-2 group ${
                plan.isPopular 
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md' 
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>Get Started</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}