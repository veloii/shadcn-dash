import { createScopedStore } from "simple-scoped-zustand";
import { useSplit } from "./split";
import { Id, wrap } from "./root";
import { View } from "./view";
import { useMemo } from "react";

export type ViewGroup = {
	id: Id;
	views: View[];
	selectedViewId: Id | null;
};

export const [ViewGroupProvider, useViewGroup] = createScopedStore(
	useSplit,
	({
		getViewGroup,
		editView,
		addViewFilter,
		deleteViewFilter,
		addView,
		deleteViewGroup,
		selectView,
		deleteView,
		createViewFromStat,
	}) =>
		({ id }: { id: number }) => {
			const viewGroup = getViewGroup(id);
			if (!viewGroup) throw new Error(`View Group ${id} not found`);
			const wid = wrap(id);

			return useMemo(
				() => ({
					...viewGroup,
					editView: wid(editView),
					addViewFilter: wid(addViewFilter),
					deleteViewFilter: wid(deleteViewFilter),
					addView: wid(addView),
					deleteViewGroup: wid(deleteViewGroup),
					selectView: wid(selectView),
					createViewFromStat: wid(createViewFromStat),
					deleteView: wid(deleteView),
				}),
				[viewGroup.id, viewGroup.selectedViewId, viewGroup.views],
			);
		},
);
