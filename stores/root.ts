import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { Page } from "./page";
import { View } from "./view";
import { Split, SplitType } from "./split";
import { randomId } from "@/lib/utils";

export const wrap =
	<Param>(param: Param) =>
	<U, T extends U[], RT>(fn: (param: Param, ...args: T) => RT) => {
		return (...args: T) => fn(param, ...args);
	};

export type Id = number;

// i have committed a sin
// then i made simple-scoped-zustand to try and fix it...
export const useRootStore = create(
	persist(
		combine(
			{
				pages: [] as Page[],
				selectedId: null as number | null,
				sidebarOpen: true,
			},
			(set, get) => ({
				toggleSidebar: () => {
					set((state) => ({ sidebarOpen: !state.sidebarOpen }));
				},

				addPage: (page: Page) => {
					set((state) => ({
						pages: [...state.pages, page],
					}));
				},

				setCurrentPage: (id: number) => {
					set({ selectedId: id });
				},

				editPage: (id: number, page: Partial<Page>) =>
					set((state) => ({
						pages: state.pages.map((p) =>
							p.id === id ? { ...p, ...page } : p,
						),
					})),

				selectView: (
					id: number,
					splitId: number,
					viewGroupId: number,
					viewId: number,
				) => {
					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;
						const splits = page.splits.map((split) => {
							if (split.id !== splitId) return split;
							const viewGroups = split.viewGroups.map((vg) => {
								if (vg.id !== viewGroupId) return vg;
								return { ...vg, selectedViewId: viewId };
							});
							return { ...split, viewGroups };
						});
						return {
							pages: state.pages.map((p) =>
								p.id === id ? { ...p, splits } : p,
							),
						};
					});
				},

				createViewFromStat(
					id: number,
					splitId: number,
					viewGroupId: number,
					stat: string,
				) {
					const view: View = {
						stat,
						id: randomId(),
						type: "line",
						color: "blue",
						// we change it based on the stat, defualt to time
						display: "time",
						filters: {},
					};
					// TODO: duplicated code, i dont believe we need addView
					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;
						const splits = page.splits.map((split) => {
							if (split.id !== splitId) return split;
							const viewGroups = split.viewGroups.map((vg) => {
								if (vg.id !== viewGroupId) return vg;
								return { ...vg, views: [...vg.views, view] };
							});
							return { ...split, viewGroups };
						});
						return {
							pages: state.pages.map((p) =>
								p.id === id ? { ...p, splits } : p,
							),
						};
					});
					return view;
				},

				moveView: (
					id: number,
					splitId: number,
					viewGroupId: number,
					viewId: number,
					newIndex: number,
				) => {
					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;
						const splits = page.splits.map((split) => {
							if (split.id !== splitId) return split;
							const viewGroups = split.viewGroups.map((vg) => {
								if (vg.id !== viewGroupId) return vg;
								const views = vg.views;
								const view = views.find((v) => v.id === viewId);
								if (!view) return vg;
								views.splice(views.indexOf(view), 1);
								views.splice(newIndex, 0, view);
								return { ...vg, views };
							});
							return { ...split, viewGroups };
						});
						return {
							pages: state.pages.map((p) =>
								p.id === id ? { ...p, splits } : p,
							),
						};
					});
				},

				addView: (
					id: number,
					splitId: number,
					viewGroupId: number,
					view: View,
					index?: number,
				) => {
					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;
						const splits = page.splits.map((split) => {
							if (split.id !== splitId) return split;
							const viewGroups = split.viewGroups.map((vg) => {
								const views = vg.views;
								if (vg.id !== viewGroupId) return vg;
								if (index !== undefined) {
									views.splice(index, 0, view);
								} else {
									views.push(view);
								}
								return { ...vg, views };
							});
							return { ...split, viewGroups };
						});
						return {
							pages: state.pages.map((p) =>
								p.id === id ? { ...p, splits } : p,
							),
						};
					});
				},

				deleteViewGroup: (id: number, splitId: number, viewGroupId: number) => {
					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;
						const splits = page.splits.map((split) => {
							if (split.id !== splitId) return split;
							const viewGroups = split.viewGroups.filter(
								(vg) => vg.id !== viewGroupId,
							);
							return { ...split, viewGroups };
						});
						return {
							pages: state.pages.map((p) =>
								p.id === id ? { ...p, splits } : p,
							),
						};
					});
				},

				addSplit: (id: number, type: SplitType) => {
					const split: Split = {
						id: randomId(),
						type,
						viewGroups: Array.from(
							{ length: type === "whole" ? 1 : type === "half" ? 2 : 3 },
							() => ({
								id: randomId(),
								views: [],
								selectedViewId: null,
							}),
						),
					};

					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;
						return {
							pages: state.pages.map((p) =>
								p.id === id ? { ...p, splits: [...p.splits, split] } : p,
							),
						};
					});

					return split;
				},

				deleteSplit: (id: number, splitId: number) => {
					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;
						const splits = page.splits.filter(({ id }) => id !== splitId);
						return {
							pages: state.pages.map((p) =>
								p.id === id ? { ...p, splits } : p,
							),
						};
					});
				},

				deleteView: (
					id: number,
					splitId: number,
					viewGroupId: number,
					viewId: number,
				) => {
					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;
						const splits = page.splits.map((split) => {
							if (split.id !== splitId) return split;
							const viewGroups = split.viewGroups.map((vg) => {
								if (vg.id !== viewGroupId) return vg;
								const views = vg.views.filter((v) => v.id !== viewId);
								return { ...vg, views };
							});
							return { ...split, viewGroups };
						});
						return {
							pages: state.pages.map((p) =>
								p.id === id ? { ...p, splits } : p,
							),
						};
					});
				},

				getViewGroup(
					id: number,
					splitId: number,
					viewGroupId: number | undefined,
				) {
					const page = get().pages.find((p) => p.id === id);
					if (!page) return;
					const split = page.splits.find((s) => s.id === splitId);
					if (!split) return;
					return split.viewGroups.find((vg) => vg.id === viewGroupId);
				},

				getView: (
					id: number,
					splitId: number,
					viewGroupId: number | undefined,
					viewId: number | undefined,
				) => {
					const page = get().pages.find((p) => p.id === id);
					if (!page) return;
					const split = page.splits.find((s) => s.id === splitId);
					if (!split) return;
					const viewGroup = split.viewGroups.find(
						(vg) => vg.id === viewGroupId,
					);
					if (!viewGroup) return;
					return viewGroup.views.find((v) => v.id === viewId);
				},

				addViewFilter(
					id: number | undefined | null,
					splitId: number,
					viewGroupId: number,
					viewId: number,
					key: string,
					value: string,
				) {
					if (!id) return;

					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;

						const splits = page.splits.map((split) => {
							if (split.id !== splitId) return split;

							const viewGroups = split.viewGroups.map((vg) => {
								if (vg.id !== viewGroupId) return vg;

								const views = vg.views.map((v) => {
									if (v.id !== viewId) return v;
									if (!v.filters[key]) {
										v.filters[key] = [value];
									} else {
										v.filters[key].push(value);
									}
									return v;
								});

								return { ...vg, views };
							});
							return { ...split, viewGroups };
						});

						return {
							pages: state.pages.map((p) =>
								p.id === id ? { ...p, splits } : p,
							),
						};
					});
				},

				deleteViewFilter(
					id: number | undefined | null,
					splitId: number,
					viewGroupId: number,
					viewId: number,
					key: string,
					value?: string,
				) {
					if (!id) return;
					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;
						const splits = page.splits.map((split) => {
							if (split.id !== splitId) return split;
							const viewGroups = split.viewGroups.map((vg) => {
								if (vg.id !== viewGroupId) return vg;
								const views = vg.views.map((v) => {
									if (v.id !== viewId) return v;
									if (value && v.filters[key].length > 1) {
										v.filters[key] = v.filters[key].filter((f) => f !== value);
									} else {
										delete v.filters[key];
									}
									return v;
								});
								return { ...vg, views };
							});
							return { ...split, viewGroups };
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
					splitId: number,
					viewGroupId: number,
					viewId: number | null | undefined,
					view: Partial<View>,
				) => {
					if (!id || !viewId) return;

					set((state) => {
						const page = state.pages.find((p) => p.id === id);
						if (!page) return state;

						const splits = page.splits.map((split) => {
							if (split.id !== splitId) return split;
							const viewGroups = split.viewGroups.map((vg) => {
								if (vg.id !== viewGroupId) return vg;
								const views = vg.views.map((v) => {
									if (v.id !== viewId) return v;
									return { ...v, ...view };
								});
								return { ...vg, views };
							});
							return { ...split, viewGroups };
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
			name: "root-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
