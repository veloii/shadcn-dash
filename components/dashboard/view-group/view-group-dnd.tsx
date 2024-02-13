import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	rectIntersection,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { ViewItem } from "./view-item";
import React from "react";
import { Color, cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import {
	SortableContext,
	rectSwappingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { ViewGroup, useViewGroup } from "@/stores/view-group";
import { View } from "@/stores/view";
import { useSplit } from "@/stores/split";
import { useCurrentPage } from "@/stores/page";
import { useRootStore } from "@/stores/root";

const DndControlContext = React.createContext({
	disabled: false,
	setDisabled: (_: boolean) => {},
});

const withDndControl = <C,>(Component: React.FC<C>) => {
	return (props: C) => {
		const [disabled, setDisabled] = React.useState(false);
		return (
			<DndControlContext.Provider value={{ disabled, setDisabled }}>
				{/* @ts-expect-error */}
				<Component {...props} />
			</DndControlContext.Provider>
		);
	};
};

export const useDndControl = () => React.useContext(DndControlContext);

const itemColors: Record<Color, string> = {
	red: "before:bg-red-500",
	orange: "before:bg-orange-500",
	amber: "before:bg-amber-500",
	yellow: "before:bg-yellow-500",
	lime: "before:bg-lime-500",
	green: "before:bg-green-500",
	emerald: "before:bg-emerald-500",
	teal: "before:bg-teal-500",
	cyan: "before:bg-cyan-500",
	sky: "before:bg-sky-500",
	blue: "before:bg-blue-500",
	indigo: "before:bg-indigo-500",
	violet: "before:bg-violet-500",
	purple: "before:bg-purple-500",
	fuchsia: "before:bg-fuchsia-500",
	pink: "before:bg-pink-500",
	rose: "before:bg-rose-500",
	primary: "before:bg-primary",
};

export const ViewItemContainer = withDndControl(function Draggable({
	view,
	children,
}: { view: View; children: React.ReactNode }) {
	const splitId = useSplit((s) => s.split?.id);
	const viewGroupId = useViewGroup((s) => s.id);
	const { disabled } = useDndControl();
	const selectedViewId = useViewGroup((s) => s.selectedViewId);

	const { isOver, active, attributes, listeners, transform, setNodeRef } =
		useSortable({
			id: view.id,
			disabled,
			data: {
				splitId,
				viewGroupId,
				view,
				isSelected: view.id === selectedViewId,
				type: "view",
			} satisfies Data,
		});

	const sameId = active?.data.current?.view.id === view.id;
	const x = transform?.x ?? 0;

	const color = active?.data.current?.view.color;

	return (
		<div
			className={cn(
				"relative",
				isOver &&
					!sameId &&
					active && [
						"before:h-full before:rounded-full before:absolute before:bg-primary before:top-0 before:w-1 before:[content:'']",
						itemColors[color as Color],
					],
				x < 0 ? "before:right-0" : "before:left-0",
				sameId && "opacity-50",
			)}
			ref={setNodeRef}
			{...listeners}
			{...attributes}
		>
			{children}
		</div>
	);
});

const dndColors: Record<Color, string> = {
	red: "bg-red-500/20 border-red-500",
	orange: "bg-orange-500/20 border-orange-500",
	amber: "bg-amber-500/20 border-amber-500",
	yellow: "bg-yellow-500/20 border-yellow-500",
	lime: "bg-lime-500/20 border-lime-500",
	green: "bg-green-500/20 border-green-500",
	emerald: "bg-emerald-500/20 border-emerald-500",
	teal: "bg-teal-500/20 border-teal-500",
	cyan: "bg-cyan-500/20 border-cyan-500",
	sky: "bg-sky-500/20 border-sky-500",
	blue: "bg-blue-500/20 border-blue-500",
	indigo: "bg-indigo-500/20 border-indigo-500",
	violet: "bg-violet-500/20 border-violet-500",
	purple: "bg-purple-500/20 border-purple-500",
	fuchsia: "bg-fuchsia-500/20 border-fuchsia-500",
	pink: "bg-pink-500/20 border-pink-500",
	rose: "bg-rose-500/20 border-rose-500",
	primary: "bg-primary/20 border-primary",
};

export function ViewGroupContainer({
	asChild,
	children,
	className,
	...props
}: { asChild?: boolean } & React.ComponentPropsWithoutRef<"div">) {
	const { selectedViewId, views, id } = useViewGroup();
	const splitId = useSplit((s) => s.split?.id);

	const { active, isOver, setNodeRef } = useDroppable({
		id,
		data: {
			viewGroup: { views, id, selectedViewId },
			splitId,
			viewGroupId: id,
			type: "view-group",
		} satisfies Data,
	});

	const color = active?.data.current?.view.color;

	const Comp = asChild ? Slot : "div";

	return (
		<div className="h-full flex w-full">
			<SortableContext items={views} strategy={rectSwappingStrategy}>
				<Comp
					className={cn(
						isOver && color && dndColors[color as Color],
						!isOver && "border-transparent",
						"rounded-lg border-dashed border-2 min-h-full transition-[border-color,background] h-full flex w-full",
						className,
					)}
					{...props}
					ref={setNodeRef}
				>
					{children}
				</Comp>
			</SortableContext>
		</div>
	);
}

type Data =
	| {
			type: "view-group";
			splitId: number | undefined;
			viewGroupId: number;
			viewGroup: ViewGroup;
	  }
	| {
			type: "view";
			splitId: number | undefined;
			viewGroupId: number;
			view: View;
			isSelected: boolean;
	  };

export function PageContainer({ children }: { children: React.ReactNode }) {
	const [activeView, setActiveView] = useState<View | null>(null);
	const [isSelected, setIsSelected] = useState(false);
	const page = useCurrentPage();
	const isSidebarOpen = useRootStore((s) => s.sidebarOpen);

	const handleDragStart = React.useCallback((event: DragStartEvent) => {
		const data = event.active.data.current as Data;
		if (!data) return;

		if (data.type !== "view") return;

		setActiveView(data.view);
		setIsSelected(data.isSelected);
	}, []);

	const handleDragEnd = React.useCallback((event: DragEndEvent) => {
		const from = event.active.data.current as Data;
		const to = event.over?.data.current as Data;

		if (!from || !to) return;
		if (from.splitId === undefined || to.splitId === undefined) return;
		if (from.type !== "view") return;

		let newIndex: undefined | number = undefined;

		if (to.type === "view") {
			const viewGroup = page.getViewGroup(to.splitId, to.viewGroupId);
			if (!viewGroup) return;
			newIndex = viewGroup.views.findIndex((v) => v.id === to.view.id);
		}

		if (from.viewGroupId !== to.viewGroupId) {
			page.deleteView(from.splitId, from.viewGroupId, from.view.id);
			page.addView(to.splitId, to.viewGroupId, from.view, newIndex);
			page.selectView(to.splitId, to.viewGroupId, from.view.id);
		}

		if (from.viewGroupId === to.viewGroupId && newIndex !== undefined) {
			page.moveView(from.splitId, from.viewGroupId, from.view.id, newIndex);
		}

		// TODO: select nearest view after drag
	}, []);

	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: { distance: 10 },
	});

	const touchSensor = useSensor(TouchSensor, {
		activationConstraint: { distance: 10 },
	});
	const keyboardSensor = useSensor(KeyboardSensor);

	const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

	return (
		<DndContext
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			sensors={sensors}
			collisionDetection={rectIntersection}
		>
			{children}

			<DragOverlay
				dropAnimation={{
					duration: 250,
				}}
			>
				<div className={cn(isSidebarOpen ? "-translate-x-72" : "z-0")}>
					{activeView && (
						<ViewItem view={activeView} static active={isSelected} />
					)}
				</div>
			</DragOverlay>
		</DndContext>
	);
}
