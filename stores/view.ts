import { Color } from "@/lib/utils";
import {
	AreaChartIcon,
	BarChart,
	LineChartIcon,
	LucideIcon,
	Navigation,
} from "lucide-react";
import { Id } from "./root";

export type View = {
	stat: string;
	id: Id;
	type: ViewType;
	color: Color;
	filters: Filters;
};

export const viewTypeIcons: Record<ViewType, LucideIcon> = {
	line: LineChartIcon,
	geo: Navigation,
	area: AreaChartIcon,
	bar: BarChart,
};

export const viewTypes = ["area", "bar", "line", "geo"] as const;

export type ViewType = (typeof viewTypes)[number];
export type Filters = Record<string, string[]>;

// not sure i need a whole store for this
// import { createScopedStore } from "simple-scoped-zustand";
//
// export const [ViewProvider, useViewProvider] = createScopedStore(
// 	useSplit,
// 	({
// 		getViewGroup,
// 		editView,
// 		addViewFilter,
// 		deleteViewFilter,
// 		addView,
// 		...store
// 	}) =>
// 		({ id }: { id: number }) => {
// 			const view = getViewGroup(id);
// 			if (!view) throw new Error(`View ${id} not found`);
// 			const wid = wrap(id);
//
// 			return {
// 				view,
// 				editView: wid(editView),
// 				addViewFilter: wid(addViewFilter),
// 				deleteViewFilter: wid(deleteViewFilter),
// 				addView: wid(addView),
// 				...store,
// 			};
// 		},
// );
