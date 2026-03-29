import React, { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Loader2 } from 'lucide-react';

export default function DeleteConfirmDialog({
    children,
    onConfirm,
    title = "Are you absolutely sure?",
    description,
}) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

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

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">
                        {title}
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading} className="cursor-pointer">
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-red-600 cursor-pointer hover:bg-red-700 flex items-center gap-2"
                    >
                        {loading && (
                            <Loader2 className='animate-spin' size={16} />
                        )}
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
