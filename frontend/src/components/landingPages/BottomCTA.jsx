import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function BottomCTA() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    const handleClick = () => {
        console.log(token)
        if (isLoggedIn) {
            navigate("/dashboard");
        } else {
            navigate("/register");
        }
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden">
            {/* CTA Container */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-950 to-black p-12 md:p-20">

                {/* Background Glow */}
                <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-size-[4rem_4rem]" />

                <div className="relative z-10 max-w-3xl mx-auto text-center">

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold tracking-tight text-white"
                    >
                        Ready to supercharge your business?
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        viewport={{ once: true }}
                        className="mt-6 text-lg leading-8 text-slate-400"
                    >
                        Join thousands of businesses using{" "}
                        <span className="font-semibold text-white">
                            Invoxa
                        </span>{" "}
                        to simplify invoicing, track payments, manage customers,
                        and grow with confidence.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="mt-10"
                    >
                        <motion.button
                            whileHover={{
                                scale: 1.04,
                                boxShadow: "0 15px 40px rgba(79,70,229,0.35)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleClick}
                            className="inline-flex items-center cursor-pointer gap-3 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100"
                        >
                            {isLoggedIn
                                ? "Go to Dashboard"
                                : "Get Started Free"}

                            <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FiArrowRight className="h-5 w-5" />
                            </motion.div>
                        </motion.button>
                    </motion.div>

                    <p className="mt-6 text-sm text-slate-500">
                        No credit card required • Free to get started
                    </p>

                </div>
            </div>
        </section>
    );
}