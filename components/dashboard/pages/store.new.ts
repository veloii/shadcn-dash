import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { createScopedStore } from "simple-scoped-zustand";
import {
	AreaChartIcon,
	BarChart,
	LineChartIcon,
	LucideIcon,
	Navigation,
} from "lucide-react";
import { Color } from "@/lib/utils";

export const viewTypes = ["area", "bar", "line", "geo"] as const;

export type ViewType = (typeof viewTypes)[number];
export type Id = number;
export type Filters = Record<string, string[]>;

export type Page = {
	id: Id;
	name: string;
	emoji?: string;
	splits: Split[];
};

export type SplitType = "whole" | "half" | "third";

export type Split = {
	type: SplitType;
	views: View[];
};
export const viewTypeIcons: Record<ViewType, LucideIcon> = {
	line: LineChartIcon,
	geo: Navigation,
	area: AreaChartIcon,
	bar: BarChart,
};

export type View = {
	stat: string;
	id: Id;
	type: ViewType;
	color: Color;
	filters: Filters;
};

export const usePageStore = create(
	persist(
		combine(
			{
				pages: [] as Page[],
				selectedId: null as number | null,
			},
			(set) => ({
				addPage: (page: Page) => {
					set((state) => ({
						pages: [...state.pages, page],
					}));
				},

				setCurrentPage: (id: number) => {
					set({ selectedId: id });
				},

				edit: (id: number, page: Partial<Page>) =>
					set((state) => ({
						pages: state.pages.map((p) =>
							p.id === id ? { ...p, ...page } : p,
						),
					})),

				addViewFilter: (
					id: number | undefined | null,
					viewId: number,
					key: string,
					value: string,
				) => {
					if (!id) return;
					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;
						const splits = page.splits.map((split) => {
							const views = split.views.map((v) =>
								v.id === viewId
									? {
											...v,
											filters: {
												...v.filters,
												[key]: [...(v.filters[key] || []), value],
											},
									  }
									: v,
							);
							return { ...split, views };
						});
						return {
							pages: state.pages.map((p) =>
								p.id === id ? { ...p, splits } : p,
							),
						};
					});
				},

				removeViewFilter(
					id: number | undefined | null,
					viewId: number,
					key: string,
					value?: string,
				) {
					if (!id) return;
					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;
						const splits = page.splits.map((split) => {
							const views = split.views.map((v) => {
								if (v.id !== viewId) return v;

								if (!value) {
									delete v.filters[key];
								} else {
									v.filters[key] = v.filters[key]?.filter((v) => v !== value);
								}

								return v;
							});
							return { ...split, views };
						});
						return {
							pages: state.pages.map((p) =>
								p.id === id ? { ...p, splits } : p,
							),
						};
					});
				},

				editView: (
					id: number | null | undefined,
					viewId: number | null | undefined,
					view: Partial<View>,
				) => {
					if (!id || !viewId) return;

					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;
						const splits = page.splits.map((split) => {
							const views = split.views.map((v) =>
								v.id === viewId ? { ...v, ...view } : v,
							);
							return { ...split, views };
						});
						return {
							pages: state.pages.map((p) =>
								p.id === id ? { ...p, splits } : p,
							),
						};
					});
				},

				deletePage: (id: number) => {
					set((state) => ({
						pages: state.pages.filter((page) => page.id !== id),
						selectedId: state.selectedId === id ? null : state.selectedId,
					}));
				},
			}),
		),
		{
			name: "page-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export const [CurrentPageProvider, useCurrentPage] = createScopedStore(
	usePageStore,
	({ pages }) =>
		({ id }: { id: Id }) => {
			const page = pages.find((p) => p.id === id);
			if (!page) throw new Error(`No page found with id ${id}`);
			return page;
		},
);

export const [SplitProvider, useSplit] = createScopedStore(
	useCurrentPage,
	({ splits }) =>
		({ index }: { index: number }) => {
			return splits[index];
		},
);

export const [ViewProvider, useView] = createScopedStore(
	useSplit,
	({ views }) =>
		({ index }: { index: number }) => {
			const store = usePageStore();
			const view = views[index];

			return {
				...view,
				addFilter: (k: string, v: string) =>
					store.addViewFilter(store.selectedId, view.id, k, v),
				removeFilter: (k: string, v?: string) =>
					store.removeViewFilter(store.selectedId, view.id, k, v),
				editView: (view: Partial<View>) =>
					store.editView(store.selectedId, view.id, view),
			};
		},
);
