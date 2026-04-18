import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLoginMutation } from "@/features/auth/authApi";
import { useAuth } from "@/hooks/authHooks";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { showSuccess } from "@/components/toast/toast";

export default function Login() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [login, { isLoading, error }] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard");
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(form).unwrap();
            navigate("/dashboard");
            showSuccess("Login Successful");
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <div className="font-sans min-h-screen flex flex-col relative overflow-hidden bg-[#f6f8fb]">

            {/* 🏛️ NAVBAR */}
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-8 py-5 max-w-7xl mx-auto w-full">
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#191c1e]">
                    Invoxa
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <span className="text-xs text-[#555]">
                        New here?
                    </span>
                    <button className="text-xs font-semibold cursor-pointer text-[#1353d8] hover:underline">
                        <span onClick={() => navigate("/register")}>
                            Create account
                        </span>
                    </button>
                </div>
            </header>

            {/* BACKGROUND (BETTER IMAGE) */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000&auto=format&fit=crop"
                    alt="invoice workspace"
                    className="w-full h-full object-cover scale-105"
                />

                {/* Overlay (important for readability) */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px]" />
            </div>

            {/* MAIN */}
            <main className="relative z-10 grow flex items-center justify-center px-4 pt-24 pb-10">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    {/* CARD */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-10 shadow-xl border border-white/40 transition-all hover:shadow-2xl">

                        {/* TITLE */}
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#191c1e] mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-sm text-[#555]">
                                Login to manage your invoices and reminders
                            </p>
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleLogin} className="space-y-5">

                            {/* EMAIL */}
                            <InputField
                                label="Email Address"
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />

                            {/* PASSWORD */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#555] font-medium">Password</span>
                                    <button
                                        type="button"
                                        className="text-[#1353d8] hover:underline"
                                    >
                                        Forgot?
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full h-12 px-4 pr-10 rounded-xl bg-[#f1f3f7] focus:bg-white border border-transparent focus:border-[#1353d8] focus:ring-2 focus:ring-[#1353d8]/20 transition-all"
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm({ ...form, password: e.target.value })
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#1353d8]"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* ERROR */}
                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-sm bg-red-50 p-2 rounded-md text-center"
                                    >
                                        {error?.data?.message || "Login failed"}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* BUTTON */}
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full h-12 rounded-xl bg-[#1353d8] text-white font-semibold transition-all hover:bg-[#0f46b5] active:scale-[0.97] flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>

                        {/* FOOTER */}
                        <p className="text-center mt-6 text-sm text-[#555]">
                            Don’t have an account?{" "}
                            <span
                                onClick={() => navigate("/register")}
                                className="text-[#1353d8] font-semibold cursor-pointer hover:underline"
                            >
                                Sign up
                            </span>
                        </p>
                    </div>
                </motion.div>
            </main>

            {/* FOOTER */}
            <footer className="relative z-10 text-center py-6 text-xs text-[#666]">
                © 2026 Invoxa — Smart Invoice Tracking & Reminders
            </footer>
        </div>
    );
}

/* INPUT COMPONENT */
function InputField({ label, ...props }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-[#555]">
                {label}
            </label>
            <input
                className="w-full h-12 px-4 rounded-xl bg-[#f1f3f7] focus:bg-white border border-transparent focus:border-[#1353d8] focus:ring-2 focus:ring-[#1353d8]/20 transition-all"
                {...props}
            />
        </div>
    );
}