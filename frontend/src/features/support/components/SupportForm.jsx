import { useEffect, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { showError, showSuccess } from "@/components/toast/toast";
import { tokenService } from "@/services/tokenService";
import { useCreateTicketMutation } from "../supportApi";
import SuccessContent from "./SuccessContent";

export default function SupportForm({
    isOpen,
    onClose,
    selectedCategory,
}) {
    const user = tokenService.getUser();

    const [createTicket, { isLoading }] = useCreateTicketMutation();

    const [successTicket, setSuccessTicket] = useState(null);

    const [form, setForm] = useState({
        type: selectedCategory?.value || "",
        subject: "",
        message: "",
        name: user?.name || "",
        email: user?.email || "",
    });

    useEffect(() => {
        if (selectedCategory) {
            setForm((prev) => ({
                ...prev,
                type: selectedCategory.value,
            }));
        }
    }, [selectedCategory]);

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await createTicket(form).unwrap();

            setSuccessTicket(res.data.ticketNumber);

            setForm((prev) => ({
                ...prev,
                subject: "",
                message: "",
            }));

        } catch (err) {
            showError(
                err?.data?.message ||
                "Unable to submit your request."
            );
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="w-full no-scrollbar sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 text-slate-100 p-5 sm:p-8 shadow-2xl z-50">
                <DialogHeader className="space-y-2">
                    <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                        <Sparkles size={12} />
                        Support Ticket
                    </div>

                    <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                        Contact Support
                    </DialogTitle>

                    <DialogDescription className="text-xs sm:text-sm text-slate-400">
                        Submit details regarding your inquiry below, and our team will review your request promptly.
                    </DialogDescription>
                </DialogHeader>

                {successTicket ? (
                    <SuccessContent
                        successTicket={successTicket}
                        setSuccessTicket={setSuccessTicket}
                        setForm={setForm}
                        onClose={onClose}
                    />
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 sm:space-y-5 mt-4"
                    >
                        {/* Name & Email */}
                        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                    Name
                                </Label>

                                <Input
                                    value={form.name}
                                    disabled={!!user}
                                    onChange={(e) =>
                                        handleChange("name", e.target.value)
                                    }
                                    placeholder="John Doe"
                                    className="rounded-xl border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 disabled:opacity-60 text-sm sm:text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                    Email Address
                                </Label>

                                <Input
                                    type="email"
                                    value={form.email}
                                    disabled={!!user}
                                    onChange={(e) =>
                                        handleChange("email", e.target.value)
                                    }
                                    placeholder="john@example.com"
                                    className="rounded-xl border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 disabled:opacity-60 text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Category
                            </Label>

                            <Input
                                value={selectedCategory?.title || ""}
                                disabled
                                className="rounded-xl border-slate-800 bg-slate-900 text-indigo-300 font-medium disabled:opacity-90 cursor-default text-sm sm:text-base"
                            />
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Subject
                            </Label>

                            <Input
                                value={form.subject}
                                onChange={(e) =>
                                    handleChange("subject", e.target.value)
                                }
                                placeholder="e.g., Invoice PDF is not downloading"
                                required
                                className="rounded-xl border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 text-sm sm:text-base"
                            />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Message
                            </Label>

                            <Textarea
                                rows={4}
                                value={form.message}
                                onChange={(e) =>
                                    handleChange("message", e.target.value)
                                }
                                placeholder="Describe your issue, bug, or feedback in detail..."
                                required
                                className="resize-none rounded-xl border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/25 text-sm sm:text-base"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="rounded-xl cursor-pointer border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full py-5 sm:w-auto"
                            >
                                Cancel
                            </Button>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full cursor-pointer sm:w-auto rounded-xl py-5 bg-indigo-600 px-3 font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-1 h-4 w-4" />
                                            Submit Ticket
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}