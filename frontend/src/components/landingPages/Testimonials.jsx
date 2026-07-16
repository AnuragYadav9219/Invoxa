import React from 'react';
import { motion } from 'framer-motion';

const FEEDBACK = [
    {
        quote: "Migrating our core balance ledgers to Invoxa cut manual engineering overhead by almost 40%. The automated billing triggers work seamlessly.",
        author: "Elena Rostova",
        role: "VP of Operations, StrataInc",
        avatar: "ER"
    },
    {
        quote: "The programmatic execution matrix is immaculate. We handle all contract structures and invoice cycles instantly using their developer pipelines.",
        author: "Devon Reynolds",
        role: "Founder, CoreStack Systems",
        avatar: "DR"
    },
    {
        quote: "Invoxa solved our global cross-border collection delays. Their dynamic dashboards give us absolute corporate cash flow velocity updates instantly.",
        author: "Marcus Vance",
        role: "Chief Financial Officer, Apex Corp",
        avatar: "MV"
    }
];

export default function Testimonials() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-32 border-t border-slate-900/60 relative">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">Validated by scale.</h2>
                <p className="text-slate-400 text-lg">See how engineering and operational leaders keep tracking precision flawless.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {FEEDBACK.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="p-8 border border-slate-900 bg-slate-950/30 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-colors duration-300"
                    >
                        <p className="text-slate-400 italic text-sm leading-relaxed mb-8">
                            "{card.quote}"
                        </p>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400">
                                {card.avatar}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-200">{card.author}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{card.role}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}