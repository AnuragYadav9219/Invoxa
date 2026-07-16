import React from 'react';

const LOGOS = ['Acme Corp', 'Stripe', 'Vercel', 'Supabase', 'Linear', 'Linear', 'Stripe', 'Vercel'];

export default function LogoTicker() {
  return (
    <section className="py-12 bg-slate-950 border-t border-b border-slate-900/60 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 text-center mb-6">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
          Trusted by high-growth engineering teams worldwide
        </p>
      </div>

      <div className="flex w-[200%] overflow-hidden">
        {/* Continuous Marquee Wrapper */}
        <div className="flex space-x-16 animate-none hover:[animation-play-state:paused] whitespace-nowrap justify-around w-full py-2">
          {LOGOS.map((logo, idx) => (
            <span 
              key={idx} 
              className="text-xl font-bold tracking-tight text-slate-700 hover:text-slate-500 transition-colors cursor-default select-none"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}