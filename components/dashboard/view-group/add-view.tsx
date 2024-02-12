import { Button, ButtonProps } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { useViewGroup } from "@/stores/view-group";

export function AddView({
	onSelect,
	stats,
	scroll,
}: {
	onSelect: (stat: string) => void;
	stats: Record<string, string[]>;
	scroll?: boolean;
}) {
	const Scroll = scroll ? ScrollArea : "div";

	return (
		<Command>
			<CommandInput placeholder="Search events to track..." />
			<Scroll className={scroll ? "h-64" : ""}>
				<CommandEmpty>No stats found.</CommandEmpty>
				{Object.entries(stats).map(([group, stats]) => (
					<CommandGroup className="p-3">
						<div className="mb-1.5 text-sm text-muted-foreground">
							{group[0].toUpperCase()}
							{group.slice(1)}
						</div>
						{stats.map((stat) => (
							<CommandItem
								key={stat}
								value={stat}
								onSelect={() => onSelect(stat)}
							>
								{stat}
							</CommandItem>
						))}
					</CommandGroup>
				))}
			</Scroll>
		</Command>
	);
}

export const demoStats = {
	users: ["Visitors", "Page Views"],
	events: ["Purchases", "Signups", "Logins", "Comments", "Likes"],
};

export function AddViewButton({
	className,
	children,
	unstyled = false,
	...props
}: ButtonProps & { unstyled?: boolean }) {
	const add = useViewGroup((s) => s.createViewFromStat);
	const select = useViewGroup((s) => s.selectView);

	const [open, setOpen] = useState(false);

	const onNew = useCallback(
		(stat: string) => {
			const { id } = add(stat);
			select(id);
			setOpen(false);
		},
		[select, add],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					className={cn(
						!unstyled && "size-9 p-2.5 transition active:scale-95",
						className,
					)}
					variant={unstyled ? "default" : "ghost"}
					{...props}
				>
					{!unstyled && <PlusIcon className="h-full" />}
					{children}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0">
				<AddView onSelect={onNew} stats={demoStats} scroll />
			</PopoverContent>
		</Popover>
	);
}
