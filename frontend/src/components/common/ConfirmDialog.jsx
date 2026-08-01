import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { CONFIRM_DIALOG_VARIANTS } from "@/config/uiConfig";

export default function ConfirmDialog({
    children,
    onConfirm,
    description,
    type = "delete",
    title,
}) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const contentRef = useRef(null);

    const config = CONFIRM_DIALOG_VARIANTS[type] || CONFIRM_DIALOG_VARIANTS.delete;

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (open && !loading && contentRef.current && !contentRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("pointerdown", handleOutsideClick, true);
        }

        return () => {
            document.removeEventListener("pointerdown", handleOutsideClick, true);
        };
    }, [open, loading]);

    const handleConfirm = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await onConfirm();
            setOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent
                ref={contentRef}
                className="w-[95vw] sm:w-full max-w-120 gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            >
                <div className="p-6 sm:p-8">
                    <AlertDialogHeader className="flex flex-col gap-4 text-left sm:flex-row sm:items-start sm:gap-5">

                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-inset ring-white/10 ${config.bg} text-white transition-transform duration-300 hover:scale-105 hover:-rotate-3`}
                        >
                            {config.icon}
                        </div>

                        <div className="flex flex-col gap-1.5 pt-1">
                            <AlertDialogTitle className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                                {title || config.title}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm font-medium leading-relaxed text-slate-500">
                                {description}
                            </AlertDialogDescription>
                        </div>

                    </AlertDialogHeader>
                </div>

                <AlertDialogFooter className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 pb-8 sm:px-8">
                    <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3">

                        <AlertDialogCancel
                            disabled={loading}
                            className="m-0 h-10 w-full rounded-lg border cursor-pointer border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-95 sm:w-auto"
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleConfirm}
                            disabled={loading}
                            className={`group flex h-10 w-full items-center cursor-pointer justify-center gap-2 rounded-lg px-6 font-semibold text-white shadow-sm transition-all active:scale-95 sm:w-auto ${config.btn} ${loading ? "pointer-events-none opacity-80" : "hover:brightness-110"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>{config.loadingText}</span>
                                </>
                            ) : (
                                <span>{config.confirmText}</span>
                            )}
                        </AlertDialogAction>

                    </div>
                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog>
    );
}