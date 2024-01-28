import { format, parseISO, subDays } from "date-fns";
import {
	Area,
	CartesianGrid,
	AreaChart as RechartAreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { cn, Color } from "@/lib/utils";

import { CustomTooltip } from "./tooltip";
import { ChartProps } from ".";

const areaColors: Record<Color, { dot: string; className: string }> = {
	primary: {
		dot: "fill-primary",
		className: "fill-primary/10 stroke-primary",
	},
	red: {
		dot: "fill-red-500",
		className: "fill-red-500/10 stroke-red-500",
	},
	orange: {
		dot: "fill-orange-500",
		className: "fill-orange-500/10 stroke-orange-500",
	},
	amber: {
		dot: "fill-amber-500",
		className: "fill-amber-500/10 stroke-amber-500",
	},
	yellow: {
		dot: "fill-yellow-500",
		className: "fill-yellow-500/10 stroke-yellow-500",
	},
	lime: {
		dot: "fill-lime-500",
		className: "fill-lime-500/10 stroke-lime-500",
	},
	green: {
		dot: "fill-green-500",
		className: "fill-green-500/10 stroke-green-500",
	},
	emerald: {
		dot: "fill-emerald-500",
		className: "fill-emerald-500/10 stroke-emerald-500",
	},
	teal: {
		dot: "fill-teal-500",
		className: "fill-teal-500/10 stroke-teal-500",
	},
	cyan: {
		dot: "fill-cyan-500",
		className: "fill-cyan-500/10 stroke-cyan-500",
	},
	sky: {
		dot: "fill-sky-500",
		className: "fill-sky-500/10 stroke-sky-500",
	},
	blue: {
		dot: "fill-blue-500",
		className: "fill-blue-500/10 stroke-blue-500",
	},
	indigo: {
		dot: "fill-indigo-500",
		className: "fill-indigo-500/10 stroke-indigo-500",
	},
	violet: {
		dot: "fill-violet-500",
		className: "fill-violet-500/10 stroke-violet-500",
	},
	purple: {
		dot: "fill-purple-500",
		className: "fill-purple-500/10 stroke-purple-500",
	},
	fuchsia: {
		dot: "fill-fuchsia-500",
		className: "fill-fuchsia-500/10 stroke-fuchsia-500",
	},
	pink: {
		dot: "fill-pink-500",
		className: "fill-pink-500/10 stroke-pink-500",
	},
	rose: {
		dot: "fill-rose-500",
		className: "fill-rose-500/10 stroke-rose-500",
	},
};

export function AreaChart<T>({ data, height, color, x, y }: ChartProps<T>) {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<RechartAreaChart data={data}>
				<Area
					dataKey={y as string}
					stroke=""
					fill=""
					className={cn("transition-all", areaColors[color].className)}
					activeDot={{
						className: cn("stroke-0 backdrop-blur-sm", areaColors[color].dot),
					}}
					animationDuration={500}
				/>

				<XAxis
					dataKey={x as string}
					axisLine={false}
					tickLine={false}
					padding={{ left: 20, right: 40 }}
					tickFormatter={(str, i) => {
						const date = parseISO(str);

						if (i % 2 === 0) return format(date, "MMM d");
						return "";
					}}
					className="text-xs"
				/>

				<YAxis
					dataKey={y as string}
					axisLine={false}
					tickLine={false}
					tickCount={7}
					tickMargin={10}
					className="text-xs"
					padding={{ top: 20, bottom: 20 }}
					tickFormatter={(number) => `$${number.toFixed(2)}`}
				/>

				<Tooltip
					content={CustomTooltip}
					position={{ y: 100 }}
					isAnimationActive={false}
					cursor={{ stroke: "hsl(var(--foreground))", opacity: 0.5 }}
				/>

				<CartesianGrid
					className="opacity-30 dark:opacity-10"
					vertical={false}
				/>
			</RechartAreaChart>
		</ResponsiveContainer>
	);
}
