import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const colors = ["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "primary"] as const;

export type Color = (typeof colors)[number]

export const colorClass: Record<Color, string> = {
  red: "dark:text-red-100 bg-red-500/50",
  orange: "dark:text-orange-100 bg-orange-500/50",
  amber: "dark:text-amber-100 bg-amber-500/50",
  yellow: "dark:text-yellow-100 bg-yellow-500/50",
  lime: "dark:text-lime-100 bg-lime-500/50",
  green: "dark:text-green-100 bg-green-500/50",
  emerald: "dark:text-emerald-100 bg-emerald-500/50",
  teal: "dark:text-teal-100 bg-teal-500/50",
  cyan: "dark:text-cyan-100 bg-cyan-500/50",
  sky: "dark:text-sky-100 bg-sky-500/50",
  blue: "dark:text-blue-100 bg-blue-500/50",
  indigo: "dark:text-indigo-100 bg-indigo-500/50",
  violet: "dark:text-violet-100 bg-violet-500/50",
  purple: "dark:text-purple-100 bg-purple-500/50",
  fuchsia: "dark:text-fuchsia-100 bg-fuchsia-500/50",
  pink: "dark:text-pink-100 bg-pink-500/50",
  rose: "dark:text-rose-100 bg-rose-500/50",
  primary: "text-primary bg-background dark dark:light",
}
