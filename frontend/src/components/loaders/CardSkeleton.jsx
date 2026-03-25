import { Skeleton } from "@/components/ui/skeleton";

export default function CardSkeleton() {
    return (
        <div className="p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">

            <div className="flex items-center justify-between">

                {/* TEXT */}
                <div className="space-y-2">
                    <Skeleton className="h-3 w-20 rounded-md" />
                    <Skeleton className="h-7 w-28 rounded-md" />
                </div>

                {/* ICON */}
                <div className="p-3 rounded-xl bg-gray-100">
                    <Skeleton className="h-6 w-6 rounded-md" />
                </div>

            </div>

            {/* OPTIONAL: subtle progress bar (premium feel) */}
            <div className="mt-4">
                <Skeleton className="h-2 w-full rounded-full" />
            </div>

        </div>
    );
}