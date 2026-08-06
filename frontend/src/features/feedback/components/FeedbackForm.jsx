import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { tokenService } from "@/services/tokenService";
import { useSubmitFeedbackMutation } from "../feedbackApi";

import StarRating from "./StarRating";
import RecommendationSelector from "./RecommendationSelector";
import FeedbackSuccess from "./FeedbackSuccess";

const CATEGORIES = [
    { id: "USER_EXPERIENCE", label: "UX & Design" },
    { id: "FEATURE_REQUEST", label: "New Feature" },
    { id: "BILLING", label: "Billing & Plans" },
    { id: "PERFORMANCE", label: "Speed & Performance" },
    { id: "BUG", label: "Bug Report" },
    { id: "OTHER", label: "General" },
];

export default function FeedbackForm() {
    const user = tokenService.getUser();

    const [submitFeedback, { isLoading }] = useSubmitFeedbackMutation();
    const [submitted, setSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [form, setForm] = useState({
        rating: 5,
        category: "USER_EXPERIENCE",
        recommendation: "YES",
        liked: "",
        improvement: "",
        name: user?.name || "",
        email: user?.email || "",
    });

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (errorMsg) setErrorMsg("");
    };

    async function handleSubmit(e) {
        e.preventDefault();

        // Validation for required fields
        if (!form.liked.trim() || !form.improvement.trim() || !form.name.trim() || !form.email.trim()) {
            setErrorMsg("Please fill out all required fields before submitting.");
            return;
        }

        try {
            await submitFeedback(form).unwrap();
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setErrorMsg("Failed to submit feedback. Please try again.");
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    };

    return (
        <AnimatePresence mode="wait">
            {submitted ? (
                <FeedbackSuccess />
            ) : (
                <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="space-y-5 relative"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center pb-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium mb-3">
                            <Sparkles size={12} />
                            <span>Product Feedback</span>
                        </div>
                        <h2 className="text-lg font-bold tracking-tight text-white md:text-xl">
                            Help Us Refine Invoxa
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Share your thoughts to guide our next product iteration.
                        </p>
                    </motion.div>

                    {/* Error Banner Toast */}
                    <AnimatePresence>
                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs font-medium text-rose-300 shadow-lg"
                            >
                                {errorMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Rating & Focus Area Grid */}
                    <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2">
                        <div className="group rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/40 flex flex-col justify-between">
                            <Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                                Overall Rating <span className="text-rose-500 text-sm font-bold">*</span>
                            </Label>
                            <div className="py-1">
                                <StarRating
                                    value={form.rating}
                                    onChange={(value) => handleChange("rating", value)}
                                />
                            </div>
                        </div>

                        <div className="group rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/40">
                            <Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                                Focus Area <span className="text-rose-500 text-sm font-bold">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {CATEGORIES.map((cat) => {
                                    const isSelected = form.category === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => handleChange("category", cat.id)}
                                            className={`relative px-2.5 py-1.5 text-[11px] cursor-pointer font-medium rounded-lg transition-all duration-200 text-left truncate ${
                                                isSelected
                                                    ? "text-white"
                                                    : "text-slate-400 hover:text-slate-200 bg-slate-900/40 hover:bg-slate-900/80"
                                            }`}
                                        >
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="activeCategoryPill"
                                                    className="absolute inset-0 rounded-lg bg-linear-to-r from-indigo-600 to-cyan-600 shadow-md shadow-indigo-600/20"
                                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                                />
                                            )}
                                            <span className="relative z-10 truncate block">{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Recommendation Selector */}
                    <motion.div variants={itemVariants} className="group rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/40">
                        <Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                            Would you recommend Invoxa to others? <span className="text-rose-500 text-sm font-bold">*</span>
                        </Label>
                        <RecommendationSelector
                            value={form.recommendation}
                            onChange={(value) => handleChange("recommendation", value)}
                        />
                    </motion.div>

                    {/* Textareas */}
                    <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-medium text-slate-300 flex items-center">
                                What do you like most? <span className="text-rose-500 text-sm font-bold">*</span>
                            </Label>
                            <Textarea
                                rows={2}
                                value={form.liked}
                                onChange={(e) => handleChange("liked", e.target.value)}
                                placeholder="Features, design, speed..."
                                className="resize-none rounded-xl border-slate-800/80 bg-slate-950/60 text-xs text-slate-200 placeholder:text-slate-600 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/20"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-medium text-slate-300 flex items-center">
                                What can we improve? <span className="text-rose-500 text-sm font-bold">*</span>
                            </Label>
                            <Textarea
                                rows={2}
                                value={form.improvement}
                                onChange={(e) => handleChange("improvement", e.target.value)}
                                placeholder="Missing features, pain points..."
                                className="resize-none rounded-xl border-slate-800/80 bg-slate-950/60 text-xs text-slate-200 placeholder:text-slate-600 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/20"
                            />
                        </div>
                    </motion.div>

                    {/* User Info Fields */}
                    <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-medium text-slate-300 flex items-center">
                                Name <span className="text-rose-500 text-sm font-bold">*</span>
                            </Label>
                            <Input
                                value={form.name}
                                disabled={!!user}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="John Doe"
                                className="h-9 rounded-xl border-slate-800/80 bg-slate-950/60 text-xs text-slate-200 placeholder:text-slate-600 disabled:opacity-60 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/20"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-medium text-slate-300 flex items-center">
                                Email <span className="text-rose-500 text-sm font-bold">*</span>
                            </Label>
                            <Input
                                type="email"
                                value={form.email}
                                disabled={!!user}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="john@example.com"
                                className="h-9 rounded-xl border-slate-800/80 bg-slate-950/60 text-xs text-slate-200 placeholder:text-slate-600 disabled:opacity-60 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/20"
                            />
                        </div>
                    </motion.div>

                    {/* Submit Button & Footer text */}
                    <motion.div variants={itemVariants} className="pt-2">
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-10 w-full rounded-xl cursor-pointer bg-linear-to-r from-indigo-600 to-cyan-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-indigo-500 hover:to-cyan-500"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                        Submitting Feedback...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-3.5 w-3.5" />
                                        Submit Feedback
                                    </>
                                )}
                            </Button>
                        </motion.div>
                        <p className="text-center text-[10px] text-slate-500 mt-2">
                            Secure submission. We respect your privacy.
                        </p>
                    </motion.div>
                </motion.form>
            )}
        </AnimatePresence>
    );
}