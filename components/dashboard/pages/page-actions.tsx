import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import React from "react";
import { EditPage } from "./edit-page";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Page } from "@/stores/page";

export function PageActions({ page }: { page: Page }) {
	const [settingsOpen, setSettingsOpen] = React.useState(false);

	return (
		<>
			<Popover
				open={settingsOpen}
				onOpenChange={(v) => {
					setSettingsOpen(v);
					// setDisabled(v);
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

				<PopoverContent className="w-80" side="right">
					<EditPage page={page} onDelete={() => setSettingsOpen(false)} />
				</PopoverContent>
			</Popover>
		</>
	);
}
