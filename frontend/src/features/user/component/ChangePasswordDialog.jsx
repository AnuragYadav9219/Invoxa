import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Eye, EyeOff, ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useChangePasswordMutation } from "@/features/user/userApi";
import { validate } from "@/utils/validators";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function ChangePasswordDialog() {
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        current: "",
        newPass: "",
        confirm: ""
    });

    const [show, setShow] = useState({
        current: false,
        newPass: false,
        confirm: false
    });

    const [error, setError] = useState("");

    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = async () => {
        const err = validate(form);
        if (err) {
            setError(err);
            return;
        }

        setError("");

        try {
            await changePassword({
                oldPassword: form.current,
                newPassword: form.newPass,
            }).unwrap();

            setOpen(false);
            setForm({ current: "", newPass: "", confirm: "" });

        } catch (err) {
            const errorMsg = err?.data?.message || "Failed to update password";
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="cursor-pointer justify-between group w-full h-11 px-3 rounded-2xl hover:bg-slate-100 text-slate-700 transition-all font-semibold text-xs sm:text-sm"
                >
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                            <KeyRound size={16} />
                        </div>
                        <span>Change Password</span>
                    </div>
                    <ArrowRight
                        size={15}
                        className="text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1"
                    />
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[92%] sm:max-w-md p-0 bg-white flex flex-col h-auto max-h-[85vh] rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden">

                {/* Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600" />

                {/* Loading Overlay */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 rounded-3xl z-50"
                        >
                            <Loader2 className="animate-spin text-indigo-600" size={32} />
                            <p className="text-xs font-semibold text-slate-500">Updating security credentials...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="p-6 pb-2 shrink-0">
                    <DialogHeader className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                <KeyRound size={18} />
                            </div>
                            <DialogTitle className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                                Change Password
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-xs text-slate-500 font-medium pl-9 text-left">
                            Enhance account security by choosing a robust new password.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                    <PasswordInput
                        label="Current Password"
                        name="current"
                        value={form.current}
                        show={show.current}
                        toggle={() =>
                            setShow({ ...show, current: !show.current })
                        }
                        onChange={handleChange}
                    />

                    <PasswordInput
                        label="New Password"
                        name="newPass"
                        value={form.newPass}
                        show={show.newPass}
                        toggle={() =>
                            setShow({ ...show, newPass: !show.newPass })
                        }
                        onChange={handleChange}
                    />

                    <PasswordInput
                        label="Confirm New Password"
                        name="confirm"
                        value={form.confirm}
                        show={show.confirm}
                        toggle={() =>
                            setShow({ ...show, confirm: !show.confirm })
                        }
                        onChange={handleChange}
                    />

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold"
                            >
                                <ShieldAlert size={15} className="shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-6 pt-2 bg-white border-t border-slate-100 shrink-0">
                    <Button
                        className="w-full h-12 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 cursor-pointer transition-all text-sm active:scale-95"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating Password..." : "Update Password"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ================= REUSABLE ================= */

function PasswordInput({ label, name, value, onChange, show, toggle }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-1">
                {label}
            </label>

            <div className="relative">
                <Input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-2 focus-visible:ring-indigo-500 pr-10 text-sm font-semibold text-slate-800 transition-all"
                />

                <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer p-1"
                    tabIndex={-1}
                >
                    {show ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
            </div>
        </div>
    );
}