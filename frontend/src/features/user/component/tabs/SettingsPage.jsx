import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SessionsCard from "../SessionsCard";
import { LayoutTemplate, Shield, User } from "lucide-react";
import AccountTab from "./AccountTab";
import InvoiceTemplateTab from "./InvoiceTemplateTab";

/* ================= CONFIG ================= */

const SETTINGS_TABS = [
  { key: "security", label: "Security", icon: Shield, component: SecurityTab },
  { key: "account", label: "Account", icon: User, component: AccountTab },
  { key: "templates", label: "Templates", icon: LayoutTemplate, component: InvoiceTemplateTab },
];

const SECURITY_TIPS = [
  "Always logout from public devices",
  "Use strong and unique passwords",
  "Review active sessions regularly",
  "Enable 2FA for extra security",
];

/* ================= MAIN ================= */

export default function SettingsPage() {
  const [tab, setTab] = useState(
    localStorage.getItem("settingsTab") || "security"
  );

  useEffect(() => {
    localStorage.setItem("settingsTab", tab);
  }, [tab]);

  const ActiveComponent =
    SETTINGS_TABS.find((t) => t.key === tab)?.component || SecurityTab;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your account, security, and sessions
        </p>
      </motion.div>

      {/* TABS */}
      <div className="flex gap-2 border-b pb-1 overflow-x-auto">
        {SETTINGS_TABS.map((t) => {
          const Icon = t.icon;
          return (
            <TabButton
              key={t.key}
              icon={<Icon size={14} />}
              active={tab === t.key}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </TabButton>
          );
        })}
      </div>

      {/* CONTENT */}
      <motion.div
        key={tab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-primary/10 bg-primary/5 p-3"
      >
        <ActiveComponent />
      </motion.div>
    </div>
  );
}

/* ================= SECURITY TAB ================= */

function SecurityTab() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">

      {/* MAIN */}
      <div className="lg:col-span-2 space-y-6">
        <SessionsCard />
      </div>

      {/* SIDEBAR */}
      <div className="space-y-6">
        <SecurityInfo />
      </div>

    </div>
  );
}

/* ================= SECURITY INFO ================= */

function SecurityInfo() {
  return (
    <div className="bg-white rounded-3xl shadow p-6 space-y-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase">
        Security Tips
      </h3>

      <ul className="text-sm text-gray-600 space-y-2">
        {SECURITY_TIPS.map((tip, i) => (
          <li key={i}>• {tip}</li>
        ))}
      </ul>
    </div>
  );
}

/* ================= TAB BUTTON ================= */

function TabButton({ children, icon, active, ...props }) {
  return (
    <button
      {...props}
      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition ${active
        ? "bg-gray-900 text-white"
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        }`}
    >
      {icon}
      {children}
    </button>
  );
}