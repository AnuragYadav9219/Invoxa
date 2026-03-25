import Spinner from "./Spinner";

export default function PageLoader({ text = "Loading dashboard..." }) {
    return (
        <div className="h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">

            <div className="flex flex-col items-center gap-4">

                {/* Spinner with soft glow */}
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gray-300 blur-xl opacity-30" />
                    <Spinner size={36} className="relative z-10 text-gray-700" />
                </div>

                {/* Text */}
                <p className="text-sm text-gray-500 animate-pulse">
                    {text}
                </p>

            </div>
        </div>
    );
}