import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    FiFileText,
    FiShield,
    FiLock,
    FiCreditCard,
    FiDatabase,
    FiAlertCircle,
    FiGlobe,
    FiMail,
    FiPrinter,
    FiCopy,
    FiCheck,
    FiChevronRight,
    FiSearch,
    FiDownload,
    FiShare2,
    FiCheckCircle,
    FiCpu,
    FiRefreshCw,
} from "react-icons/fi";
const termsSections = [
  {
    id: "acceptance",
    icon: FiCheckCircle,
    category: "Agreement",
    title: "1. Acceptance of Terms",
    summary: "Your agreement to use Invoxa.",
    content: [
      "By creating an account or using Invoxa ('Service'), you agree to be bound by these Terms of Service.",
      "If you are using the Service on behalf of a business or organization, you represent that you have the authority to bind that entity to these Terms.",
      "If you do not agree with these Terms, you must not access or use the Service.",
    ],
  },
  {
    id: "service",
    icon: FiCpu,
    category: "Platform",
    title: "2. Description of Service",
    summary: "Cloud-based invoicing and business management platform.",
    content: [
      "Invoxa provides cloud-based invoicing, customer management, payment tracking, business analytics, and related productivity tools.",
      "We may improve, modify, or discontinue features to enhance the platform or comply with legal and technical requirements.",
      "Where practical, we will notify users of significant changes affecting the Service.",
    ],
  },
  {
    id: "account",
    icon: FiShield,
    category: "Accounts",
    title: "3. Account Registration & Security",
    summary: "Your responsibilities for maintaining a secure account.",
    content: [
      "You must provide accurate and complete information when creating an account.",
      "You are responsible for maintaining the confidentiality of your login credentials.",
      "You are responsible for all activities that occur under your account and must notify us immediately if you suspect unauthorized access.",
    ],
  },
  {
    id: "billing",
    icon: FiCreditCard,
    category: "Billing",
    title: "4. Subscription, Billing & Payments",
    summary: "Subscription plans, renewals, and payment terms.",
    content: [
      "Some features of Invoxa may require a paid subscription.",
      "Subscription fees are billed according to your selected plan.",
      "Unless otherwise stated, subscription fees are generally non-refundable except where required by applicable law.",
      "Applicable taxes may be added where legally required.",
    ],
  },
  {
    id: "ownership",
    icon: FiDatabase,
    category: "Data",
    title: "5. Customer Data Ownership",
    summary: "You own your business data.",
    content: [
      "You retain ownership of all invoices, customer records, products, payment records, and other business information you upload or create.",
      "You grant Invoxa a limited license to process, store, and transmit your data solely for providing and maintaining the Service.",
      "We do not sell your business data to third parties.",
    ],
  },
  {
    id: "acceptable-use",
    icon: FiAlertCircle,
    category: "Compliance",
    title: "6. Acceptable Use",
    summary: "Rules for using the platform responsibly.",
    content: [
      "You agree not to use Invoxa for fraudulent, unlawful, or deceptive activities.",
      "You must not attempt to gain unauthorized access to our systems or interfere with the operation of the Service.",
      "Uploading malware, harmful code, or attempting to disrupt the platform is strictly prohibited.",
      "You may not resell or redistribute the Service without our written permission.",
    ],
  },
  {
    id: "privacy-security",
    icon: FiLock,
    category: "Security",
    title: "7. Privacy & Security",
    summary: "Protection of your information.",
    content: [
      "We use commercially reasonable security measures to protect customer information.",
      "Data is transmitted over secure connections where supported.",
      "Our collection and use of personal information are governed by our Privacy Policy.",
    ],
  },
  {
    id: "availability",
    icon: FiGlobe,
    category: "Availability",
    title: "8. Service Availability",
    summary: "Platform uptime and maintenance.",
    content: [
      "We strive to provide reliable access to the Service but cannot guarantee uninterrupted availability.",
      "Maintenance, upgrades, security improvements, or unforeseen technical issues may temporarily affect the Service.",
      "Where possible, we will provide advance notice of scheduled maintenance.",
    ],
  },
  {
    id: "intellectual-property",
    icon: FiFileText,
    category: "Ownership",
    title: "9. Intellectual Property",
    summary: "Ownership of the Invoxa platform.",
    content: [
      "The Invoxa platform, including its software, branding, logos, design, documentation, and related content, is owned by Invoxa or its licensors.",
      "These Terms do not grant you ownership of any intellectual property belonging to Invoxa.",
    ],
  },
  {
    id: "termination",
    icon: FiAlertCircle,
    category: "Accounts",
    title: "10. Suspension & Termination",
    summary: "Account suspension and termination.",
    content: [
      "We may suspend or terminate your account if you violate these Terms or engage in unlawful or abusive activities.",
      "You may stop using the Service and close your account at any time.",
      "Certain legal obligations may continue even after account termination.",
    ],
  },
  {
    id: "liability",
    icon: FiAlertCircle,
    category: "Legal",
    title: "11. Limitation of Liability",
    summary: "Limits on our legal responsibility.",
    content: [
      "The Service is provided on an 'AS IS' and 'AS AVAILABLE' basis.",
      "To the maximum extent permitted by law, Invoxa is not liable for indirect, incidental, special, or consequential damages arising from your use of the Service.",
      "Our total liability for any claim will not exceed the amount you paid to Invoxa during the twelve (12) months preceding the claim.",
    ],
  },
  {
    id: "force-majeure",
    icon: FiGlobe,
    category: "Legal",
    title: "12. Force Majeure",
    summary: "Events beyond our reasonable control.",
    content: [
      "Invoxa is not responsible for delays or failures caused by events beyond our reasonable control, including natural disasters, internet outages, cyberattacks, government actions, labor disputes, or failures of third-party service providers.",
    ],
  },
  {
    id: "changes",
    icon: FiRefreshCw,
    category: "Updates",
    title: "13. Changes to These Terms",
    summary: "How we update these Terms.",
    content: [
      "We may revise these Terms from time to time.",
      "Material changes will be communicated through the Service or by email where appropriate.",
      "Continued use of the Service after updated Terms become effective constitutes acceptance of those changes.",
    ],
  },
  {
    id: "governing-law",
    icon: FiGlobe,
    category: "Jurisdiction",
    title: "14. Governing Law",
    summary: "Applicable law and jurisdiction.",
    content: [
      "These Terms are governed by the laws of India.",
      "Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts located in Uttar Pradesh, India.",
    ],
  },
];

