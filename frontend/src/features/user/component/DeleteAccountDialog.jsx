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
import { ArrowRight, Trash2, AlertTriangle, ChevronLeft, Loader2 } from "lucide-react";
import { useDeleteAccountMutation } from "../userApi";
import { useSelector } from "react-redux";
import { useSendOtpMutation } from "@/features/auth/authApi";

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
                purpose: "DELETE_ACCOUNT",
            }).unwrap();

            setStep(2);
        } catch (err) {
            /* Handled by Global Error Middleware */
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
                    className="cursor-pointer justify-between text-destructive hover:bg-destructive/10 group transition-all"
                >
                    <span className="flex items-center gap-2">
                        <Trash2 size={16} className="opacity-70 cursor-pointer group-hover:opacity-100" />
                        Delete Account
                    </span>
                    <ArrowRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-100 overflow-hidden">
                <DialogHeader>
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-center text-xl">
                        {step === 1 ? "Dangerous Action" : "Verify Identity"}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {step === 1
                            ? "This will permanently delete your profile and all associated data."
                            : "We've sent a code to your email to confirm this request."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 1 ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="confirmText" className="text-xs uppercase tracking-wider text-muted-foreground">
                                    Confirm by typing <span className="font-bold text-foreground">DELETE</span>
                                </Label>
                                <Input
                                    id="confirmText"
                                    name="confirmText"
                                    placeholder="DELETE"
                                    value={formData.confirmText}
                                    onChange={onInputChange}
                                    className={formData.confirmText === "DELETE" ? "border-green-500 focus-visible:ring-green-500" : ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password text-xs">Your Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={onInputChange}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-xs uppercase tracking-wider text-muted-foreground">
                                    One-Time Password
                                </Label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    placeholder="000000"
                                    className="text-center text-lg tracking-[1em]"
                                    maxLength={6}
                                    value={formData.otp}
                                    onChange={onInputChange}
                                    autoFocus
                                />
                            </div>
                            <Button
                                variant="link"
                                size="sm"
                                className="px-0 text-muted-foreground"
                                onClick={() => setStep(1)}
                            >
                                <ChevronLeft className="mr-1 h-3 w-3" /> Back to details
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step === 1 ? (
                        <Button
                            variant="destructive"
                            className="w-full cursor-pointer"
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
                            className="w-full"
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