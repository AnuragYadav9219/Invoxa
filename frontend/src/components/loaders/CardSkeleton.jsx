import { Skeleton } from "@/components/ui/skeleton";

export default function CardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl transition-all">
      
      <div className="flex items-center justify-between">
        
        <div className="space-y-3">
          <Skeleton className="h-3.5 w-24 rounded-md bg-slate-200/70" />
          <Skeleton className="h-8 w-32 rounded-lg bg-slate-200/70" />
        </div>

        <div className="rounded-xl border border-slate-100/50 bg-slate-50/50 p-3">
          <Skeleton className="h-6 w-6 rounded-md bg-slate-200/80" />
        </div>

      </div>

      <div className="mt-5 flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full bg-slate-200/80" />
        <Skeleton className="h-3 w-20 rounded-md bg-slate-200/60" />
      </div>

    </div>
  );
}