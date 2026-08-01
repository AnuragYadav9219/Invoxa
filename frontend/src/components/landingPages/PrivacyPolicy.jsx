import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    FiShield,
    FiDatabase,
    FiLock,
    FiMail,
    FiServer,
    FiGlobe,
    FiRefreshCw,
    FiPrinter,
    FiCopy,
    FiCheck,
    FiChevronRight,
    FiSearch,
    FiDownload,
    FiShare2,
    FiEye,
    FiCpu,
    FiAlertCircle,
    FiUserCheck,
} from "react-icons/fi";

// Comprehensive Privacy Policy Dataset
const privacySections = [
    {
        id: "overview",
        icon: FiShield,
        category: "General",
        title: "1. Overview & Scope",
        summary: "Introduction to Invoxa's commitment to protecting your privacy.",
        content: [
            "Invoxa ('we', 'us', or 'our') operates as an enterprise invoicing and business management software-as-a-service (SaaS) platform. This Privacy Policy outlines our practices regarding the collection, utilization, storage, and protection of your data when using our applications, websites, APIs, and associated services (collectively, the 'Service').",
            "By accessing or using Invoxa, you acknowledge that you have read, understood, and agreed to the practices described in this policy. If you do not agree with any terms outlined herein, you must immediately cease using our services.",
        ],
    },
    {
        id: "information-collected",
        icon: FiDatabase,
        category: "Data Collection",
        title: "2. Information We Collect",
        summary: "Details on personal details, account data, and operational business inputs.",
        content: [
            "We collect information in three primary ways: information you directly provide, automatically collected telemetry data, and information from integrated third-party platforms.",
            "A. Direct Account & Profile Information: When registering for Invoxa, we collect personal identifiers including your full name, work email address, company title, business name, phone number, physical address, tax identification numbers, and account credentials.",
            "B. Operational Business Data: To provide our services, we process data you voluntarily upload or generate through the platform. This includes customer billing records, invoice metadata, payment details, itemized product catalogues, currency configurations, and transaction logs.",
            "C. Automated Technical Telemetry: When you interact with our platform, we automatically record system information including IP addresses, browser specs, device identifiers, operating system metrics, referral URLs, access timestamps, and feature utilization logs.",
        ],
    },
    {
        id: "cookies-tracking",
        icon: FiEye,
        category: "Data Collection",
        title: "3. Cookies & Tracking Technologies",
        summary: "How we utilize cookies, local storage, and analytical trackers.",
        content: [
            "We use first-party and essential third-party cookies, session state objects, and local storage mechanisms to deliver a seamless user experience.",
            "A. Essential Cookies: Critical for security authentication, session management, and load balancing across our infrastructure.",
            "B. Analytics & Performance: We utilize privacy-conscious analytical tools to understand feature engagement, identify UI bottlenecks, and optimize app response times. These cookies collect aggregated, non-identifiable telemetry.",
            "C. Managing Preferences: You can configure your browser to reject non-essential cookies. However, disabling technical cookies may impact core functionalities, such as remaining logged into your account or retaining session settings.",
        ],
    },
    {
        id: "how-we-use",
        icon: FiCpu,
        category: "Data Usage",
        title: "4. How We Process & Use Your Information",
        summary: "Purposes for processing data, automated processing, and service delivery.",
        content: [
            "Invoxa processes personal and business data strictly under lawful legal bases, including contractual necessity, legitimate business interests, and legal compliance.",
            "• Service Delivery: Generating PDF invoices, executing email notifications, calculating tax rates, and computing business financial analytics.",
            "• Account Security & Authentication: Verifying user identities, preventing multi-tenant data breaches, enforcing multi-factor authentication, and monitoring fraud.",
            "• System Optimization: Debugging software errors, training algorithmic models for automated receipt parsing, and scaling server infrastructure based on load.",
            "• Operational Communications: Delivering essential system alerts, product updates, security advisories, billing receipts, and support responses.",
        ],
    },
    {
        id: "third-party-sharing",
        icon: FiGlobe,
        category: "Data Sharing",
        title: "5. Third-Party Sharing & Processors",
        summary: "Third-party vendors, sub-processors, and legal disclosure policies.",
        content: [
            "Invoxa does not sell, rent, or trade your personal or business data to advertisers or data brokers under any circumstances.",
            "We share data only with verified third-party sub-processors bound by strict Data Processing Agreements (DPAs) meeting SOC 2 and GDPR standards. Our primary sub-processors include:",
            "• Cloud Hosting Infrastructure: AWS / Google Cloud Platform (Encrypted storage and serverless computing).",
            "• Payment Gateways: Stripe / PayPal (Payment tokenization and PCI-DSS compliance).",
            "• Transactional Email: SendGrid / Postmark (Secured delivery of invoice PDFs and authentication tokens).",
            "• Legal Disclosures: We may disclose data if required by law enforcement under a valid subpoena, court order, or statutory legal requirement.",
        ],
    },
    {
        id: "data-security",
        icon: FiLock,
        category: "Security",
        title: "6. Security Architecture & Encryption",
        summary: "Our defense-in-depth security measures and encryption standards.",
        content: [
            "We implement robust technical and organizational security controls to protect your data from unauthorized access, alteration, disclosure, or destruction.",
            "• Encryption in Transit & Rest: All network traffic is encrypted using TLS 1.3 protocol. Sensitive database fields and stored business documents are encrypted using AES-256 bit encryption key management.",
            "• Access Control: Internal team access to production environments operates on strict Principle of Least Privilege (PoLP) and Zero-Trust architecture, requiring multi-factor hardware security keys.",
            "• Vulnerability Management: We conduct continuous automated code vulnerability scanning, periodic third-party penetration testing, and maintain real-time threat monitoring systems.",
        ],
    },
    {
        id: "data-retention",
        icon: FiServer,
        category: "Data Storage",
        title: "7. Data Storage & Retention Policies",
        summary: "Storage locations, lifecycle management, and account termination cleanup.",
        content: [
            "Data is stored in high-security, geographically redundant cloud data centers located in the United States and European Union.",
            "We retain your personal and business data only for as long as your account remains active or as required to fulfill legal, accounting, and regulatory tax obligations.",
            "Upon voluntary account deletion, your active database records are scrubbed immediately. Full deletion across cold-tier encrypted system backups completes automatically within 30 days.",
        ],
    },
    {
        id: "user-rights",
        icon: FiUserCheck,
        category: "Compliance",
        title: "8. Your Legal Rights (GDPR, CCPA & Global Rights)",
        summary: "Your statutory rights regarding data access, portability, and deletion.",
        content: [
            "Depending on your jurisdiction (including the EU, UK, California, and other regions), you possess statutory rights regarding your personal data:",
            "• Right to Access & Export: You can export your full business data, invoices, and customer lists in structured JSON/CSV formats at any time.",
            "• Right to Correction: You can update incorrect or incomplete profile information through your user settings dashboard.",
            "• Right to Erasure ('Right to be Forgotten'): You may request full account and data deletion by contacting our privacy officer.",
            "• Right to Restrict Processing: You have the right to object to or restrict processing of specific non-essential operational metrics.",
        ],
    },
    {
        id: "international-transfers",
        icon: FiGlobe,
        category: "Compliance",
        title: "9. International Data Transfers",
        summary: "Cross-border data routing and Standard Contractual Clauses.",
        content: [
            "As a global platform, data collected by Invoxa may be transferred to, and stored in, facilities located outside your state, province, or country.",
            "When transferring personal data internationally from the European Economic Area (EEA), United Kingdom, or Switzerland, we utilize EU Standard Contractual Clauses (SCCs) and Data Transfer Impact Assessments to ensure adequate data protection standards.",
        ],
    },
    {
        id: "policy-changes",
        icon: FiRefreshCw,
        category: "General",
        title: "10. Policy Updates & Modifications",
        summary: "Notification procedures for material changes to this policy.",
        content: [
            "We reserve the right to modify this Privacy Policy to reflect changes in legal mandates, regulatory guidelines, or product features.",
            "When material updates occur, we will notify registered account owners via email 30 days prior to implementation and prominently display an alert header inside the Invoxa application dashboard.",
        ],
    },
];

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedLink, setCopiedLink] = useState(null);

    // Filter sections based on search query
    const filteredSections = useMemo(() => {
        if (!searchQuery.trim()) return privacySections;
        const query = searchQuery.toLowerCase();
        return privacySections.filter(
            (sec) =>
                sec.title.toLowerCase().includes(query) ||
                sec.summary.toLowerCase().includes(query) ||
                sec.content.some((text) => text.toLowerCase().includes(query))
        );
    }, [searchQuery]);

    // Track active section on scroll
    useEffect(() => {
        if (searchQuery) return; // Disable scroll tracking while searching

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 220;
            for (const section of privacySections) {
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
        navigator.clipboard.writeText("privacy@invoxa.tech");
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
        const textContent = privacySections
            .map((s) => `${s.title.toUpperCase()}\n\n${s.content.join("\n\n")}`)
            .join("\n\n" + "=".repeat(60) + "\n\n");

        const element = document.createElement("a");
        const file = new Blob([textContent], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "Invoxa_Privacy_Policy.txt";
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
                            <FiShield className="text-sm" />
                            Security & Trust Center
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
                                title="Print page"
                            >
                                <FiPrinter className="text-sm" />
                                Print
                            </button>
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                        Privacy Policy
                    </h1>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-400">
                        <p className="text-base max-w-3xl text-slate-400 leading-relaxed">
                            Transparency is core to Invoxa. Learn how we collect, safeguard, and give you complete control over your personal and financial business data.
                        </p>
                        <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400 font-mono bg-slate-900/60 border border-slate-800/80 px-3 py-2 rounded-xl">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Effective: July 24, 2026</span>
                        </div>
                    </div>

                    {/* Search & Quick Filter Bar */}
                    <div className="mt-8 relative max-w-2xl">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search policy terms (e.g., 'cookies', 'encryption', 'GDPR', 'data deletion')..."
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
                                    Document Sections ({filteredSections.length})
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

                            {/* Privacy Officer Contact Card */}
                            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
                                    <FiAlertCircle className="text-indigo-400" />
                                    Data Protection Officer
                                </div>
                                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                                    Questions about data governance or DPA requests? Contact our dedicated privacy team.
                                </p>
                                <button
                                    onClick={handleCopyEmail}
                                    className="w-full flex items-center justify-center gap-2 text-xs font-medium bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 px-3 py-2 rounded-xl transition-all"
                                >
                                    {copiedEmail ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                                    {copiedEmail ? "Copied privacy@invoxa.tech" : "Copy DPO Email"}
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Legal Content Column */}
                    <main className="lg:col-span-8 space-y-6">

                        {filteredSections.length === 0 ? (
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
                                <FiAlertCircle className="mx-auto text-3xl text-indigo-400 mb-3" />
                                <h3 className="text-lg font-semibold text-white">No matching policy terms found</h3>
                                <p className="text-sm text-slate-400 mt-1">
                                    No sections match your search query "{searchQuery}". Try searching for broader terms like "data", "security", or "rights".
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

                                            {/* Share section anchor button */}
                                            <button
                                                onClick={() => handleCopySectionLink(section.id)}
                                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 p-2 rounded-lg hover:bg-slate-800 transition-all"
                                                title="Copy link to this section"
                                            >
                                                {copiedLink === section.id ? (
                                                    <FiCheck className="text-emerald-400 text-xs" />
                                                ) : (
                                                    <FiShare2 className="text-xs" />
                                                )}
                                            </button>
                                        </div>

                                        <p className="text-xs font-medium text-slate-400 mb-4 pb-3 border-b border-slate-800/60 italic">
                                            Summary: {section.summary}
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
                                    Need a custom Data Processing Agreement (DPA)?
                                </h3>
                                <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                                    Enterprise plan subscribers can request signed standard contractual clauses and sub-processor DPAs directly from our compliance legal desk.
                                </p>
                            </div>

                            <div className="mt-6 sm:mt-0 shrink-0">
                                <a
                                    href="mailto:privacy@invoxa.tech?subject=DPA%20Request%20-%20Invoxa"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition active:scale-95 shadow-lg shadow-indigo-600/25"
                                >
                                    Request DPA Agreement
                                </a>
                            </div>
                        </motion.div>

                    </main>

                </div>
            </div>
        </section>
    );
}