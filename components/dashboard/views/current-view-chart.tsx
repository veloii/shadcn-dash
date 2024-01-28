import { View, useCurrentView } from "@/components/dashboard/views/store";
import { AreaChart } from "../../ui/charts/area-chart";
import { BarChart } from "../../ui/charts/bar-chart";
import { LineChart } from "../../ui/charts/line-chart";
import { subDays } from "date-fns";
import { GeoMap } from "@/components/ui/charts/geo-map";

const charts = {
	area: AreaChart,
	line: LineChart,
	bar: BarChart,
	geo: GeoMap,
} as const;

function ViewChart({ view }: { view: View }) {
	const Comp = charts[view.type];

	const data: {
		date: string;
		value: number;
	}[] = [];
	for (let num = 30; num >= 0; num--) {
		data.push({
			date: subDays(new Date(), num).toISOString().substr(0, 10),
			value: 1 + Math.random(),
		});
	}

	return (
		<Comp height={450} data={data} x="date" y="value" color={view.color} />
	);
}

export function CurrentViewChart() {
	const view = useCurrentView();

	// some empty state
	if (!view) return null;

	return (
		<div className="grow min-h-[432px] overflow-hidden">
			<ViewChart view={view} />
		</div>
	);
}
