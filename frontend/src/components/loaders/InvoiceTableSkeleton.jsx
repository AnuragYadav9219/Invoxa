import { cn } from "@/lib/utils";

/* ================= SHIMMER ================= */
function Shimmer({ className }) {
    return (
        <div
            className={cn(
                "skeleton-shimmer rounded-lg",
                className
            )}
        />
    );
}

/* ================= DESKTOP ================= */
function DesktopSkeleton() {
    return (
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border hover:shadow-md transition p-4 space-y-4">

            <p className="text-sm text-gray-400 mb-2 animate-pulse">
                Loading invoices...
            </p>

            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    style={{ "--i": i }}
                    className="grid grid-cols-8 gap-4 items-center skeleton-delay transition-opacity duration-300"
                >
                    <Shimmer className="h-4 w-24" />

                    <div className="flex items-center gap-3">
                        <Shimmer className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Shimmer className="h-4 w-24" />
                            <Shimmer className="h-3 w-16" />
                        </div>
                    </div>

                    <Shimmer className="h-4 w-16" />
                    <Shimmer className="h-4 w-16" />
                    <Shimmer className="h-4 w-16" />
                    <Shimmer className="h-6 w-20 rounded-full" />
                    <Shimmer className="h-4 w-20" />
                    <Shimmer className="h-8 w-16 ml-auto rounded-md" />
                </div>
            ))}
        </div>
    );
}

/* ================= TABLET ================= */
function TabletSkeleton() {
    return (
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    style={{ "--i": i }}
                    className="bg-white p-4 rounded-2xl shadow-sm border hover:shadow-md transition space-y-3 skeleton-delay"
                >
                    <Shimmer className="h-4 w-24" />

                    <div className="flex gap-3">
                        <Shimmer className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Shimmer className="h-4 w-28" />
                            <Shimmer className="h-3 w-20" />
                        </div>
                    </div>

                    <Shimmer className="h-4 w-full" />
                    <Shimmer className="h-8 w-full" />
                </div>
            ))}
        </div>
    );
}

/* ================= MOBILE ================= */
function MobileSkeleton() {
    return (
        <div className="block md:hidden space-y-4">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    style={{ "--i": i }}
                    className="bg-white p-4 rounded-2xl shadow-sm border hover:shadow-md transition space-y-3 skeleton-delay"
                >
                    <Shimmer className="h-4 w-28" />

                    <div className="flex gap-3">
                        <Shimmer className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Shimmer className="h-4 w-24" />
                            <Shimmer className="h-3 w-20" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <Shimmer className="h-4 w-full" />
                        <Shimmer className="h-4 w-full" />
                        <Shimmer className="h-4 w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ================= EXPORT ================= */
export default function InvoiceTableSkeleton() {
    return (
        <>
            <DesktopSkeleton />
            <TabletSkeleton />
            <MobileSkeleton />
        </>
    );
}