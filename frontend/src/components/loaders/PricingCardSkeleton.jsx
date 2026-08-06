import { Skeleton } from "@/components/ui/skeleton";

export default function PricingCardSkeleton() {
    return (
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-xl">
            {/* Plan Name */}
            <Skeleton className="h-8 w-32 rounded-md bg-slate-800" />

            {/* Description */}
            <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full bg-slate-800" />
                <Skeleton className="h-4 w-3/4 bg-slate-800" />
            </div>

            {/* Price */}
            <div className="mt-8 flex items-end gap-2">
                <Skeleton className="h-12 w-24 bg-slate-800" />
                <Skeleton className="h-5 w-16 bg-slate-800" />
            </div>

            {/* Features */}
            <div className="mt-10 space-y-4 border-t border-slate-800 pt-6">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-full bg-slate-800" />
                        <Skeleton className="h-4 flex-1 bg-slate-800" />
                    </div>
                ))}
            </div>

            {/* Button */}
            <Skeleton className="mt-8 h-12 w-full rounded-xl bg-slate-800" />
        </div>
    );
}