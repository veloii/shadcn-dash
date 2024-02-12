import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const colors = [
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
	"primary",
] as const;

export type Color = (typeof colors)[number];

export const colorClass: Record<Color, string> = {
	red: "dark:text-red-100 bg-red-600/20",
	orange: "dark:text-orange-100 bg-orange-600/20",
	amber: "dark:text-amber-100 bg-amber-600/20",
	yellow: "dark:text-yellow-100 bg-yellow-600/20",
	lime: "dark:text-lime-100 bg-lime-600/20",
	green: "dark:text-green-100 bg-green-600/20",
	emerald: "dark:text-emerald-100 bg-emerald-600/20",
	teal: "dark:text-teal-100 bg-teal-600/20",
	cyan: "dark:text-cyan-100 bg-cyan-600/20",
	sky: "dark:text-sky-100 bg-sky-600/20",
	blue: "dark:text-blue-100 bg-blue-600/20",
	indigo: "dark:text-indigo-100 bg-indigo-600/20",
	violet: "dark:text-violet-100 bg-violet-600/20",
	purple: "dark:text-purple-100 bg-purple-600/20",
	fuchsia: "dark:text-fuchsia-100 bg-fuchsia-600/20",
	pink: "dark:text-pink-100 bg-pink-600/20",
	rose: "dark:text-rose-100 bg-rose-600/20",
	primary: "text-primary bg-background dark dark:light",
};

export const randomId = () => Math.floor(Math.random() * 1000000);
export const randomColor = () =>
	colors[Math.floor(Math.random() * colors.length)];
