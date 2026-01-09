import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center border-2 px-2 h-7 rounded-md text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer w-fit text-nowrap",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
        destructive:
          "border-transparent bg-rose-500 text-white hover:bg-rose-600 shadow-sm",
        outline:
          "border-input bg-background hover:bg-accent hover:text-accent-foreground",
        orange:
          "border-orange-100 bg-orange-500 text-white hover:bg-orange-600",
        red: "border-red-100 bg-red-500 text-white hover:bg-red-600",
        amber: "border-amber-100 bg-amber-500 text-white hover:bg-amber-600",
        yellow:
          "border-yellow-100 bg-yellow-500 text-white hover:bg-yellow-600",
        lime: "border-lime-100 bg-lime-500 text-white hover:bg-lime-600",
        green: "border-green-100 bg-green-500 text-white hover:bg-green-600",
        emerald:
          "border-emerald-100 bg-emerald-500 text-white hover:bg-emerald-600",
        teal: "border-teal-100 bg-teal-500 text-white hover:bg-teal-600",
        cyan: "border-cyan-100 bg-cyan-500 text-white hover:bg-cyan-600",
        sky: "border-sky-100 bg-sky-500 text-white hover:bg-sky-600",
        blue: "border-blue-100 bg-blue-500 text-white hover:bg-blue-600",
        indigo:
          "border-indigo-100 bg-indigo-500 text-white hover:bg-indigo-600",
        violet:
          "border-violet-100 bg-violet-500 text-white hover:bg-violet-600",
        purple:
          "border-purple-100 bg-purple-500 text-white hover:bg-purple-600",
        fuchsia:
          "border-fuchsia-100 bg-fuchsia-500 text-white hover:bg-fuchsia-600",
        pink: "border-pink-100 bg-pink-500 text-white hover:bg-pink-600",
        rose: "border-rose-100 bg-rose-500 text-white hover:bg-rose-600",
        slate: "border-slate-100 bg-slate-500 text-white hover:bg-slate-600",
        gray: "border-gray-100 bg-[#EEF6EF] text-gray-700 hover:bg-gray-200",
        zinc: "border-zinc-100 bg-zinc-500 text-white hover:bg-zinc-600",
        neutral:
          "border-neutral-100 bg-neutral-500 text-white hover:bg-neutral-600",
        stone: "border-stone-100 bg-stone-500 text-white hover:bg-stone-600",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
        info: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
        danger: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
