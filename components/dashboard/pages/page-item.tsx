import { cn } from "@/lib/utils";
import React from "react";
import { PageActions } from "./page-actions";
import Twemoji from "@/components/ui/twemoji";
import { Page } from "@/stores/page";
import { useRootStore } from "@/stores/root";

function PageItemSkeleton({
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

type PageItemProps = {
	active?: boolean;
	static?: boolean;
	page: Page;
} & Omit<React.ComponentPropsWithoutRef<"button">, "children" | "type" | "id">;

export function PageItem({
	page,
	active = false,
	className,
	onDrag,
	static: isStatic,
	...props
}: PageItemProps) {
	return (
		<div
			className={cn(
				"rounded-md text-left w-full cursor-default flex gap-2 items-center text-sm transition ",
				active
					? "bg-neutral-100 dark:bg-neutral-700/70"
					: "hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 opacity-75 active:scale-[.98]",
				className,
			)}
			aria-selected={active}
		>
			<div className="flex grow items-center justify-between">
				<button
					type="button"
					className={cn(
						"flex items-center grow p-1 min-h-9 gap-2 cursor-default",
						!page.emoji && "pl-3",
					)}
					{...props}
				>
					{page.emoji && (
						<div
							className={cn(
								"w-7 h-7 grid place-items-center rounded-md text-center",
								active
									? "bg-white border dark:border-none dark:bg-neutral-700"
									: "",
							)}
						>
							<Twemoji emoji={page.emoji} className="w-4 h-4" />
						</div>
					)}
					{page.name}
				</button>
				{!isStatic && active && (
					<div
						className={
							"flex items-center h-full pr-1 fade-in animate-in transition"
						}
					>
						<PageActions page={page} />
					</div>
				)}
			</div>
		</div>
	);
}

PageItem.Skeleton = PageItemSkeleton;

export function PageItems() {
	const loading = false;
	const pages = useRootStore((s) => s.pages);
	const selectedId = useRootStore((s) => s.selectedId);
	const select = useRootStore((s) => s.setCurrentPage);

	return loading
		? Array.from({ length: 6 }).map((_, i) => (
				// biome-ignore lint: this is a skeleton
				<PageItem.Skeleton key={i} />
		  ))
		: pages.map((page) => (
				<PageItem
					active={selectedId === page.id}
					onClick={() => {
						select(page.id);
					}}
					key={page.id}
					page={page}
				/>
		  ));
}
