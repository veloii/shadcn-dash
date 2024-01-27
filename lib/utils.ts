import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const colors = ["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "primary"] as const;

export type Color = (typeof colors)[number]

export const colorClass: Record<Color, string> = {
  red: "text-red-700 dark:text-red-100 dark:bg-red-500/50",
  orange: "text-orange-700 dark:text-orange-100 dark:bg-orange-500/50",
  amber: "text-amber-700 dark:text-amber-100 dark:bg-amber-500/50",
  yellow: "text-yellow-700 dark:text-yellow-100 dark:bg-yellow-500/50",
  lime: "text-lime-700 dark:text-lime-100 dark:bg-lime-500/50",
  green: "text-green-700 dark:text-green-100 dark:bg-green-500/50",
  emerald: "text-emerald-700 dark:text-emerald-100 dark:bg-emerald-500/50",
  teal: "text-teal-700 dark:text-teal-100 dark:bg-teal-500/50",
  cyan: "text-cyan-700 dark:text-cyan-100 dark:bg-cyan-500/50",
  sky: "text-sky-700 dark:text-sky-100 dark:bg-sky-500/50",
  blue: "text-blue-700 dark:text-blue-100 dark:bg-blue-500/50",
  indigo: "text-indigo-700 dark:text-indigo-100 dark:bg-indigo-500/50",
  violet: "text-violet-700 dark:text-violet-100 dark:bg-violet-500/50",
  purple: "text-purple-700 dark:text-purple-100 dark:bg-purple-500/50",
  fuchsia: "text-fuchsia-700 dark:text-fuchsia-100 dark:bg-fuchsia-500/50",
  pink: "text-pink-700 dark:text-pink-100 dark:bg-pink-500/50",
  rose: "text-rose-700 dark:text-rose-100 dark:bg-rose-500/50",
  primary: "text-primary-700 dark:text-primary-100 dark:bg-primary-500/50",
}