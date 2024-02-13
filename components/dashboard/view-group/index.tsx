import { cn } from "@/lib/utils";
import React, { memo } from "react";
import { ViewGroupToolbar } from "./view-group-toolbar";
import { DraggableViewsItems } from "./view-item";
import { ViewGroupEmpty } from "./view-group-empty";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewGroupProvider, useViewGroup } from "@/stores/view-group";
import { CurrentViewChart } from "./view-chart";
import { ViewGroupContainer as DndContainer } from "./view-group-dnd";
import { useSplit } from "@/stores/split";

export const ViewGroup = memo(function ViewGroup({ id }: { id: number }) {
	return (
		<ViewGroupProvider id={id}>
			<DndContainer>
				<ViewGroupContent />
			</DndContainer>
		</ViewGroupProvider>
	);
});

function ViewGroupContent() {
	const hasViews = useViewGroup((s) => s.views.length > 0);

	if (!hasViews)
		return (
			<ViewGroupContainer className="w-full">
				<ViewGroupEmpty />
			</ViewGroupContainer>
		);

	return (
		<>
			<ViewGroupContainer className="w-full">
				<ViewGroupToolbar>
					<DraggableViewsItems />
				</ViewGroupToolbar>

				<CurrentViewChart />
			</ViewGroupContainer>
		</>
	);
}

function ViewGroupContainer({
	children,
	className,
	...props
}: { children: React.ReactNode } & React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"group dark:shadow-background/50 shadow-neutral-100 bg-background min-h-full rounded-lg",
				className,
			)}
			{...props}
		>
			<div className="flex flex-col divide-y">{children}</div>
		</div>
	);
}
