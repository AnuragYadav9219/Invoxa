import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiLayers, FiSend } from 'react-icons/fi';

export default function LivePlayground() {
  const [client, setClient] = useState('Acme Corp');
  const [hours, setHours] = useState(40);
  const [rate, setRate] = useState(85);
  const total = hours * rate;

  return (
    <section className="max-w-7xl mx-auto px-6 py-32 border-t border-slate-900/60 relative">
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Explainer Text */}
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/5 text-xs font-medium text-violet-400">
            <FiLayers className="w-3.5 h-3.5" />
            <span>Interactive Sandbox</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-100 leading-tight">
            See the pipeline execute in real time.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Don't take our word for it. Try out the baseline invoicing mechanism directly from this screen. Change the developer metrics to watch your custom client ledger adapt dynamically.
          </p>
          
          {/* Real Input Selectors */}
          <div className="p-6 border border-slate-900 rounded-2xl bg-slate-950/40 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Client Identity</label>
              <input 
                type="text" 
                value={client} 
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Billable Volume (Hrs)</label>
                <input 
                  type="number" 
                  value={hours} 
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Hourly Velocity ($)</label>
                <input 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Animated Dynamic Output Mockup */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/10 backdrop-blur-md p-6 shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center pb-6 border-b border-slate-800/60 mb-6">
            <div>
              <span className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">Invoice Specimen</span>
              <div className="text-lg font-bold text-slate-100 mt-0.5">INV-2026-089</div>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full">
              Draft Mode
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between text-sm">
              <div>
                <span className="text-slate-500 block text-xs font-medium">Prepared for:</span>
                <span className="text-slate-200 font-semibold mt-0.5 block">{client || 'Client Entity'}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-xs font-medium">Issue Date:</span>
                <span className="text-slate-200 font-medium mt-0.5 block">July 16, 2026</span>
              </div>
            </div>

            <div className="border border-slate-900 bg-slate-950/40 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-3 bg-slate-900/80 p-3 font-semibold border-b border-slate-900 text-slate-400">
                <div>Description</div>
                <div className="text-center">Rate / Vol</div>
                <div className="text-right">Subtotal</div>
              </div>
              <div className="grid grid-cols-3 p-4 text-slate-300 items-center">
                <div className="font-medium text-slate-200">Full-Stack Development Sprint</div>
                <div className="text-center text-slate-400">${rate} / {hours}h</div>
                <div className="text-right text-slate-100 font-semibold">${total.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex justify-between items-end pt-4 border-t border-slate-800/60">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total Valuation</span>
              <motion.div 
                key={total}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400"
              >
                ${total.toLocaleString()}.00
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}