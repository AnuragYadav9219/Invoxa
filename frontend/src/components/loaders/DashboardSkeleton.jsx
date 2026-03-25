import CardSkeleton from "./CardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="space-y-3">
                <Skeleton className="h-7 w-44 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md" />
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 7 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-2xl shadow-sm p-4 space-y-4">

                {/* Table Header */}
                <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-40 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                </div>

                {/* Table Rows */}
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>

                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}