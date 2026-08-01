import { motion, AnimatePresence } from "framer-motion";
import SessionsCard from "../SessionsCard";
import {
  LayoutTemplate,
  Shield,
  User,
  CheckCircle2,
  Sparkles,
  Lock,
  CreditCard,
} from "lucide-react";
import AccountTab from "./AccountTab";
import InvoiceTemplateTab from "./InvoiceTemplateTab";
import SubscriptionSettings from "@/features/subscription/components/SubscriptionSettings";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

/* ================= CONFIG ================= */

const SETTINGS_TABS = [
  {
    key: "account",
    label: "Account",
    icon: User,
    component: AccountTab,
  },
  {
    key: "subscription",
    label: "Subscription",
    icon: CreditCard,
    component: SubscriptionSettings,
  },
  {
    key: "security",
    label: "Security",
    icon: Shield,
    component: SecurityTab,
  },
  {
    key: "templates",
    label: "Templates",
    icon: LayoutTemplate,
    component: InvoiceTemplateTab,
  },
];

const SECURITY_TIPS = [
  "Always logout from public or shared devices",
  "Use strong and unique passwords with symbols",
  "Review your active device sessions regularly",
  "Keep your recovery information up-to-date",
];

/* ================= MAIN ================= */

export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultTab = searchParams.get("tab") || localStorage.getItem("settingsTab") || "account";

  const [tab, setTab] = useState(defaultTab);

  useEffect(() => {
    localStorage.setItem("settingsTab", tab);
  }, [tab]);

  useEffect(() => {
    const urlTab = searchParams.get("tab");

    if (urlTab && urlTab !== tab) {
      setTab(urlTab);
    }
  }, [searchParams]);

  const handleTabChange = (newTab) => {
    setTab(newTab);

    if (newTab === "account") {
      setSearchParams({});
    } else {
      setSearchParams({ tab: newTab });
    }
  };

  const ActiveComponent =
    SETTINGS_TABS.find((t) => t.key === tab)?.component || AccountTab;

  return (
    <div className="w-screen pr-4 md:w-full sm:max-w-7xl mx-auto sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
              <Sparkles size={10} />
              Workspace Settings
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Settings & Preferences
          </h1>

          <p className="text-sm text-slate-500 font-medium">
            Manage your account credentials, workspace profile details, and
            active device sessions.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="relative w-full py-2">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-indigo-50/50 via-purple-50/30 to-pink-50/50 blur-lg -z-10" />

        <div className="overflow-x-auto no-scrollbar px-1 py-1">
          <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white/70 p-1.5 shadow-sm backdrop-blur-xl">

            {SETTINGS_TABS.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.key;

              return (
                <button
                  key={t.key}
                  onClick={() => handleTabChange(t.key)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${isActive
                    ? "text-indigo-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className="absolute inset-0 -z-10 rounded-xl bg-white border border-slate-200/60 shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}

                  <Icon
                    size={16}
                    className={
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-400"
                    }
                  />

                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Tab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ================= SECURITY TAB ================= */

function SecurityTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2">
        <SessionsCard />
      </div>

      <div>
        <SecurityInfo />
      </div>
    </div>
  );
}

/* ================= SECURITY INFO ================= */

function SecurityInfo() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/85 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">

      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600" />

      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
          <Shield className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Security Guidelines
          </h3>

          <h2 className="text-base font-black text-slate-900 tracking-tight">
            Best Practices
          </h2>
        </div>
      </div>

      <ul className="space-y-3">
        {SECURITY_TIPS.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <span className="text-sm font-semibold text-slate-700">
              {tip}
            </span>
          </li>
        ))}
      </ul>

      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-3">
        <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
          <Lock size={15} />
        </div>

        <div>
          <p className="text-xs font-bold text-indigo-900">
            End-to-End Protection
          </p>

          <p className="text-[11px] text-indigo-700 leading-relaxed">
            Your credentials and session tokens are cryptographically secured
            using high-grade hashing algorithms.
          </p>
        </div>
      </div>
    </div>
  );
}