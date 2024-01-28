import { OptionsPopover } from "./options-popover";

export function Header() {
	return (
		<div className="border-b p-4">
			<div className="mx-auto flex max-w-7xl items-center justify-between">
				<h3>Overview</h3>
				<div className="flex gap-2">
					<OptionsPopover />
				</div>
			</div>
		</div>
	);
}
