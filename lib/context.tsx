// edited version of
// https://github.com/pmndrs/zustand/issues/128#issuecomment-1832321201
// to support arguments and selectors

import type { UseBoundStore, StoreApi } from "zustand";
import { createContext, useContext, useState } from "react";

/**
 * Higher-order function to create a context provider and a custom hook for a given Zustand store.
 *
 * @param createStore - A factory function that creates a new Zustand store.
 * @returns A tuple containing the context provider and the custom hook.
 */
export function createStoreContext<TState, TCreateStoreArgs extends {}>(
	createStore: (props: TCreateStoreArgs) => UseBoundStore<StoreApi<TState>>,
) {
	type Store = UseBoundStore<StoreApi<TState>>;

	/**
	 * React context created to provide the Zustand store to components.
	 * This context will hold the Zustand store created by `createStore`.
	 */
	const StoreContext = createContext<Store | null>(null);

	type StoreProviderProps = React.PropsWithChildren & TCreateStoreArgs;

	/**
	 * React component that provides the Zustand store to its children components.
	 * It uses the `createStore` function to create a store instance and provides it via `StoreContext`.
	 */
	const StoreProvider: React.FC<StoreProviderProps> = ({
		children,
		...args
	}) => {
		const [useStore] = useState(() => createStore(args as TCreateStoreArgs));
		return (
			<StoreContext.Provider value={useStore}>{children}</StoreContext.Provider>
		);
	};

	/**
	 * Custom hook that provides access to the Zustand store within components.
	 * It uses `useContext` to access the store from `RowStoreContext` and returns the hook returned by the Zustand store.
	 */

	type UseStore<U> = [U] extends [never] ? TState : U;
	function useStore<U = never>(selector?: (selector: TState) => U) {
		const useStore = useContext(StoreContext);
		if (useStore === null) {
			throw new Error("useStore must be used within a StoreProvider.");
		}
		if (selector === undefined) return useStore() as UseStore<U>;
		return useStore(selector) as UseStore<U>;
	}

	return [StoreProvider, useStore] as const;
}
