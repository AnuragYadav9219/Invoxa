import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccess() {
    const navigate = useNavigate();

    // Stagger animation container variants for children text elements
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 relative overflow-hidden">
            
            {/* Floating Background Decorative Particles */}
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
                            y: [0, -40, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Main Card: Scales perfectly on mobile screen widths */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.93, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 text-center max-w-sm sm:max-w-md w-full border border-white/20 relative z-10"
            >
                {/* Animated Icon Container */}
                <div className="relative flex justify-center mb-6 sm:mb-8">
                    {/* Pulsing Background Rings */}
                    <motion.div 
                        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.3, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        className="absolute inset-0 m-auto w-20 h-20 bg-green-100 rounded-full -z-10"
                    />
                    <motion.div 
                        animate={{ scale: [1, 1.45, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.4 }}
                        className="absolute inset-0 m-auto w-20 h-20 bg-green-50 rounded-full -z-10"
                    />
                    
                    {/* The Checkmark Badge */}
                    <motion.div 
                        initial={{ scale: 0, rotate: -60 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 15 }}
                        className="w-20 h-20 bg-linear-to-tr from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200"
                    >
                        <Check className="text-white w-10 h-10 stroke-[3.5]" />
                    </motion.div>
                </div>

                {/* Staggered Text and CTA Content */}
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
                        Payment Successful!
                    </motion.h1>

                    <motion.p 
                        variants={itemVariants}
                        className="text-slate-500 font-medium text-sm sm:text-base px-2 sm:px-4 leading-relaxed text-balance"
                    >
                        Thank you! Your invoice has been paid successfully. A receipt has been sent to your email.
                    </motion.p>

                    <motion.div variants={itemVariants} className="pt-4 sm:pt-6">
                        <Button
                            className="w-full bg-linear-to-r cursor-pointer from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-5 sm:py-6 text-sm sm:text-base rounded-xl shadow-lg shadow-indigo-100 transform active:scale-[0.98] transition-all duration-150"
                            onClick={() => navigate("/")}
                        >
                            Back to Home
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}