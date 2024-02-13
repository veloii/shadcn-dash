import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { ComponentPropsWithoutRef } from "react";
import { AddViewButton } from "./add-view";

export function ViewGroupToolbar({
	className,
	asChild,
	children,
	...props
}: { asChild?: boolean } & ComponentPropsWithoutRef<"div">) {
	const loading = false;
	const Comp = asChild ? Slot : "div";

	return (
		<Comp
			className={cn("flex gap-4 p-2.5 bg-muted/40 flex-wrap", className)}
			{...props}
		>
			{children}

			<AddViewButton disabled={loading} />
		</Comp>
	);
}
