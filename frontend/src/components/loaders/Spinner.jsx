import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Spinner({
  size = 20,
  className,
  color = "text-indigo-600",
  variant = "default",
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        variant === "overlay" && 
          "absolute inset-0 z-50 bg-slate-50/50 backdrop-blur-sm",
        className
      )}
    >
      <Loader2
        size={size}
        className={cn(
          "animate-spin",
          color,
          variant === "subtle" && "opacity-50",
          "transition-all duration-300 ease-in-out"
        )}
      />
    </div>
  );
}