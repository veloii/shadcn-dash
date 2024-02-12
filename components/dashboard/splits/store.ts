import { randomId } from "@/lib/utils";
import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { createStoreContext } from "@/lib/context";

export const makeSplitStorageKey = (syncKey: string) => `split-${syncKey}`;
const storage = typeof window === "undefined" ? ({} as Storage) : localStorage;

export type Split = "whole" | "half" | "third";

const splitLengths: Record<Split, number> = {
	whole: 1,
	half: 2,
	third: 3,
};

export const createSplitStore = ({
	syncKey,
	split = "whole",
}: { syncKey: string; split?: Split }) =>
	create(
		persist(
			combine(
				{
					syncKey,
					viewStoreKeys: Array.from({ length: splitLengths[split] }).map(() =>
						randomId().toString(),
					),
				},
				() => ({}),
			),
			{
				name: makeSplitStorageKey(syncKey),
				storage: createJSONStorage(() => storage),
			},
		),
	);

export const removeSplitStore = (syncKey: string) => {
	storage.removeItem(makeSplitStorageKey(syncKey));
};

export const [SplitStoreProvider, useSplitStore] =
	createStoreContext(createSplitStore);

export type SplitStore = ReturnType<
	ReturnType<typeof createSplitStore>["getInitialState"]
>;
