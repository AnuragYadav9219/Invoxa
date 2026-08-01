import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Mail,
  Lock,
  ArrowLeft,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import {
  useSendOtpMutation,
  useResetPasswordMutation,
} from "@/features/auth/authApi";

import { showSuccess, showError } from "@/components/toast/toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const containerVars = {
  initial: { opacity: 0, y: 25, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const stepVars = {
  initial: { opacity: 0, x: 30, filter: "blur(4px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: -30, filter: "blur(4px)", transition: { duration: 0.2 } },
};

export default function AuthOtpPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef([]);
  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSendOtp = async () => {
    try {
      await sendOtp({ email, purpose: "RESET" }).unwrap();
      setStep(2);
      setResendTimer(30);
      showSuccess("Recovery code sent to your inbox");
    } catch (err) {
      showError(err?.data?.message || "Check your email and try again");
    }
  };

  const handleVerifyOtp = () => {
    if (otp.join("").length === 6) {
      setStep(3);
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) return showError("Passwords do not match");
    try {
      await resetPassword({
        email,
        otp: otp.join(""),
        newPassword: password,
      }).unwrap();
      showSuccess("Account secured successfully");
      navigate("/login");
    } catch (err) {
      showError(err?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-950 font-sans">
      {/* Animated Mesh / Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-indigo-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-purple-600/20 rounded-full blur-[120px]"
        />
      </div>

      <motion.div variants={containerVars} initial="initial" animate="animate" className="w-full max-w-md relative z-10">
        <Card className="backdrop-blur-xl bg-slate-900/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-slate-800/80 rounded-[2.5rem] overflow-hidden text-slate-100">
          
          {/* Top Animated Progress Strip */}
          <div className="h-1.5 w-full bg-slate-800 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>

          <CardContent className="p-8 sm:p-10 space-y-8">
            
            {/* Header Section */}
            <div className="text-center relative">
              {step > 1 && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setStep(step - 1)}
                  className="absolute left-0 top-1 p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full transition-all cursor-pointer"
                >
                  <ArrowLeft size={20} />
                </motion.button>
              )}

              {/* Step indicator tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-4 border border-indigo-500/20">
                <Sparkles size={12} />
                <span>Step {step} of 3</span>
              </div>

              <motion.div
                key={step}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mx-auto w-16 h-16 bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4 text-indigo-400 border border-indigo-500/30 shadow-inner"
              >
                {step === 1 && <Mail size={28} />}
                {step === 2 && <ShieldCheck size={28} />}
                {step === 3 && <Lock size={28} />}
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {step === 1 && "Forgot Password?"}
                {step === 2 && "Verify Identity"}
                {step === 3 && "Secure Account"}
              </h1>
              
              <p className="text-slate-400 mt-2 text-sm sm:text-base leading-relaxed">
                {step === 1 && "No worries! Enter your email to get a reset code."}
                {step === 2 && `We've dispatched a secure code to ${email}`}
                {step === 3 && "Choose a robust password to secure your portal."}
              </p>
            </div>

            <AnimatePresence mode="wait">
              
              {/* --- STEP 1: EMAIL --- */}
              {step === 1 && (
                <motion.div key="s1" variants={stepVars} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                      <Input
                        type="email"
                        placeholder="name@company.com"
                        className="pl-12 h-14 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSendOtp}
                    disabled={!email || sending}
                    className="w-full h-14 rounded-2xl cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98]"
                  >
                    {sending ? <Loader2 className="animate-spin" /> : "Send Recovery Code"}
                  </Button>
                </motion.div>
              )}

              {/* --- STEP 2: OTP --- */}
              {step === 2 && (
                <motion.div key="s2" variants={stepVars} initial="initial" animate="animate" exit="exit" className="space-y-8">
                  <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        maxLength={1}
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className="w-full h-14 sm:h-16 text-center text-2xl font-bold bg-slate-950/60 border-2 border-slate-800 text-white rounded-2xl focus:border-indigo-500 focus:bg-slate-950 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={otp.join("").length !== 6}
                      className="w-full h-14 rounded-2xl cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all"
                    >
                      Verify & Continue
                    </Button>
                    
                    <div className="text-center">
                      <button
                        disabled={resendTimer > 0 || sending}
                        onClick={handleSendOtp}
                        className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 transition-colors"
                      >
                        <RefreshCw size={14} className={sending ? "animate-spin" : ""} />
                        {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- STEP 3: PASSWORD --- */}
              {step === 3 && (
                <motion.div key="s3" variants={stepVars} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  <div className="space-y-4">
                    
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        className="pl-12 pr-12 h-14 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="pl-12 h-14 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {password === confirmPassword && confirmPassword.length > 5 && (
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
                      )}
                    </div>

                  </div>

                  <Button
                    onClick={handleResetPassword}
                    disabled={!password || password !== confirmPassword || resetting}
                    className="w-full h-14 cursor-pointer rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all"
                  >
                    {resetting ? <Loader2 className="animate-spin" /> : "Reset Password"}
                  </Button>
                </motion.div>
              )}

            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <p className="text-center mt-8 text-slate-400 text-sm">
          Remembered your password?{" "}
          <button onClick={() => navigate("/login")} className="text-indigo-400 cursor-pointer font-bold hover:underline underline-offset-4 transition-all">
            Log in
          </button>
        </p>
      </motion.div>
    </div>
  );
}