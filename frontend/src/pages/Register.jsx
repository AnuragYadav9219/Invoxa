import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

import {
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/features/auth/authApi";
import { showError, showSuccess } from "@/components/toast/toast";

export default function Register() {
  const navigate = useNavigate();

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

  const isStep1Valid = form.ownerName && form.email.includes('@') && form.password.length >= 6;
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
      showError(err?.data?.message || "Failed to send verification code");
    }
  };

  // --- Gate Action: Verify OTP then go to Step 2 ---
  const handleVerifyOtp = async () => {
    try {
      const otpValue = otp.join("");
      await verifyOtp({ email: form.email, otp: otpValue, purpose: "REGISTER" }).unwrap();
      showSuccess("Email verified!");
      setIsVerifyingEmail(false);
      setStep(2); // Move to Business Page
    } catch (err) {
      showError(err?.data?.message || "Invalid code");
    }
  };

  // --- Step 2 Action: Final Registration ---
  // const handleFinalRegister = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await register({ ...form, name: form.ownerName, otp: otp.join("") }).unwrap();
  //     showSuccess("Account created successfully!");
  //     navigate("/dashboard");
  //   } catch (err) {
  //     showError(err?.data?.message || "Registration failed");
  //   }
  // };

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
      navigate("/dashboard");

    } catch (err) {
      showError(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* LEFT SIDE: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 flex-col justify-between text-white relative">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-12">
            <ShieldCheck className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight">Invoxa</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-6">Scale your business <br /> with confidence.</h2>
          <div className="space-y-4">
            {['Secure Transactions', 'Advanced Inventory', '24/7 Support'].map((t) => (
              <div key={t} className="flex items-center gap-2 opacity-90"><CheckCircle2 size={18} className="text-emerald-400" /> {t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Dynamic Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Progress Header */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              {isVerifyingEmail ? "Verify Identity" : step === 1 ? "Create Account" : "Business Details"}
            </h1>
            <p className="text-slate-500">
              {isVerifyingEmail ? "Confirm your email to continue." : step === 1 ? "Start your journey with us." : "Tell us about your shop."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isVerifyingEmail ? (
              /* --- OTP GATE VIEW --- */
              <motion.div key="otp-gate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="flex justify-between gap-2">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      value={d}
                      maxLength={1}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-2xl focus:border-indigo-600 outline-none transition-all shadow-sm"
                    />
                  ))}
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.join("").length !== 6 || verifyingOtp}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center transition-all disabled:opacity-50"
                >
                  {verifyingOtp ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
                </button>
                <div className="text-center">
                  <button onClick={handleIdentitySubmit} disabled={resendTimer > 0} className="text-sm font-semibold text-indigo-600 disabled:text-slate-400">
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                  </button>
                </div>
              </motion.div>
            ) : step === 1 ? (
              /* --- STEP 1: IDENTITY --- */
              <motion.form key="identity" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleIdentitySubmit} className="space-y-4">
                <FormInput icon={User} label="Name" placeholder="Full Name" value={form.ownerName} onChange={(v) => setForm({ ...form, ownerName: v })} />
                <FormInput icon={Mail} label="Email" placeholder="email@example.com" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <div className="relative">
                  <FormInput icon={Lock} type={showPassword ? "text" : "password"} label="Password" placeholder="••••••••" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 bottom-3 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button type="submit" disabled={!isStep1Valid || sending} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-indigo-100">
                  {sending ? <Loader2 className="animate-spin" /> : <>Continue to Business <ArrowRight size={18} /></>}
                </button>
              </motion.form>
            ) : (
              /* --- STEP 2: BUSINESS --- */
              <motion.form key="business" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleFinalRegister} className="space-y-4">
                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-sm font-bold text-slate-400 hover:text-indigo-600 mb-2">
                  <ChevronLeft size={16} /> Back
                </button>
                <FormInput icon={Store} label="Shop Name" placeholder="My Enterprise" value={form.shopName} onChange={(v) => setForm({ ...form, shopName: v })} />
                <FormInput icon={Phone} label="Phone" placeholder="+123456789" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                <FormInput icon={MapPin} label="Address" placeholder="123 Street, City" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
                <button type="submit" disabled={!isStep2Valid || registering} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-indigo-100 mt-4">
                  {registering ? <Loader2 className="animate-spin" /> : "Complete Registration"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center mt-8 text-slate-500 text-sm font-medium">
            Already have an account? <button onClick={() => navigate("/login")} className="text-indigo-600 font-bold hover:underline">Log in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Reusable Modern Form Input ---
function FormInput({ icon: Icon, type = "text", label, placeholder, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}