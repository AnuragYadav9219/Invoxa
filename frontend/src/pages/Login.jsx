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
      showError(err?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#f8fafc] overflow-hidden px-4">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
          
          {/* HEADER */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-200"
            >
              <Lock className="text-white" size={28} />
            </motion.div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 z-10 transition-colors" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="h-14 pl-12 bg-slate-50/50 border-slate-200 rounded-2xl focus-visible:ring-blue-600 focus-visible:ring-offset-0 transition-all"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-sm font-bold text-slate-700">
                  Password
                </Label>
                <Button
                  variant="link"
                  type="button"
                  onClick={() => navigate("/auth-otp?mode=reset")}
                  className="h-auto p-0 text-xs font-bold cursor-pointer text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </Button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 z-10 transition-colors" size={18} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="h-14 pl-12 pr-12 bg-slate-50/50 border-slate-200 rounded-2xl focus-visible:ring-blue-600 focus-visible:ring-offset-0 transition-all"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-slate-400 hover:text-slate-600 hover:bg-transparent transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <Button
              type="submit"
              disabled={!form.email || !form.password || isLoading}
              className="w-full h-14 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Loader2 className="animate-spin mx-auto" size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    Login <ArrowRight size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </form>

          {/* REGISTER */}
          <div className="text-center mt-10 text-slate-500 font-medium">
            Don’t have an account?{" "}
            <Button
              variant="link"
              onClick={() => navigate("/register")}
              className="p-0 h-auto font-bold cursor-pointer text-blue-600 hover:text-blue-700"
            >
              Sign up for free
            </Button>
          </div>
        </div>
      </motion.div>

      {/* FOOTER INFO */}
      <div className="absolute bottom-6 left-0 w-full text-center text-slate-400 text-xs font-medium tracking-wide uppercase">
        © 2026 Invoxa • Securely encrypted
      </div>
    </div>
  );
}