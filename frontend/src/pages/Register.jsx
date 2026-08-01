import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ArrowRight,
  User,
  Mail,
  Lock,
  Store,
  Phone,
  MapPin,
  ChevronLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  KeyRound,
} from "lucide-react";

import {
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/features/auth/authApi";
import { showError, showSuccess } from "@/components/toast/toast";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedPlan = new URLSearchParams(location.search).get("plan") || "FREE";

  // Logic States
  const [step, setStep] = useState(1); // 1: Identity, 2: Business
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false); // The OTP Gate
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpRefs = useRef([]);

  const [form, setForm] = useState({
    ownerName: "",
    email: "",
    password: "",
    shopName: "",
    phone: "",
    address: "",
  });

  // API Hooks
  const [sendOtp, { isLoading: sending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();
  const [register, { isLoading: registering }] = useRegisterMutation();

  const isStep1Valid =
    form.ownerName && form.email.includes("@") && form.password.length >= 6;
  const isStep2Valid = form.shopName && form.phone;

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // --- OTP Handlers ---
  const handleOtpChange = (val, i) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  // --- Step 1 Action: Trigger OTP Gate ---
  const handleIdentitySubmit = async (e) => {
    e.preventDefault();
    try {
      await sendOtp({ email: form.email, purpose: "REGISTER" }).unwrap();
      setIsVerifyingEmail(true);
      setResendTimer(30);
      showSuccess("Verification code sent to " + form.email);
    } catch (err) {
      console.log(err);
      showError(err?.data?.message || "Failed to send OTP");
    }
  };

  // --- Gate Action: Verify OTP then go to Step 2 ---
  const handleVerifyOtp = async () => {
    try {
      const otpValue = otp.join("");
      await verifyOtp({
        email: form.email,
        otp: otpValue,
        purpose: "REGISTER",
      }).unwrap();
      showSuccess("Email verified!");
      setIsVerifyingEmail(false);
      setStep(2); // Move to Business Page
    } catch (err) {
      showError(err?.data?.message || "Invalid code");
    }
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();

    try {
      await register({
        ownerName: form.ownerName,
        email: form.email,
        password: form.password,
        shopName: form.shopName,
        phone: form.phone,
        address: form.address,
        otp: otp.join(""),
      }).unwrap();

      showSuccess("Account created successfully!");
      navigate(`/settings?.tab=subscription&plan=${selectedPlan}`);
    } catch (err) {
      showError(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex bg-slate-950 text-slate-100 overflow-hidden">

      {/* AMBIENT BACKGROUND GLOWS & BLOBS */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 sm:w-96 sm:h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* BACKGROUND GRID OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* LEFT SIDE: Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/80 p-12 flex-col justify-between relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              Invoxa
            </span>
          </div>

          <div className="max-w-md space-y-6">
            <h2 className="text-4xl lg:text-5xl font-black leading-tight text-white tracking-tight">
              Scale your business <br />
              <span className="bg-linear-to-r from-indigo-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                with confidence.
              </span>
            </h2>

            <p className="text-slate-400 text-base leading-relaxed">
              Join thousands of businesses managing billing, invoices, and automated inventory with enterprise-grade security.
            </p>

            <div className="space-y-4 pt-4">
              {[
                "Instant PDF Invoice Generation",
                "Automated Cloud Inventory Tracking",
                "256-Bit Encrypted Data Protection",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-slate-300 font-medium">
                  <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          SYSTEM STATUS: ALL PLATFORM SERVICES OPERATIONAL
        </div>
      </div>

      {/* RIGHT SIDE: Dynamic Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="relative bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-indigo-950/50 border border-slate-800/80 overflow-hidden">

            {/* TOP ACCENT LINE */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-75" />

            {/* HEADER */}
            <div className="text-center mb-8">
              <motion.div
                key={isVerifyingEmail ? "icon-otp" : step}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-tr from-indigo-600 to-blue-500 rounded-2xl sm:rounded-3xl mb-4 shadow-lg shadow-indigo-500/30 border border-indigo-400/30"
              >
                {isVerifyingEmail ? (
                  <KeyRound className="text-white w-7 h-7 sm:w-9 sm:h-9" />
                ) : step === 1 ? (
                  <User className="text-white w-7 h-7 sm:w-9 sm:h-9" />
                ) : (
                  <Store className="text-white w-7 h-7 sm:w-9 sm:h-9" />
                )}

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1 text-indigo-300"
                >
                  <Sparkles size={16} />
                </motion.div>
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {isVerifyingEmail
                  ? "Verify Email"
                  : step === 1
                    ? "Create Account"
                    : "Business Details"}
              </h1>

              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-normal">
                {isVerifyingEmail
                  ? `Enter the 6-digit code sent to ${form.email}`
                  : step === 1
                    ? "Step 1 of 2: Personal & Security"
                    : "Step 2 of 2: Setup your business profile"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isVerifyingEmail ? (
                /* --- OTP GATE VIEW --- */
                <motion.div
                  key="otp-gate"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between gap-1.5 sm:gap-2">
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        value={d}
                        maxLength={1}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        className="w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-slate-900/80 border border-slate-800 rounded-xl sm:rounded-2xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otp.join("").length !== 6 || verifyingOtp}
                    className="w-full h-12 sm:h-14 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl sm:rounded-2xl font-bold flex items-center justify-center transition-all shadow-lg shadow-indigo-600/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-400/20"
                  >
                    {verifyingOtp ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Verify & Continue"
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleIdentitySubmit}
                      disabled={resendTimer > 0}
                      className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 transition-colors"
                    >
                      {resendTimer > 0
                        ? `Resend Code in ${resendTimer}s`
                        : "Resend Code"}
                    </button>
                  </div>
                </motion.div>
              ) : step === 1 ? (
                /* --- STEP 1: IDENTITY --- */
                <motion.form
                  key="identity"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleIdentitySubmit}
                  className="space-y-4"
                >
                  <FormInput
                    icon={User}
                    label="Full Name"
                    placeholder="John Doe"
                    value={form.ownerName}
                    onChange={(v) => setForm({ ...form, ownerName: v })}
                  />

                  <FormInput
                    icon={Mail}
                    type="email"
                    label="Email Address"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                  />

                  <div className="relative">
                    <FormInput
                      icon={Lock}
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      placeholder="• • • • • • • •"
                      value={form.password}
                      onChange={(v) => setForm({ ...form, password: v })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 bottom-3 text-slate-500 cursor-pointer hover:text-slate-300 p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!isStep1Valid || sending}
                    className="w-full h-12 sm:h-14 bg-linear-to-r cursor-pointer from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 mt-6 shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-400/20"
                  >
                    {sending ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <span>Continue to Business</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                /* --- STEP 2: BUSINESS --- */
                <motion.form
                  key="business"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleFinalRegister}
                  className="space-y-4"
                >
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-400 hover:text-indigo-400 mb-2 transition-colors"
                  >
                    <ChevronLeft size={16} /> Back to Identity
                  </button>

                  <FormInput
                    icon={Store}
                    label="Shop / Enterprise Name"
                    placeholder="My Store Enterprise"
                    value={form.shopName}
                    onChange={(v) => setForm({ ...form, shopName: v })}
                  />

                  <FormInput
                    icon={Phone}
                    label="Phone Number"
                    placeholder="+91 9876543210"
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                  />

                  <FormInput
                    icon={MapPin}
                    label="Business Address"
                    placeholder="123 Street Name, City"
                    value={form.address}
                    onChange={(v) => setForm({ ...form, address: v })}
                  />

                  <button
                    type="submit"
                    disabled={!isStep2Valid || registering}
                    className="w-full h-12 sm:h-14 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 mt-6 shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-400/20"
                  >
                    {registering ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* LOGIN REDIRECT LINK */}
            <div className="text-center mt-8 text-slate-400 text-xs sm:text-sm font-medium">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-bold text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors ml-1"
              >
                Log in
              </button>
            </div>

          </div>
        </motion.div>
      </div>

      {/* FOOTER INFO */}
      <div className="absolute bottom-4 left-0 w-full text-center text-slate-500 text-[10px] sm:text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-2 pointer-events-none">
        <ShieldCheck size={14} className="text-indigo-500" />
        <span>© 2026 Invoxa • Encrypted Onboarding</span>
      </div>

    </div>
  );
}

function FormInput({
  icon: Icon,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-300 ml-1">
        {label}
      </label>
      <div className="relative group">
        <Icon
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200 ${isFocused ? "text-indigo-400" : "text-slate-500"
            }`}
          size={18}
        />
        <input
          type={type}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full h-12 sm:h-14 pl-11 pr-4 bg-slate-900/80 border border-slate-800 rounded-xl sm:rounded-2xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm sm:text-base"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}