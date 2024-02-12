import { cn } from "@/lib/utils";
import React, { memo } from "react";
import { ViewGroupToolbar } from "./view-group-toolbar";
import { DraggableViewsItems } from "./view-item";
import { ViewGroupEmpty } from "./view-group-empty";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewGroupProvider, useViewGroup } from "@/stores/view-group";
import { CurrentViewChart } from "./view-chart";

export const ViewGroup = memo(function ViewGroup({ id }: { id: number }) {
	return (
		<ViewGroupProvider id={id}>
			<ViewGroupContent />
		</ViewGroupProvider>
	);
});

function ViewGroupContent() {
	const hasViews = useViewGroup((s) => s.views.length > 0);

	if (!hasViews)
		return (
			<ViewGroupContainer className="w-full max-w-sm">
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
	const deleteViewGroup = useViewGroup((s) => s.deleteViewGroup);

	return (
		<div
			className={cn(
				"shadow-md group dark:shadow-background/50 shadow-neutral-100 relative bg-background min-h-full border rounded-lg",
				className,
			)}
			{...props}
		>
			<Button
				onClick={deleteViewGroup}
				variant="outline"
				className="h-7 w-7 p-1 transition group-hover:opacity-100 bg-background opacity-0 rounded-full absolute z-10 -top-2 -right-2 "
			>
				<XIcon />
			</Button>
			<div className="flex flex-col divide-y">{children}</div>
		</div>
	);
}
