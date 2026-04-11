import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRegisterMutation } from "@/features/auth/authApi";
import { useAuth } from "@/hooks/authHooks";

// Icons & UI
import { Loader2, ArrowRight, User, Mail, Lock, Store, Phone, MapPin, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [register, { isLoading, error }] = useRegisterMutation();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    ownerName: "",
    email: "",
    password: "",
    shopName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const isStep1Valid = form.ownerName && form.email && form.password;
  const isStep2Valid = form.shopName && form.phone;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    try {
      await register(form).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="font-sans bg-[#f8f9fb] text-[#191c1e] min-h-screen flex flex-col relative overflow-hidden">
      
      {/* 🏛️ Architectural Background */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Workspace" 
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000" 
        />
        <div className="absolute inset-0 bg-[#f8f9fb]/60 backdrop-blur-[3px]"></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-[#191c1e] cursor-pointer" onClick={() => navigate("/")}>
          Invoxa
        </div>
        <div className="hidden md:flex items-center gap-8">
          <span className="text-xs text-[#42474f]">Already a member?</span>
          <button onClick={() => navigate("/login")} className="text-xs font-bold text-[#1353d8] hover:underline transition-colors">
            Sign In
          </button>
        </div>
      </header>

      <main className="relative z-10 grow flex items-center justify-center px-4">
        <div className="w-full max-w-120">
          
          {/* Step Indicator */}
          <div className="flex justify-center mb-8 gap-12">
            <StepIndicator active={step >= 1} current={step === 1} label="Identity" number="01" />
            <StepIndicator active={step >= 2} current={step === 2} label="Business" number="02" />
          </div>

          <motion.div 
            layout
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/20"
          >
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
                      <p className="text-sm text-[#42474f]">Start your journey to financial clarity.</p>
                    </div>

                    <IconInput 
                      icon={User} 
                      placeholder="Full Name" 
                      value={form.ownerName} 
                      onChange={(val) => setForm({...form, ownerName: val})} 
                    />
                    <IconInput 
                      icon={Mail} 
                      type="email" 
                      placeholder="Email Address" 
                      value={form.email} 
                      onChange={(val) => setForm({...form, email: val})} 
                    />
                    <IconInput 
                      icon={Lock} 
                      type="password" 
                      placeholder="Secure Password" 
                      value={form.password} 
                      onChange={(val) => setForm({...form, password: val})} 
                    />

                    <Button 
                      disabled={!isStep1Valid}
                      className="w-full h-14 rounded-xl bg-[#002c81] hover:bg-[#0040b3] text-white font-bold transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 mt-4"
                    >
                      Continue to Business <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-[#42474f] flex items-center gap-1 hover:text-[#1353d8] transition-colors mb-2"
                    >
                      <ChevronLeft size={14} /> Back to Identity
                    </button>
                    
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold tracking-tight">Business Profile</h2>
                      <p className="text-sm text-[#42474f]">Tell us about your organization.</p>
                    </div>

                    <IconInput 
                      icon={Store} 
                      placeholder="Shop / Business Name" 
                      value={form.shopName} 
                      onChange={(val) => setForm({...form, shopName: val})} 
                    />
                    <IconInput 
                      icon={Phone} 
                      placeholder="Business Phone" 
                      value={form.phone} 
                      onChange={(val) => setForm({...form, phone: val})} 
                    />
                    <IconInput 
                      icon={MapPin} 
                      placeholder="Physical Address (Optional)" 
                      value={form.address} 
                      onChange={(val) => setForm({...form, address: val})} 
                    />

                    <Button 
                      disabled={!isStep2Valid || isLoading}
                      className="w-full h-14 rounded-xl bg-linear-to-r from-[#002c81] to-[#0040b3] text-white font-bold shadow-lg shadow-blue-900/20 mt-4"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : "Complete Sanctuary Setup"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {error && (
              <p className="text-red-600 text-xs font-medium text-center bg-red-50 py-3 rounded-lg mt-6 border border-red-100">
                {error?.data?.message || "Registration failed. Please check your details."}
              </p>
            )}
          </motion.div>
          
          <p className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-[#42474f] opacity-60">
            Secure Enrollment • Invoxa Protocol 2026
          </p>
        </div>
      </main>

      {/* 📁 Compact Footer */}
      <footer className="relative z-10 w-full py-6 px-8 text-center md:text-left flex justify-center max-w-7xl mx-auto">
        <div className="text-[10px] text-[#42474f] opacity-70">
          © 2026 Invoxa Financial Sanctuary. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* Helper: Custom Input with Icon */
function IconInput({ icon: Icon, type = "text", placeholder, value, onChange }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2c7d1] group-focus-within:text-[#1353d8] transition-colors">
        <Icon size={18} />
      </div>
      <input 
        type={type}
        placeholder={placeholder}
        className="w-full h-13 pl-12 pr-4 py-3 bg-[#f3f4f6]/50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1353d8]/10 focus:border-[#1353d8] transition-all outline-none placeholder:text-[#a0a4ab] text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* Helper: Step Indicator */
function StepIndicator({ active, current, label, number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`
        text-[10px] font-bold tracking-widest px-3 py-1 rounded-full transition-all duration-500
        ${current ? "bg-[#002c81] text-white shadow-md shadow-blue-900/20" : 
          active ? "bg-white text-[#002c81] border border-[#002c81]" : "bg-transparent text-[#c2c7d1]"}
      `}>
        {number}
      </div>
      <span className={`text-[11px] font-bold uppercase tracking-tighter ${active ? "text-[#191c1e]" : "text-[#c2c7d1]"}`}>
        {label}
      </span>
    </div>
  );
}