import { useState } from "react";
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
import { Loader2 } from "lucide-react";
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

    const config = CONFIRM_DIALOG_VARIANTS[type];

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
            setOpen(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-2xl max-w-md">

                {/* HEADER */}
                <AlertDialogHeader>
                    <div className={`mx-auto p-3 rounded-full w-fit mb-2 ${config.bg}`}>
                        {config.icon}
                    </div>

                    <AlertDialogTitle className="text-center font-bold text-lg text-slate-900">
                        {title || config.title}
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-center text-slate-500 px-2">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* FOOTER */}
                <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-4">

                    <AlertDialogCancel
                        disabled={loading}
                        className="cursor-pointer rounded-xl h-11 border-slate-200 font-medium"
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`${config.btn} cursor-pointer rounded-xl h-11 font-medium flex items-center justify-center gap-2 shadow-sm`}
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        {loading ? config.loadingText : config.confirmText}
                    </AlertDialogAction>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}