export default function TermsOfService() {
    const [activeSection, setActiveSection] = useState("acceptance");
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedLink, setCopiedLink] = useState(null);

    // Filter sections based on search query
    const filteredSections = useMemo(() => {
        if (!searchQuery.trim()) return termsSections;
        const query = searchQuery.toLowerCase();
        return termsSections.filter(
            (sec) =>
                sec.title.toLowerCase().includes(query) ||
                sec.summary.toLowerCase().includes(query) ||
                sec.content.some((text) => text.toLowerCase().includes(query))
        );
    }, [searchQuery]);

    // Track active section on scroll
    useEffect(() => {
        if (searchQuery) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 220;
            for (const section of termsSections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [searchQuery]);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText("noreply.invoxa@gmail.com");
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const handleCopySectionLink = (id) => {
        const url = `${window.location.origin}${window.location.pathname}#${id}`;
        navigator.clipboard.writeText(url);
        setCopiedLink(id);
        setTimeout(() => setCopiedLink(null), 2000);
    };

    const handleDownloadTxt = () => {
        const textContent = termsSections
            .map((s) => `${s.title.toUpperCase()}\n\n${s.content.join("\n\n")}`)
            .join("\n\n" + "=".repeat(60) + "\n\n");

        const element = document.createElement("a");
        const file = new Blob([textContent], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "Invoxa_Terms_Of_Service.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <section className="min-h-screen bg-slate-950 text-slate-300 pt-28 pb-24 selection:bg-indigo-500/30 selection:text-indigo-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border-b border-slate-800/80 pb-10 mb-10"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
                            <FiFileText className="text-sm" />
                            Legal Governance
                        </div>

                        {/* Top Utility Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDownloadTxt}
                                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors border border-slate-800 hover:border-slate-700 bg-slate-900/80 px-3 py-1.5 rounded-lg"
                                title="Download plain text version"
                            >
                                <FiDownload className="text-sm" />
                                Export TXT
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors border border-slate-800 hover:border-slate-700 bg-slate-900/80 px-3 py-1.5 rounded-lg"
                                title="Print legal terms"
                            >
                                <FiPrinter className="text-sm" />
                                Print
                            </button>
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                        Terms of Service
                    </h1>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-400">
                        <p className="text-base max-w-3xl text-slate-400 leading-relaxed">
                            Please review these legal terms carefully before using the Invoxa platform. These terms outline your rights, billing obligations, and platform usage limits.
                        </p>
                        <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400 font-mono bg-slate-900/60 border border-slate-800/80 px-3 py-2 rounded-xl">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Last Updated: July 24, 2026</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-8 relative max-w-2xl">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search terms (e.g., 'billing', 'cancellation', 'liability', 'data ownership')..."
                                className="w-full pl-11 pr-10 py-3 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Desktop Sticky Table of Contents Sidebar */}
                    <aside className="hidden lg:block lg:col-span-4">
                        <div className="sticky top-28 space-y-4">
                            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 px-2">
                                    Table of Contents ({filteredSections.length})
                                </p>
                                <nav className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar">
                                    {filteredSections.map((section) => {
                                        const isActive = activeSection === section.id && !searchQuery;
                                        return (
                                            <a
                                                key={section.id}
                                                href={`#${section.id}`}
                                                onClick={() => setActiveSection(section.id)}
                                                className={`group flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all ${isActive
                                                        ? "bg-indigo-600/15 text-indigo-300 font-medium border border-indigo-500/30"
                                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                                    }`}
                                            >
                                                <span className="truncate mr-2">{section.title}</span>
                                                <FiChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? "opacity-100 text-indigo-400" : "opacity-0 group-hover:opacity-100"
                                                    }`} />
                                            </a>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Contact Card */}
                            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
                                    <FiAlertCircle className="text-indigo-400" />
                                    Legal Desk Inquiries
                                </div>
                                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                                    Need legal clarification regarding account terms or enterprise licensing? Contact our legal support desk.
                                </p>
                                <button
                                    onClick={handleCopyEmail}
                                    className="w-full flex items-center justify-center gap-2 text-xs font-medium bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 px-3 py-2 rounded-xl transition-all"
                                >
                                    {copiedEmail ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                                    {copiedEmail ? "Email Copied!" : "Copy Support Email"}
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Column */}
                    <main className="lg:col-span-8 space-y-6">

                        {filteredSections.length === 0 ? (
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
                                <FiAlertCircle className="mx-auto text-3xl text-indigo-400 mb-3" />
                                <h3 className="text-lg font-semibold text-white">No matching legal clauses found</h3>
                                <p className="text-sm text-slate-400 mt-1">
                                    No sections match your search query "{searchQuery}". Try searching for terms like "billing", "account", or "liability".
                                </p>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="mt-4 text-xs font-medium text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-lg"
                                >
                                    Reset Search Filters
                                </button>
                            </div>
                        ) : (
                            filteredSections.map((section, index) => {
                                const Icon = section.icon;

                                return (
                                    <motion.section
                                        key={section.id}
                                        id={section.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-40px" }}
                                        transition={{ duration: 0.3, delay: index * 0.02 }}
                                        className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-sm transition-all hover:border-slate-700/80 hover:bg-slate-900/60"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-2.5 text-indigo-400 shrink-0">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                                                        {section.category}
                                                    </span>
                                                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
                                                        {section.title}
                                                    </h2>
                                                </div>
                                            </div>

                                            {/* Share section link button */}
                                            <button
                                                onClick={() => handleCopySectionLink(section.id)}
                                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 p-2 rounded-lg hover:bg-slate-800 transition-all"
                                                title="Copy direct link to clause"
                                            >
                                                {copiedLink === section.id ? (
                                                    <FiCheck className="text-emerald-400 text-xs" />
                                                ) : (
                                                    <FiShare2 className="text-xs" />
                                                )}
                                            </button>
                                        </div>

                                        <p className="text-xs font-medium text-slate-400 mb-4 pb-3 border-b border-slate-800/60 italic">
                                            Clause Summary: {section.summary}
                                        </p>

                                        <div className="space-y-3.5">
                                            {section.content.map((paragraph, idx) => (
                                                <p
                                                    key={idx}
                                                    className="leading-relaxed text-slate-300 text-sm sm:text-base font-normal"
                                                >
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </motion.section>
                                );
                            })
                        )}

                        {/* Interactive Legal Action Banner */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="rounded-2xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/10 via-slate-900 to-slate-900 p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 mt-12"
                        >
                            <div className="space-y-2">
                                <div className="inline-flex p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                    <FiMail className="text-xl" />
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    Questions regarding these Terms?
                                </h3>
                                <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                                    Our legal and compliance team is available to answer any questions regarding terms of use, enterprise licensing, or billing rules.
                                </p>
                            </div>

                            <div className="mt-6 sm:mt-0 shrink-0">
                                <a
                                    href="mailto:noreply.invoxa@gmail.com?subject=Terms%20of%20Service%20Inquiry"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition active:scale-95 shadow-lg shadow-indigo-600/25"
                                >
                                    Email Legal Team
                                </a>
                            </div>
                        </motion.div>

                    </main>

                </div>
            </div>
        </section>
    );
}