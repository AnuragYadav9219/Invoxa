// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ArrowRight, Trash2 } from "lucide-react";
// import { useState } from "react";

// export function DeleteAccountDialog() {
//     const [open, setOpen] = useState(false);
//     const [confirmText, setConfirmText] = useState("");
//     const [loading, setLoading] = useState(false);

//     const isValid = confirmText === "DELETE";

//     const handleDelete = async () => {
//         if (!isValid) return;

//         setLoading(true);

//         try {
//             await new Promise((res) => setTimeout(res, 1500));

//             alert("Account deleted");
//             setOpen(false);
//         } catch (e) {
//             alert("Failed to delete account");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <Button
//                     variant="ghost"
//                     className="cursor-pointer justify-between text-red-500 hover:text-red-600 hover:bg-red-100 group"
//                 >
//                     <div className="flex items-center gap-2">
//                         <Trash2 size={16} />
//                         Delete Account
//                     </div>

//                     <ArrowRight
//                         size={14}
//                         className="transition-transform group-hover:translate-x-1"
//                     />
//                 </Button>
//             </DialogTrigger>

//             <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                     <DialogTitle className="text-red-600">
//                         Delete Account
//                     </DialogTitle>

//                     <DialogDescription>
//                         This action is permanent and cannot be undone.
//                         <br />
//                         Type <b>DELETE</b> to confirm.
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="space-y-4">
//                     <Input
//                         placeholder="Type DELETE to confirm"
//                         value={confirmText}
//                         onChange={(e) => setConfirmText(e.target.value)}
//                     />

//                     <Button
//                         variant="destructive"
//                         className="w-full"
//                         disabled={!isValid || loading}
//                         onClick={handleDelete}
//                     >
//                         {loading ? "Deleting..." : "Delete Account"}
//                     </Button>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }






















import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trash2, Clock } from "lucide-react";
import { useState } from "react";

export function DeleteAccountDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="cursor-pointer justify-between text-red-500 hover:text-red-600 hover:bg-red-100 group"
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
                        We’re working on a secure implementation for this feature.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        This action will permanently delete your account and all associated data.
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Password confirmation</li>
                            <li>Secure backend verification</li>
                            <li>Complete data removal</li>
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