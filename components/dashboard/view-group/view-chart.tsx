import { AreaChart } from "../../ui/charts/area-chart";
import { BarChart } from "../../ui/charts/bar-chart";
import { LineChart } from "../../ui/charts/line-chart";
import { subDays } from "date-fns";
import { GeoMap } from "@/components/ui/charts/geo-map";
import { View } from "@/stores/view";
import { useViewGroup } from "@/stores/view-group";
import { memo } from "react";

const charts = {
	area: AreaChart,
	line: LineChart,
	bar: BarChart,
	geo: GeoMap,
} as const;

function Charts({ view }: { view: View }) {
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

export const CurrentViewChart = memo(function CurrentViewChart() {
	const view = useViewGroup((s) =>
		s.views.find((v) => v.id === s.selectedViewId),
	);
	console.log(view);

	if (!view) return null;

	return (
		<div className="min-h-[432px] overflow-hidden">
			<Charts view={view} />
		</div>
	);
});
