import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

const faqs = [
  { q: "How does the automated billing pipeline calculate events?", a: "Invoxa targets standard accounting variables globally. We listen for structural updates within connected CRM states to systematically generate formatted payloads instantly." },
  { q: "Can I connect my own custom payment infrastructure easily?", a: "Yes. Invoxa offers developer webhooks built out of the box to pipe records directly into Stripe, custom banks, or external database structures." },
  { q: "Is the operational data architecture heavily encrypted?", a: "Security is non-negotiable. All profile details, entity tokens, and generated balance ledgers are processed via AES-256 standard encryption keys continuously." }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="max-w-4xl mx-auto px-6 py-32 border-t border-slate-900/60">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">Frequently Asked Questions</h2>
        <p className="text-slate-400">Everything you need to know about setting up operational velocity with Invoxa.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="border border-slate-900 rounded-2xl bg-slate-950/20 backdrop-blur-sm overflow-hidden transition-colors duration-300 hover:border-slate-800"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-6 text-left flex justify-between items-center text-slate-200 hover:text-white transition-colors"
              >
                <span className="font-semibold tracking-tight pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
                  <FiPlus className="w-5 h-5 text-slate-500 flex-shrink-0" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-0 text-sm text-slate-400 leading-relaxed border-t border-slate-900/40 mt-1">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}