import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Trash2, AlertTriangle, ChevronLeft, Loader2, ShieldAlert } from "lucide-react";
import { useDeleteAccountMutation } from "../userApi";
import { useSelector } from "react-redux";
import { useSendOtpMutation } from "@/features/auth/authApi";
import { motion, AnimatePresence } from "framer-motion";
import { showError, showSuccess } from "@/components/toast/toast";

export function DeleteAccountDialog() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);

    const email = useSelector(state => state.auth.user?.email);

    const [formData, setFormData] = useState({
        confirmText: "",
        password: "",
        otp: "",
    });

    const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
    const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

    const isStepOneValid = formData.confirmText === "DELETE" && formData.password.length > 0;
    const isStepTwoValid = formData.otp.length >= 4;

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            setTimeout(() => {
                setStep(1);
                setFormData({ confirmText: "", password: "", otp: "" });
            }, 200);
        }
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSendOtp = async () => {
        try {
            await sendOtp({
                email,
                password: formData.password,
                purpose: "DELETE_ACCOUNT",
            }).unwrap();

            showSuccess("OTP sent successfully");
            setStep(2);

        } catch (err) {
            showError(
                err?.data?.message || "Failed to send OTP"
            )
        }
    };

    const handleDelete = async () => {
        try {
            await deleteAccount({
                password: formData.password,
                otp: formData.otp
            }).unwrap();
            setOpen(false);
        } catch (err) {
            /* Handled by Global Error Middleware */
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="cursor-pointer justify-between group w-full h-11 px-3 rounded-2xl hover:bg-rose-50/60 text-rose-600 transition-all font-semibold text-xs sm:text-sm"
                >
                    <span className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
                            <Trash2 size={16} />
                        </div>
                        <span>Delete Account</span>
                    </span>
                    <ArrowRight size={14} className="text-rose-400 group-hover:text-rose-600 transition-transform group-hover:translate-x-1" />
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[92%] sm:max-w-md p-0 bg-white flex flex-col h-auto max-h-[85vh] rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden">

                {/* Top Destructive Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-rose-500 via-red-600 to-rose-700" />

                <div className="p-6 pb-2 shrink-0">
                    <DialogHeader className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                                <AlertTriangle size={18} />
                            </div>
                            <DialogTitle className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                                {step === 1 ? "Dangerous Action" : "Verify Identity"}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-xs text-slate-500 font-medium pl-9 text-left">
                            {step === 1
                                ? "This will permanently delete your profile and all associated data."
                                : "We've sent a code to your email to confirm this request."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 py-2 space-y-4 flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <Label htmlFor="confirmText" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-1">
                                        Confirm by typing <span className="font-extrabold text-rose-600">DELETE</span>
                                    </Label>
                                    <Input
                                        id="confirmText"
                                        name="confirmText"
                                        placeholder="DELETE"
                                        value={formData.confirmText}
                                        onChange={onInputChange}
                                        className={`h-11 rounded-xl bg-slate-50/50 text-sm font-semibold text-slate-800 transition-all ${formData.confirmText === "DELETE"
                                                ? "border-emerald-500 focus-visible:ring-emerald-500 bg-emerald-50/20"
                                                : "border-slate-200"
                                            }`}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-1">
                                        Your Password
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={onInputChange}
                                        className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-2 focus-visible:ring-rose-500 text-sm font-semibold text-slate-800 transition-all"
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <Label htmlFor="otp" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-1">
                                        One-Time Password
                                    </Label>
                                    <Input
                                        id="otp"
                                        name="otp"
                                        placeholder="000000"
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-2 focus-visible:ring-rose-500 text-center text-lg tracking-[0.5em] font-bold text-slate-800"
                                        maxLength={6}
                                        value={formData.otp}
                                        onChange={onInputChange}
                                        autoFocus
                                    />
                                </div>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="px-0 text-slate-500 hover:text-slate-800 font-semibold text-xs h-auto"
                                    onClick={() => setStep(1)}
                                >
                                    <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Back to details
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <DialogFooter className="p-6 pt-4 bg-white border-t border-slate-100 shrink-0 flex gap-2">
                    {step === 1 ? (
                        <Button
                            variant="destructive"
                            className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 cursor-pointer transition-all text-sm active:scale-95"
                            disabled={!isStepOneValid || isSendingOtp}
                            onClick={handleSendOtp}
                        >
                            {isSendingOtp ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Requesting Deletion...
                                </>
                            ) : (
                                "Request Account Deletion"
                            )}
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 cursor-pointer transition-all text-sm active:scale-95"
                            disabled={!isStepTwoValid || isDeleting}
                            onClick={handleDelete}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Finalizing...
                                </>
                            ) : (
                                "Permanently Delete Everything"
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}