import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilterIcon, SettingsIcon } from "lucide-react";
import React from "react";
import { EditView } from "./view-editor";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { FilterList, FiltersToggle } from "@/components/ui/filters-list";
import { useDndControl } from "./view-group-dnd";
import { View } from "@/stores/view";
import { wrap } from "@/stores/root";
import { useViewGroup } from "@/stores/view-group";

const demoAvailableFilters = {
	author: ["@pomber", "@jamesplease"],
	is: ["open", "closed"],
	label: ["bug", "enhancement"],
	sort: ["created", "updated"],
	user: ["pomber", "jamesplease"],
};

export function ViewActions({ view }: { view: View }) {
	const [addFilterOpen, setAddFilterOpen] = React.useState(false);
	const [settingsOpen, setSettingsOpen] = React.useState(false);
	const { setDisabled } = useDndControl();

	const hasFilters = Object.keys(view.filters).length > 0;

	const withId = wrap(view.id);

	const addFilter = withId(useViewGroup((s) => s.addViewFilter));
	const removeFilter = withId(useViewGroup((s) => s.deleteViewFilter));

	return (
		<>
			<Popover
				open={addFilterOpen}
				onOpenChange={(v) => {
					setAddFilterOpen(v);
					setDisabled(v);
				}}
			>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="relative size-7 hover:bg-foreground/10"
					>
						{hasFilters && (
							<div
								className={cn(
									"absolute right-0.5 top-0.5 z-10 size-1.5 rounded-full bg-foreground",
								)}
							/>
						)}
						<FilterIcon className="h-4 opacity-75" />
					</Button>
				</PopoverTrigger>

				<PopoverContent className="relative overflow-hidden p-0">
					{hasFilters && (
						<div className="absolute bottom-0 left-0 z-10 flex w-full flex-wrap gap-2 bg-gradient-to-t from-background from-[60%] to-transparent p-3 pt-10">
							<FilterList filters={view.filters} removeFilter={removeFilter} />
						</div>
					)}

					<FiltersToggle
						availableFilters={demoAvailableFilters}
						filters={view.filters}
						addFilter={addFilter}
						removeFilter={removeFilter}
					/>
				</PopoverContent>
			</Popover>

			<Popover
				open={settingsOpen}
				onOpenChange={(v) => {
					setSettingsOpen(v);
					setDisabled(v);
				}}
			>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="relative size-7 hover:bg-foreground/10"
					>
						<SettingsIcon className="h-4 opacity-75" />
					</Button>
				</PopoverTrigger>

				<PopoverContent className="w-80">
					<EditView view={view} />
				</PopoverContent>
			</Popover>
		</>
	);
}
