import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { removeSplitStore } from "../splits/store";

export type Page = {
	id: number;
	name: string;
	emoji?: string;
	splitStoreKeys: string[];
};

export const usePageStore = create(
	persist(
		combine(
			{
				pages: [] as Page[],
				selectedId: null as number | null,
			},
			(set, get) => ({
				addPage: (page: Page) => {
					set((state) => ({
						pages: [...state.pages, page],
					}));
				},
				addStoreKey: (id: number, key: string) => {
					set((state) => {
						return {
							pages: state.pages.map((page) => {
								if (page.id === id)
									return {
										...page,
										splitStoreKeys: [...page.splitStoreKeys, key],
									};
								return page;
							}),
						};
					});
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
				deleteStoreKey: (id: number, key: string) => {
					removeSplitStore(key);
					set((state) => {
						return {
							pages: state.pages.map((page) => {
								if (page.id === id) {
									return {
										...page,
										splitStoreKeys: page.splitStoreKeys.filter(
											(k) => k !== key,
										),
									};
								}
								return page;
							}),
						};
					});
				},
				deletePage: (id: number) => {
					const page = get().pages.find((p) => p.id === id);
					if (!page) return;
					for (const sKey of page.splitStoreKeys) {
						removeSplitStore(sKey);
					}
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

export const useCurrentPage = () => {
	const selectedId = usePageStore((state) => state.selectedId);
	const view = usePageStore((state) =>
		state.pages.find((v) => v.id === selectedId),
	);
	return view;
};
