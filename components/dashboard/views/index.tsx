import { cn } from "@/lib/utils";
import {
	ViewStoreProvider,
	removeViewStore,
	useViewStore,
} from "@/components/dashboard/views/store";
import React, { memo } from "react";
import { ViewsToolbar } from "./toolbar";
import { DraggableViewsItems } from "./view/view-item";
import { CurrentViewChart } from "./current-view-chart";
import { DropContainer } from "./drag-n-drop";
import { EmptyViews } from "./empty-states";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageStore } from "../pages/store";
import { useSplitStore } from "../splits/store";

export const DndViews = memo(function DndViews({
	syncKey,
}: { syncKey: string }) {
	return (
		<ViewStoreProvider syncKey={syncKey}>
			<DropContainer id={syncKey}>
				<ViewsContent />
			</DropContainer>
		</ViewStoreProvider>
	);
});

function ViewsContent() {
	const hasViews = useViewStore((s) => s.views.length > 0);

	if (!hasViews)
		return (
			<ViewsContainer className="w-full max-w-sm">
				<EmptyViews />
			</ViewsContainer>
		);

	return (
		<>
			<ViewsContainer className="w-full">
				<ViewsToolbar>
					<DraggableViewsItems />
				</ViewsToolbar>

				<CurrentViewChart />
			</ViewsContainer>
		</>
	);
}

function ViewsContainer({
	children,
	className,
	...props
}: { children: React.ReactNode } & React.ComponentProps<"div">) {
	const deleteStoreKey = usePageStore((s) => s.deleteStoreKey);
	const selectedId = usePageStore((s) => s.selectedId);
	const storeKey = useSplitStore((s) => s.syncKey);
	const viewStoreKeys = useSplitStore((s) => s.viewStoreKeys);

	return (
		<div
			className={cn(
				"shadow-md group dark:shadow-background/50 shadow-neutral-100 relative bg-background min-h-full border rounded-lg",
				className,
			)}
			{...props}
		>
			<Button
				onClick={() => {
					if (!selectedId) return;
					viewStoreKeys.forEach(removeViewStore);
					deleteStoreKey(selectedId, storeKey);
				}}
				variant="outline"
				className="h-7 w-7 p-1 transition group-hover:opacity-100 bg-background opacity-0 rounded-full absolute z-10 -top-2 -right-2 "
			>
				<XIcon />
			</Button>
			<div className="flex flex-col divide-y">{children}</div>
		</div>
	);
}
