import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock3, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight, 
  Mail, 
  Sparkles,
  QrCode,
  Receipt,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export default function FullyResponsiveComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("upi");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  const tabsData = {
    upi: {
      title: "Instant UPI & QR Code",
      desc: "Enable fast mobile payments directly inside the invoice view using GPay, PhonePe, or Paytm.",
      icon: QrCode,
      badge: "Fastest"
    },
    cards: {
      title: "Credit & Debit Cards",
      desc: "Accept Visa, Mastercard, RuPay, and international cards with seamless 3D Secure checkout.",
      icon: CreditCard,
      badge: "Global"
    },
    automation: {
      title: "Auto-Reconciliation",
      desc: "Instant webhooks trigger invoice status updates to 'Paid' and issue automated receipts.",
      icon: Receipt,
      badge: "Automatic"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 bg-linear-to-b from-blue-50/40 via-slate-50 to-indigo-50/30 flex items-center justify-center p-3 sm:p-6 font-sans">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px] opacity-40 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl w-full relative z-10"
      >
        <Card className="bg-white/90 border-slate-200/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border p-4 sm:p-8 md:p-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
            
            {/* Left Column: Information & Subscribe */}
            <div className="md:col-span-7 space-y-5">
              
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-blue-600 border border-blue-100">
                  <Sparkles className="h-3 w-3 text-blue-500 shrink-0" />
                  Upcoming Feature
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 font-normal">• Launching Q3</span>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                  Online Invoice <span className="text-blue-600">Payments</span>
                </h1>
                <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                  Collect payments faster. We are building a secure checkout flow so your customers can settle invoices using UPI, Cards, Net Banking, and Wallets.
                </p>
              </motion.div>

              {/* Interactive Tabs Section */}
              <motion.div variants={itemVariants} className="pt-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Explore payment options
                </div>
                
                {/* Scrollable Tab Controls for Mobile */}
                <div className="w-full overflow-x-auto pb-1 scrollbar-none">
                  <div className="flex min-w-max gap-1.5 p-1 bg-slate-100/80 rounded-lg border border-slate-200/60">
                    {Object.keys(tabsData).map((key) => {
                      const isActive = activeTab === key;
                      const Icon = tabsData[key].icon;
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key)}
                          className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            isActive ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeTabIndicator"
                              className="absolute inset-0 bg-white rounded-md shadow-xs border border-slate-200/60"
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            {key.toUpperCase()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab Content Display */}
                <div className="mt-2.5 min-h-21.25">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="p-3 sm:p-3.5 rounded-lg bg-blue-50/50 border border-blue-100/60 flex items-start gap-3"
                    >
                      <div className="p-2 rounded-md bg-white border border-blue-100 shadow-2xs text-blue-600 shrink-0">
                        {React.createElement(tabsData[activeTab].icon, { className: "h-4 w-4" })}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h4 className="text-xs font-semibold text-slate-900">
                            {tabsData[activeTab].title}
                          </h4>
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-medium">
                            {tabsData[activeTab].badge}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 leading-snug">
                          {tabsData[activeTab].desc}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Responsive Email Form Section */}
              <motion.div variants={itemVariants} className="pt-2 border-t border-slate-100">
                <div className="flex flex-wrap justify-between items-center gap-1 mb-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Get Early Access
                  </label>
                  <span className="text-[10px] sm:text-[11px] text-slate-400">Zero setup fees on launch</span>
                </div>

                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="subscribe-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubscribe}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <div className="relative grow">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                          type="email"
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-9 h-10 sm:h-9 text-xs rounded-lg border-slate-200 bg-white text-slate-900 focus-visible:ring-blue-500 w-full"
                        />
                      </div>
                      <Button
                        type="submit"
                        size="sm"
                        className="h-10 sm:h-9 px-4 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg group transition-all shrink-0 w-full sm:w-auto"
                      >
                        Notify Me
                        <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success-message"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs"
                    >
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>You've been added to the early access list.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            </div>

            {/* Right Column: Mini Feature Cards */}
            <div className="md:col-span-5 space-y-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Security & Specs
              </div>

              <CompactFeatureCard
                icon={CreditCard}
                title="Omnichannel Processing"
                description="Accept UPI, cards, and net banking seamlessly."
              />

              <CompactFeatureCard
                icon={ShieldCheck}
                title="PCI-DSS Compliant"
                description="Encrypted payloads with webhook authentication."
              />

              <CompactFeatureCard
                icon={Clock3}
                title="Real-time Status"
                description="Automated updates upon payment verification."
              />

              {/* Status Indicator Bar */}
              <div className="mt-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                  <span className="text-xs font-medium text-slate-700 truncate">Development Status</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full shrink-0">
                  85% Complete
                </span>
              </div>
            </div>

          </div>

          {/* Responsive Footer Note */}
          <div className="mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-400 text-center sm:text-left">
            <p>Designed for shop owners and modern invoicing workflows.</p>
            <div className="flex items-center gap-2 sm:gap-3">
              <span>Razorpay Ready</span>
              <span>•</span>
              <span>Instant Receipts</span>
            </div>
          </div>

        </Card>
      </motion.div>
    </div>
  );
}

function CompactFeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ 
        x: 3, 
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderColor: "rgba(203, 213, 225, 0.8)"
      }}
      whileTap={{ scale: 0.99 }}
      className="p-2.5 sm:p-3 rounded-xl border border-slate-200/60 bg-white/60 backdrop-blur-2xs flex items-start gap-2.5 sm:gap-3 transition-all cursor-pointer shadow-2xs group"
    >
      <div className="p-1.5 sm:p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </div>

      <div className="space-y-0.5 min-w-0">
        <h3 className="text-xs font-semibold text-slate-800 tracking-tight truncate">
          {title}
        </h3>
        <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug">
          {description}
        </p>
      </div>
    </motion.div>
  );
}