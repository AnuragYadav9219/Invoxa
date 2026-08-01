import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    useRecoverAccountMutation,
} from "@/features/user/userApi";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { showSuccess, showError } from "@/components/toast/toast";
import { useSendOtpMutation } from "@/features/auth/authApi";
import { ShieldCheck, Mail, KeyRound, Loader2, ChevronLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecoverPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);

    const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
    const [recover, { isLoading: recovering }] = useRecoverAccountMutation();

    useEffect(() => {
        if (location.state?.email) {
            handleSendOtp();
        }
    }, []);

    const handleSendOtp = async () => {
        try {
            await sendOtp({
                email,
                purpose: "RECOVER",
            }).unwrap();

            showSuccess("OTP sent to your email");
            setStep(2);
        } catch (err) {
            showError("Failed to send OTP", {
                description: err?.data?.message,
            });
        }
    };

    const handleRecover = async () => {
        try {
            await recover({ email, otp }).unwrap();

            showSuccess("Account recovered successfully");
            navigate("/login");

        } catch (err) {
            showError("Recovery failed", {
                description: err?.data?.message,
            });
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-slate-950 p-4 overflow-hidden">
            
            {/* Background Glow Accents */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            <Card className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl overflow-hidden relative z-10">
                
                {/* Top Accent Gradient Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <CardHeader className="space-y-3 p-6 pb-2 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-1">
                        <ShieldCheck size={24} />
                    </div>
                    <CardTitle className="text-2xl font-black text-white tracking-tight">
                        Recover Account
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-400 font-medium">
                        {step === 1 
                            ? "Enter your email address to restore your account."
                            : `We've sent a verification code to ${email}`}
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Input
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-2 focus-visible:ring-indigo-500 pl-10 text-sm font-semibold text-white placeholder:text-slate-600 transition-all"
                                        />
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-12 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 cursor-pointer transition-all text-sm active:scale-95"
                                    onClick={handleSendOtp}
                                    disabled={!email || sending}
                                >
                                    {sending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Code...
                                        </>
                                    ) : (
                                        <>
                                            Send Verification Code
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-1">
                                        One-Time Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            placeholder="000000"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            maxLength={6}
                                            className="h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-2 focus-visible:ring-indigo-500 pl-10 text-lg tracking-[0.5em] font-bold text-center text-white placeholder:text-slate-600 transition-all"
                                        />
                                        <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-12 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 cursor-pointer transition-all text-sm active:scale-95"
                                    onClick={handleRecover}
                                    disabled={!otp || recovering}
                                >
                                    {recovering ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Recovering Account...
                                        </>
                                    ) : (
                                        "Recover Account"
                                    )}
                                </Button>

                                <Button
                                    variant="link"
                                    size="sm"
                                    className="px-0 text-slate-400 hover:text-white font-semibold text-xs h-auto"
                                    onClick={() => setStep(1)}
                                >
                                    <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Change email address
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
}