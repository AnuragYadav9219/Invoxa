import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Download, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileImagePreview({
    open,
    onOpenChange,
    image,
    name,
}) {
    if (!image) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[92%] sm:max-w-2xl max-w-lg border border-white/10 bg-slate-950/90 backdrop-blur-xl p-0 overflow-hidden rounded-3xl shadow-2xl">
                <DialogTitle className="sr-only">
                    Profile image preview
                </DialogTitle>

                {/* Animated Image Wrapper */}
                <div className="relative flex items-center justify-center p-6 sm:p-8 min-h-75 sm:min-h-100">

                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40"
                    >
                        <img
                            src={image}
                            alt={name || "Profile Preview"}
                            className="w-full max-h-[70vh] object-contain transition-transform duration-300"
                        />
                    </motion.div>

                    {/* Close Button */}
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute top-4 right-4 z-20 cursor-pointer border border-white/10 rounded-full bg-white/10 backdrop-blur-md p-2.5 text-white/80 hover:text-white hover:bg-white/20 transition-all active:scale-95"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Bottom Bar */}
                <div className="px-6 py-4 bg-black/60 border-t border-white/10 flex items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                            <Eye size={15} />
                        </div>
                        <span className="text-xs font-semibold text-slate-300 truncate max-w-45 sm:max-w-xs">
                            {name ? `${name}'s Profile Picture` : "Profile Picture"}
                        </span>
                    </div>

                    <Button
                        variant="secondary"
                        className="cursor-pointer bg-white text-slate-950 hover:bg-slate-200 font-semibold text-xs h-10 px-4 rounded-xl shadow-lg transition-all active:scale-95"
                        onClick={() => window.open(image, "_blank")}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Open Original
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}