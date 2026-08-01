import React from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from 'framer-motion';
import { X, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentFailed() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const token = params.get("token");

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.25
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    const handleTryAgain = () => {
        if (token) {
            navigate(`/pay/${token}`);
        } else {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-rose-600 via-orange-600 to-amber-500 p-4 relative overflow-hidden">

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white/10 rounded-full blur-sm"
                        style={{
                            width: Math.random() * 80 + 40,
                            height: Math.random() * 80 + 40,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -45, 0],
                            x: [0, Math.random() * 25 - 12, 0],
                            scale: [1, 1.15, 1],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Main Card: Perfectly phone-responsive sizing scales gracefully */}
            <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 text-center max-w-sm sm:max-w-md w-full border border-white/20 relative z-10"
            >
                {/* Animated Error Icon Container */}
                <div className="relative flex justify-center mb-6 sm:mb-8">
                    {/* Pulsing Alert Rings */}
                    <motion.div
                        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.25, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        className="absolute inset-0 m-auto w-20 h-20 bg-rose-100 rounded-full -z-10"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.45, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.4 }}
                        className="absolute inset-0 m-auto w-20 h-20 bg-rose-50 rounded-full -z-10"
                    />

                    {/* The Red Error Badge */}
                    <motion.div
                        initial={{ scale: 0, rotate: 60 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 15 }}
                        className="w-20 h-20 bg-linear-to-tr from-rose-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-200"
                    >
                        <X className="text-white w-10 h-10 stroke-[3.5]" />
                    </motion.div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-3 sm:space-y-4"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight"
                    >
                        Payment Failed
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-slate-500 font-medium text-sm sm:text-base px-1 sm:px-4 leading-relaxed text-balance"
                    >
                        Your transaction could not be completed. Rest assured, no money was deducted from your account.
                    </motion.p>

                    <motion.div variants={itemVariants} className="pt-4 sm:pt-6 space-y-3">
                        <Button
                            className="w-full bg-linear-to-r cursor-pointer from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-semibold py-5 sm:py-6 text-sm sm:text-base rounded-xl shadow-lg shadow-rose-100 transform active:scale-[0.98] transition-all duration-150 flex items-center justify-center"
                            onClick={handleTryAgain}
                        >
                            <RefreshCw size={18} className="mr-2 animate-[spin_4s_linear_infinite]" />
                            Try Again
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-5 sm:py-6 text-sm sm:text-base rounded-xl transform active:scale-[0.98] transition-all duration-150 flex items-center justify-center"
                            onClick={() => navigate("/")}
                        >
                            <ArrowLeft size={18} className="mr-2" />
                            Back to Home
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}