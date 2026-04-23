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
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const stepVars = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
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

  // ================= LOGIC HANDLERS =================

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
      showSuccess("Code sent to your inbox");
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-slate-50 via-indigo-50 to-slate-100">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-200/50 rounded-full blur-3xl" />
      </div>

      <motion.div variants={containerVars} initial="initial" animate="animate" className="w-full max-w-md">
        <Card className="backdrop-blur-md bg-white/90 shadow-[0_20px_50px_rgba(79,70,229,0.1)] border-white/50 rounded-[2.5rem] overflow-hidden">
          <div className="h-2 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <CardContent className="p-8 sm:p-10 space-y-8">
            <div className="text-center relative">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="absolute left-0 top-1 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 shadow-inner">
                {step === 1 && <Mail size={28} />}
                {step === 2 && <ShieldCheck size={28} />}
                {step === 3 && <Lock size={28} />}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {step === 1 && "Forgot Password"}
                {step === 2 && "Verify your Identity"}
                {step === 3 && "Secure your Account"}
              </h1>
              <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
                {step === 1 && "Enter your email to receive a recovery code"}
                {step === 2 && `We've sent a 6-digit code to your inbox`}
                {step === 3 && "Please choose a strong new password"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {/* --- STEP 1: EMAIL --- */}
              {step === 1 && (
                <motion.div key="s1" variants={stepVars} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                      <Input
                        type="email"
                        placeholder="name@company.com"
                        className="pl-12 h-14 bg-slate-50/50 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleSendOtp}
                    disabled={!email || sending}
                    className="w-full h-14 rounded-2xl cursor-pointer bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
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
                        className="w-full h-14 sm:h-16 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={otp.join("").length !== 6}
                      className="w-full h-14 rounded-2xl cursor-pointer bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-all"
                    >
                      Verify & Continue
                    </Button>
                    <div className="text-center">
                      <button
                        disabled={resendTimer > 0 || sending}
                        onClick={handleSendOtp}
                        className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 transition-colors"
                      >
                        <RefreshCw size={14} className={sending ? "animate-spin" : ""} />
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
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
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        className="pl-12 pr-12 h-14 bg-slate-50/50 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="pl-12 h-14 bg-slate-50/50 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {password === confirmPassword && confirmPassword.length > 5 && (
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleResetPassword}
                    disabled={!password || password !== confirmPassword || resetting}
                    className="w-full h-14 cursor-pointer rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                  >
                    {resetting ? <Loader2 className="animate-spin" /> : "Reset Password"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <p className="text-center mt-8 text-slate-500 text-sm">
          Remembered your password?{" "}
          <button onClick={() => navigate("/login")} className="text-indigo-600 cursor-pointer font-bold hover:underline underline-offset-4">
            Log in
          </button>
        </p>
      </motion.div>
    </div>
  );
}