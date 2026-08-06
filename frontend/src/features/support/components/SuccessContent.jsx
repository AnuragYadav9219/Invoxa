import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessContent({
    successTicket,
    setSuccessTicket,
    setForm,
    onClose,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="p-4 sm:p-6 text-slate-100 relative overflow-hidden text-center"
        >
            {/* Ambient Glow Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            {/* Success Icon Badge with Spring Animation */}
            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
            >
                <CheckCircle2 size={36} className="text-emerald-400" />
            </motion.div>

            {/* Header Content */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="mt-4 relative z-10"
            >
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                    Ticket Submitted!
                </h2>
                <p className="mx-auto mt-1.5 max-w-xs text-xs sm:text-sm text-slate-400">
                    We've received your request and will get back to you via email within 24 hours.
                </p>
            </motion.div>

            {/* Ticket Number Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-6 rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4 backdrop-blur-xl relative z-10 shadow-inner"
            >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Ticket Reference
                </p>
                <p className="mt-1 text-lg sm:text-xl font-mono font-bold tracking-widest text-emerald-400">
                    {successTicket}
                </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="mt-6 flex flex-col sm:flex-row gap-3 relative z-10"
            >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                        className="w-full rounded-xl py-4 cursor-pointer bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all"
                        onClick={() => {
                            setSuccessTicket(null);
                            setForm((prev) => ({
                                ...prev,
                                subject: "",
                                message: "",
                            }));
                        }}
                    >
                        <span>Submit Another</span>
                        <ArrowRight size={15} className="ml-2" />
                    </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                        variant="outline"
                        className="w-full rounded-xl py-4 cursor-pointer border-slate-700 bg-slate-900/50 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        onClick={() => {
                            setSuccessTicket(null);
                            onClose();
                        }}
                    >
                        <X size={15} className="mr-2" />
                        Close
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}