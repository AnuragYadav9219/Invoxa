import { MessageSquareHeart, Sparkles, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import FeedbackForm from "../components/FeedbackForm";

export default function Feedback() {

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            {/* Background Pattern & Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-size-[3rem_3rem]" />
                <div className="absolute left-1/2 top-0 h-128 w-lg -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[140px]" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-5xl px-6 py-12 lg:py-20">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-indigo-300">
                        <MessageSquareHeart size={14} />
                        Feedback Portal
                    </span>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                        Help Shape{" "}
                        <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Invoxa
                        </span>
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">
                        Your insights and recommendations directly influence our product roadmap,
                        helping us build a streamlined invoicing experience for modern teams.
                    </p>
                </motion.div>

                {/* Value Props / Highlights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-12 grid gap-4 md:grid-cols-3"
                >
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-slate-700/80">
                        <Users className="mb-3 text-indigo-400" size={20} />
                        <h2 className="text-base font-semibold text-white">User-Centric</h2>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                            Every piece of feedback is reviewed to prioritize features that matter most to you.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-slate-700/80">
                        <Star className="mb-3 text-amber-400 fill-amber-400/20" size={20} />
                        <h2 className="text-base font-semibold text-white">Community Driven</h2>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                            Core platform enhancements stem directly from constructive user suggestions.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-slate-700/80">
                        <Sparkles className="mb-3 text-cyan-400" size={20} />
                        <h2 className="text-base font-semibold text-white">Continuous Delivery</h2>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                            We ship regular updates to keep Invoxa fast, reliable, and intuitive.
                        </p>
                    </div>
                </motion.div>

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto mt-12 max-w-3xl rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl md:p-8"
                >
                    <FeedbackForm />
                </motion.div>

            </div>
        </div>
    );
}