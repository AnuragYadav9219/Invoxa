import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorState({
    title = "Something went wrong",
    description = "We couldn't load your data. Please try again.",
    onRetry,
}) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-10 border rounded-2xl bg-white space-y-4">

            {/* ICON */}
            <div className="bg-red-50 p-4 rounded-full">
                <AlertTriangle className="text-red-500" size={28} />
            </div>

            {/* TEXT */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {description}
                </p>
            </div>

            {/* ACTION */}
            {onRetry && (
                <Button
                    onClick={onRetry}
                    className="flex items-center cursor-pointer gap-2"
                >
                    <RefreshCw size={16} />
                    Retry
                </Button>
            )}
        </div>
    );
}