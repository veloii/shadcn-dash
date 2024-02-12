import { cn, colorClass } from "@/lib/utils";
import {
	View,
	useViewStore,
	viewTypeIcons,
} from "@/components/dashboard/views/store";
import { ViewActions } from "./view-actions";
import React, { useEffect } from "react";
import { Draggable } from "../drag-n-drop";

function ViewItemSkeleton({
	className,
	...props
}: Omit<React.ComponentPropsWithoutRef<"div">, "children" | "type" | "id">) {
	return (
		<div
			className={cn(
				"relative flex h-9 min-w-56 cursor-default select-none gap-1 rounded-lg px-2 text-left transition animate-pulse",
				className,
			)}
			aria-selected={false}
			{...props}
		>
			<div className="flex grow items-center justify-between gap-1">
				<div className="flex items-center gap-1">
					<div className="h-5 w-5 rounded bg-foreground/10" />
					<div className="text-sm tracking-tight h-5 rounded bg-muted w-32" />
				</div>
			</div>
		</div>
	);
}

type ViewItemProps = {
	active?: boolean;
	static?: boolean;
	view: View;
} & Omit<React.ComponentPropsWithoutRef<"div">, "children" | "type" | "id">;

export function ViewItem({
	view,
	active = false,
	className,
	onDrag,
	static: isStatic,
	...props
}: ViewItemProps) {
	const Icon = viewTypeIcons[view.type];

	return (
		<div
			className={cn(
				"relative flex h-9 whitespace-nowrap min-w-56 cursor-default select-none gap-1 rounded-lg px-2 text-left transition",
				active
					? `bg-muted text-foreground ${colorClass[view.color]}`
					: "opacity-75 hover:bg-muted hover:opacity-100 active:scale-[.98] dark:hover:bg-muted",
				className,
			)}
			aria-selected={active}
			{...props}
		>
			<div className="flex grow items-center justify-between gap-1">
				<div className="flex items-center gap-1">
					<Icon className="h-4" />
					<div className="text-sm tracking-tight pr-6">{view.stat}</div>
				</div>
				{!isStatic && (
					<div
						className={cn(
							"flex items-center",
							active ? "opacity-100" : "pointer-events-none opacity-0",
						)}
					>
						<ViewActions view={view} />
					</div>
				)}
			</div>
		</div>
	);
}

ViewItem.Skeleton = ViewItemSkeleton;

export function DraggableViewsItems() {
	const loading = false;
	const select = useViewStore((s) => s.select);
	const views = useViewStore((s) => s.views);
	const selectedId = useViewStore((s) => s.selectedId);

	return loading
		? Array.from({ length: 6 }).map((_, i) => (
				// biome-ignore lint: this is a skeleton
				<ViewItem.Skeleton key={i} />
		  ))
		: views.map((view) => (
				<Draggable key={view.id} view={view}>
					<ViewItem
						active={selectedId === view.id}
						onClick={() => select(view.id)}
						view={view}
					/>
				</Draggable>
		  ));
}
