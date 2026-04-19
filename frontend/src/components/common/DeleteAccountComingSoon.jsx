import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, Clock } from "lucide-react";
import { useState } from "react";

export function DeleteAccountComingSoon() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-between text-red-500 hover:text-red-600 group"
                >
                    <div className="flex items-center gap-2">
                        <Trash2 size={16} />
                        Delete Account
                    </div>
                    <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                    />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-amber-600">
                        <Clock size={18} />
                        <DialogTitle>Coming Soon</DialogTitle>
                    </div>

                    <DialogDescription>
                        Account deletion is not available yet.
                        <br />
                        We’re working on a secure way to handle this feature.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        This action will permanently delete your account and all associated data.
                        For safety reasons, it will include:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Password confirmation</li>
                            <li>Secure backend verification</li>
                            <li>Data cleanup</li>
                        </ul>
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full"
                        disabled
                    >
                        Delete Account (Coming Soon)
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}