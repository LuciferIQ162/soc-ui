import * as React from "react"
import { cn } from "@/lib/utils"

type Variant = "default" | "destructive" | "outline"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
  const styles: Record<Variant, string> = {
    default: "bg-slate-800 text-slate-200",
    destructive: "bg-red-600 text-white",
    outline: "border border-slate-700 text-slate-200",
  }
  return <span className={cn(base, styles[variant], className)} {...props} />
}

export default Badge
