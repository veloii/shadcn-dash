import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { ComponentPropsWithoutRef } from "react";
import { AddViewButton } from "./view/add-view";

export function ViewsToolbar({
	className,
	asChild,
	children,
	...props
}: { asChild?: boolean } & ComponentPropsWithoutRef<"div">) {
	const loading = false;
	const Comp = asChild ? Slot : "div";

	return (
		<div className={cn("flex p-3 relative gap-4 bg-muted/40")}>
			{/* <ScrollArea> */}
			<Comp className={cn("flex gap-4", className)} {...props}>
				{children}
			</Comp>

			{/* 	<ScrollBar orientation="horizontal" /> */}
			{/* </ScrollArea> */}

			<AddViewButton disabled={loading} />
		</div>
	);
}
