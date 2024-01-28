import { cn, Color } from "@/lib/utils";

import { SelectContent, SelectGroup, SelectItem } from "./select";

const colorClass: Record<Color, string> = {
	primary: "bg-primary",
	red: "bg-red-500",
	orange: "bg-orange-500",
	amber: "bg-amber-500",
	yellow: "bg-yellow-500",
	lime: "bg-lime-500",
	green: "bg-green-500",
	emerald: "bg-emerald-500",
	teal: "bg-teal-500",
	cyan: "bg-cyan-500",
	sky: "bg-sky-500",
	blue: "bg-blue-500",
	indigo: "bg-indigo-500",
	violet: "bg-violet-500",
	purple: "bg-purple-500",
	fuchsia: "bg-fuchsia-500",
	pink: "bg-pink-500",
	rose: "bg-rose-500",
};

export function ColorPickerSelect() {
	return (
		<SelectContent>
			<SelectGroup>
				{Object.entries(colorClass).map(([color, className]) => (
					<SelectItem key={color} value={color}>
						<div
							className={cn(
								"size-2.5 rounded-full inline-block mr-2 my-auto",
								className,
							)}
						/>
						{color[0].toUpperCase()}
						{color.slice(1)}
					</SelectItem>
				))}
			</SelectGroup>
		</SelectContent>
	);
}
