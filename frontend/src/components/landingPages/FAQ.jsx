import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiHelpCircle, FiMessageSquare, FiArrowRight } from 'react-icons/fi';

const FAQS = [
  {
    q: "How does the automated billing pipeline calculate usage and events?",
    a: "Invoxa listens to your backend events via webhooks or API dispatches. As CRM states or usage metrics update, Invoxa systematically calculates line items based on your custom rate rules and generates formatted payloads instantly."
  },
  {
    q: "Can I connect my own payment gateways like Stripe or banking rails?",
    a: "Yes. Invoxa integrates natively with Stripe, PayPal, Plaid, and custom banking APIs. You can pipe records directly into existing payment infrastructures without changing your core checkout flow."
  },
  {
    q: "Is the operational financial data architecture encrypted?",
    a: "Security is non-negotiable. All account records, API keys, and balance ledgers are encrypted at rest using AES-256 standards and in transit via TLS 1.3. We maintain SOC 2 Type II compliance readiness."
  },
  {
    q: "Does Invoxa support multi-currency and international tax calculation?",
    a: "Absolutely. Invoxa handles dynamic currency conversion for over 135 currencies and integrates automated tax estimation (VAT, GST, and US Sales Tax) based on client jurisdiction."
  },
  {
    q: "Can I start with a free trial before migrating production ledgers?",
    a: "Yes! Every account includes a 14-day full-access sandbox trial. You can test webhook triggers, build invoice templates, and simulate payment dispatches with dummy data before going live."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  return (
    <section id="faq" className="relative py-28 sm:py-36 bg-slate-950 overflow-hidden border-t border-white/8">

      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-87.5 bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider"
          >
            <FiHelpCircle className="text-sm" /> Clear Answers
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
          >
            Frequently asked questions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg"
          >
            Everything you need to know about setting up operational billing velocity with Invoxa.
          </motion.p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden backdrop-blur-xl ${isOpen
                  ? 'border-indigo-500/40 bg-slate-900/60 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/20'
                  : 'border-white/8 bg-slate-900/30 hover:border-white/20'
                  }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center text-slate-200 hover:text-white transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-base sm:text-lg tracking-tight pr-4">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className={`p-2 rounded-xl border shrink-0 transition-colors ${isOpen
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950/60 text-slate-400 border-white/10'
                      }`}
                  >
                    <FiPlus className="w-4 h-4" />
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
                      <div className="px-6 pb-6 pt-0 text-sm sm:text-base text-slate-400 leading-relaxed border-t border-white/4 mt-1">
                        <p className="pt-4">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}