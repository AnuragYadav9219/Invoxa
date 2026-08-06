import { useState } from "react";
import {
    Bug,
    Lightbulb,
    MessageSquare,
    LifeBuoy,
    ArrowRight,
    Mail,
    HelpCircle,
    Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import SupportForm from "../components/SupportForm";

const categories = [
    {
        title: "Bug Report",
        description: "Encountered an error or broken component? Let us squash it.",
        value: "BUG",
        icon: Bug,
        color: "text-red-400 bg-red-500/10 border-red-500/20 group-hover:border-red-500/40",
    },
    {
        title: "Feature Request",
        description: "Have an idea to make Invoxa better? We'd love to hear it.",
        value: "FEATURE_REQUEST",
        icon: Lightbulb,
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/40",
    },
    {
        title: "Feedback",
        description: "Share your general thoughts or user experience feedback.",
        value: "FEEDBACK",
        icon: MessageSquare,
        color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/40",
    },
    {
        title: "General Support",
        description: "Need help with billing, accounts, or invoices?",
        value: "SUPPORT",
        icon: LifeBuoy,
        color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:border-cyan-500/40",
    },
];

const faqs = [
    {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page and follow the instructions sent to your email.",
    },
    {
        q: "How quickly will I receive a response?",
        a: "Our support team usually responds within 24 hours.",
    },
];

export default function Support() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);

    const handleOpenModal = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
            {/* Background Glows & Grid */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-size-[4rem_4rem]" />
                <div className="absolute left-1/2 top-[-10%] h-120 w-200 -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[140px]" />
                <div className="absolute right-[-10%] bottom-[10%] h-100 w-100 rounded-full bg-cyan-600/10 blur-[140px]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto mb-16 max-w-3xl text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 shadow-sm shadow-indigo-500/10">
                        <Sparkles size={14} className="text-indigo-400" />
                        Help Center & Support
                    </span>

                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                        How can we help you <span className="bg-linear-to-r from-indigo-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">today?</span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                        Select a category below to submit a structured ticket, and our team will get back to you promptly.
                    </p>
                </motion.div>

                {/* Support Cards Grid */}
                <div className="mb-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.value}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ y: -6, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleOpenModal(item)}
                                className="group relative flex flex-col justify-between cursor-pointer rounded-3xl border border-slate-800/80 bg-slate-950/60 p-7 backdrop-blur-2xl transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-indigo-500/10"
                            >
                                <div>
                                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors ${item.color}`}>
                                        <Icon size={26} />
                                    </div>

                                    <h3 className="text-xl font-semibold text-white tracking-tight transition-colors group-hover:text-indigo-300">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-indigo-400 transition-all duration-300">
                                    <span>Create Ticket</span>
                                    <ArrowRight
                                        size={16}
                                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Section: Contact & FAQs */}
                <div className="grid gap-8 lg:grid-cols-12 items-start">
                    {/* Direct Contact Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-5 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-2xl relative overflow-hidden"
                    >
                        <div className="absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
                        
                        <div className="flex items-center gap-3 text-indigo-400 mb-2">
                            <HelpCircle size={20} />
                            <span className="text-xs font-semibold uppercase tracking-wider">Direct Line</span>
                        </div>

                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            Need Immediate Help?
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-slate-400">
                            Can't find what you're looking for? Send us a direct email and our customer success team will respond as quickly as possible.
                        </p>

                        <a
                            href="mailto:noreply.invoxa@gmail.com"
                            className="mt-8 group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-sm font-medium text-slate-200 transition-all hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-lg"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                                <Mail size={18} />
                            </div>
                            <span className="truncate">noreply.invoxa@gmail.com</span>
                        </a>
                    </motion.div>

                    {/* FAQs Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="lg:col-span-7 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-2xl"
                    >
                        <h2 className="mb-6 text-2xl font-bold text-white tracking-tight">
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="group rounded-2xl border border-slate-800/60 bg-slate-950/50 p-5 transition-colors hover:border-slate-700"
                                >
                                    <h3 className="font-medium text-slate-200 group-hover:text-white transition-colors">
                                        {faq.q}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Popup Support Modal Form */}
            <SupportForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedCategory={selectedCategory}
            />
        </div>
    );
}