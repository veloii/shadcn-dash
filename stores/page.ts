import { createScopedStore } from "simple-scoped-zustand";
import { Split } from "./split";
import { Id, useRootStore, wrap } from "./root";
import { useMemo } from "react";

export type Page = {
	id: Id;
	name: string;
	emoji?: string;
	splits: Split[];
};

export const [CurrentPageProvider, useCurrentPage] = createScopedStore(
	useRootStore,
	({
		pages,
		editPage,
		deletePage,
		deleteSplit,
		addSplit,
		getViewGroup,
		addView,
		editView,
		deleteViewGroup,
		deleteViewFilter,
		addViewFilter,
		selectView,
		createViewFromStat,
		deleteView,
	}) =>
		({ id }: { id: Id }) => {
			const page = pages.find((p) => p.id === id);
			if (!page) throw new Error(`No page found with id ${id}`);
			const wid = wrap(id);

			return useMemo(
				() => ({
					page,
					editPage: wid(editPage),
					deletePage: wid(deletePage),

					deleteSplit: wid(deleteSplit),
					addSplit: wid(addSplit),

					getViewGroup: wid(getViewGroup),
					deleteViewGroup: wid(deleteViewGroup),

					addView: wid(addView),
					editView: wid(editView),
					selectView: wid(selectView),
					createViewFromStat: wid(createViewFromStat),
					deleteView: wid(deleteView),

					deleteViewFilter: wid(deleteViewFilter),
					addViewFilter: wid(addViewFilter),
				}),
				[page.id, page.splits, page.name, page.emoji],
			);
		},
);
