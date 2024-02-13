import { createScopedStore } from "simple-scoped-zustand";
import { ViewGroup } from "./view-group";
import { Id, wrap } from "./root";
import { useCurrentPage } from "./page";
import { useMemo } from "react";

export type SplitType = "whole" | "half" | "third";

export type Split = {
	id: Id;
	type: SplitType;
	viewGroups: ViewGroup[];
};

export const [SplitProvider, useSplit] = createScopedStore(
	useCurrentPage,
	({
		deleteSplit,
		addView,
		getViewGroup,
		editView,
		addViewFilter,
		deleteView,
		deleteViewFilter,
		deleteViewGroup,
		selectView,
		createViewFromStat,
		getView,
		moveView,
		page,
	}) =>
		({ id }: { id: number }) => {
			const wid = wrap(id);
			const split = page.splits.find((s) => s.id === id);

			return useMemo(
				() => ({
					split,
					deleteSplit: wid(deleteSplit),
					addView: wid(addView),
					getViewGroup: wid(getViewGroup),
					getView: wid(getView),
					editView: wid(editView),
					deleteView: wid(deleteView),
					addViewFilter: wid(addViewFilter),
					deleteViewFilter: wid(deleteViewFilter),
					deleteViewGroup: wid(deleteViewGroup),
					selectView: wid(selectView),
					moveView: wid(moveView),
					createViewFromStat: wid(createViewFromStat),
				}),
				[split?.id, split?.viewGroups, split?.type],
			);
		},
);
