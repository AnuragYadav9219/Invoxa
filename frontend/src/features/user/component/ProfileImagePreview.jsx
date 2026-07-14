import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileImagePreview({
    open,
    onOpenChange,
    image,
    name,
}) {

    if (!image) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl border-none bg-black/95 p-0 overflow-hidden">
                <DialogTitle className="sr-only">
                    Profile image preview
                </DialogTitle>

                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-4 right-4 z-20 cursor-pointer border rounded-full bg-black/50 p-2 text-white hover:bg-black"
                >
                    <X size={18} />
                </button>

                <img
                    src={image}
                    alt={name}
                    className="w-full max-h-[80vh] object-contain"
                />

                <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                    <Button
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => window.open(image)}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Open Original
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}