import * as React from "react";
import { Check, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filters } from "@/components/dashboard/views/store";

export function FiltersToggle({
	availableFilters,
	removeFilter,
	addFilter,
	filters,
}: {
	availableFilters: Filters;
	removeFilter: (name: string, value: string) => void;
	addFilter: (name: string, value: string) => void;
	filters: Filters;
}) {
	// biome-ignore lint: react-hooks/exhaustive-deps
	const toggleFilter = React.useCallback(
		(name: string, value: string) => {
			if (filters[name]?.includes(value)) {
				removeFilter(name, value);
				return;
			}
			addFilter(name, value);
		},
		[filters, removeFilter, addFilter],
	);

	return (
		<Command>
			<CommandInput placeholder="Search filters..." />
			<CommandEmpty>No filter found.</CommandEmpty>
			<ScrollArea className="h-96">
				{Object.entries(availableFilters).map(([name, values], index) => (
					<>
						{index > 0 && <CommandSeparator />}
						<CommandGroup key={name} className="p-3">
							<div className="mb-1.5 text-sm text-muted-foreground">
								{name[0].toUpperCase()}
								{name.slice(1)}
							</div>
							{values?.map((value) => (
								<CommandItem
									key={name + value}
									value={value}
									onSelect={() => {
										toggleFilter?.(name, value);
									}}
								>
									<Check
										className={cn(
											"absolute right-2 size-4",
											filters[name]?.includes(value) ? "" : "hidden",
										)}
									/>
									{value}
								</CommandItem>
							))}
						</CommandGroup>
					</>
				))}
			</ScrollArea>
		</Command>
	);
}

export function FilterList({
	filters,
	removeFilter,
}: {
	filters: Filters;
	removeFilter: (name: string, value: string) => void;
}) {
	return Object.entries(filters).map(([name, value]) =>
		value?.map((v) => (
			<Badge
				key={name + v}
				className="h-6 cursor-pointer px-2"
				onClick={() => removeFilter(name, v)}
			>
				{v.charAt(0).toUpperCase()}
				{v.slice(1)}
				<XIcon className="h-4" />
			</Badge>
		)),
	);
}
