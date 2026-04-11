import { Clock, Construction } from "lucide-react";

export default function ComingSoon({
    title = "Coming Soon",
    description = "This feature is under development and will be available soon.",
    icon: Icon = Construction,
}) {
    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-8 text-center">

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-yellow-100">
                        <Icon className="w-8 h-8 text-yellow-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-6">
                    {description}
                </p>

                {/* Footer Hint */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Stay tuned for updates</span>
                </div>
            </div>
        </div>
    );
}