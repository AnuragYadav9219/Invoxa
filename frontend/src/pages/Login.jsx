import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useLoginMutation } from "@/features/auth/authApi";
import { useAuth } from "@/hooks/authHooks";
import { showSuccess, showError } from "@/components/toast/toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(form).unwrap();

      showSuccess("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const code = err?.data?.code;

      if (code === "ACCOUNT_DELETED") {
        showError("Your account is deleted. Please recover it.");

        navigate("/recover", {
          state: { email: form.email },
        });

        return;
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 overflow-hidden px-4 py-12">

      {/* AMBIENT BACKGROUND GLOWS & BLOBS */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 sm:w-96 sm:h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* BACKGROUND GRID OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 w-full max-w-md"
      >
        <div className="relative bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-indigo-950/50 border border-slate-800/80 overflow-hidden">

          {/* TOP ACCENT LINE */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-75" />

          {/* HEADER */}
          <div className="text-center mb-8 sm:mb-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-tr from-indigo-600 to-blue-500 rounded-2xl sm:rounded-3xl mb-5 shadow-lg shadow-indigo-500/30 border border-indigo-400/30"
            >
              <Lock className="text-white w-7 h-7 sm:w-9 sm:h-9" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1 -right-1 text-indigo-300"
              >
                <Sparkles size={16} />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
            >
              Welcome back
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-slate-400 text-sm sm:text-base mt-2 font-normal"
            >
              Enter your credentials to access your account
            </motion.p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">

            {/* EMAIL */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-slate-300 ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200 ${focusedInput === "email" ? "text-indigo-400" : "text-slate-500"
                    }`}
                  size={18}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  className="h-12 sm:h-14 pl-11 bg-slate-900/80 border-slate-800 rounded-xl sm:rounded-2xl text-slate-100 placeholder:text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 focus-visible:ring-offset-0 transition-all text-sm sm:text-base"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </motion.div>

            {/* PASSWORD */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-xs sm:text-sm font-semibold text-slate-300">
                  Password
                </Label>
                <Button
                  variant="link"
                  type="button"
                  onClick={() => navigate("/auth-otp?mode=reset")}
                  className="h-auto p-0 text-xs font-semibold cursor-pointer text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot Password?
                </Button>
              </div>

              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200 ${focusedInput === "password" ? "text-indigo-400" : "text-slate-500"
                    }`}
                  size={18}
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="• • • • • • • •"
                  required
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                  className="h-12 sm:h-14 pl-11 pr-12 bg-slate-900/80 border-slate-800 rounded-xl sm:rounded-2xl text-slate-100 placeholder:text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 focus-visible:ring-offset-0 transition-all text-sm sm:text-base"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex h-full items-center cursor-pointer w-9 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded-xl transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </motion.div>

            {/* SUBMIT BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="submit"
                disabled={!form.email || !form.password || isLoading}
                className="w-full h-12 sm:h-14 cursor-pointer bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-400/20"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Loader2 className="animate-spin mx-auto" size={22} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center cursor-pointer justify-center gap-2"
                    >
                      <span>Login</span>
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

          </form>

          {/* REGISTER LINK */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center mt-8 sm:mt-10 text-slate-400 text-xs sm:text-sm font-medium"
          >
            Don’t have an account?{" "}
            <Button
              variant="link"
              onClick={() => navigate("/register")}
              className="p-0 h-auto font-bold cursor-pointer text-indigo-400 hover:text-indigo-300 transition-colors ml-1"
            >
              Sign up for free
            </Button>
          </motion.div>

        </div>
      </motion.div>

      {/* FOOTER INFO */}
      <div className="absolute bottom-4 left-0 w-full text-center text-slate-500 text-[10px] sm:text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-2">
        <ShieldCheck size={14} className="text-indigo-500" />
        <span>© 2026 Invoxa • Securely encrypted</span>
      </div>

    </div>
  );
}