import { cn } from "@/lib/utils";
import {
	ViewStoreProvider,
	useViewStore,
} from "@/components/dashboard/views/store";
import React from "react";
import { ViewsToolbar } from "./toolbar";
import { DraggableViewsItems } from "./view/view-item";
import { CurrentViewChart } from "./current-view-chart";
import { DropContainer } from "./drag-n-drop";

export function DndViews({ syncKey }: { syncKey: string }) {
	return (
		<ViewStoreProvider syncKey={syncKey}>
			<ViewsContainer>
				<ViewsToolbar asChild>
					<DropContainer id={syncKey}>
						<DraggableViewsItems />
					</DropContainer>
				</ViewsToolbar>

				<CurrentViewChart />
			</ViewsContainer>
		</ViewStoreProvider>
	);
}

function ViewsContainer({ children }: { children: React.ReactNode }) {
	const type = useViewStore((s) => s.tabsPosition);
	return (
		<div
			className={cn(
				type === "top" ? "flex flex-col divide-y" : "divide-x flex flex-row",
				"border rounded-lg",
			)}
		>
			{children}
		</div>
	);
}
