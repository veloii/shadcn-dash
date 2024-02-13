import { TrashIcon } from "lucide-react";
import React, { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { ColorPickerSelect } from "@/components/ui/color-picker";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Color, cn, colorClass } from "@/lib/utils";
import {
	View,
	isViewTypeDisabled,
	viewDisplayIcons,
	viewDisplays,
	viewTypeIcons,
	viewTypes,
} from "@/stores/view";
import { useViewGroup } from "@/stores/view-group";

function EditViewForm({
	onChange,
	view,
}: {
	view?: Partial<View>;
	onChange: (profile: Partial<View>) => void;
}) {
	const onColorChange = useCallback(
		(color: Color) => {
			onChange({ color });
		},
		[onChange],
	);

	return (
		<div className="grid gap-2">
			<div className="grid grid-cols-3 items-center gap-4">
				<Label>Color</Label>
				<Select onValueChange={onColorChange} defaultValue={view?.color}>
					<SelectTrigger className="col-span-2 h-8">
						<SelectValue placeholder="Select a color" />
					</SelectTrigger>
					<ColorPickerSelect />
				</Select>
			</div>
			<div className="grid grid-cols-3 items-center gap-4">
				<Label>Display by</Label>
				<div className="grid-cols-2 grid col-span-2 gap-1">
					{viewDisplays.map((display) => {
						const active = display === view?.display;
						// const Icon = viewDisplayIcons[display];

						return (
							<Button
								size="sm"
								className={cn(
									"h-8 transition",
									active &&
										`bg-muted hover:bg-[] ${
											view?.color && colorClass[view.color]
										} shadow-none border-transparent`,
								)}
								variant={"outline"}
								key={display}
								onClick={() => onChange({ display })}
							>
								{display.charAt(0).toUpperCase() + display.slice(1)}
							</Button>
						);
					})}
				</div>
			</div>
			<div className="grid grid-cols-3 items-center gap-4">
				<Label>Graph</Label>
				<div className="grid-cols-4 grid col-span-2 gap-1">
					{viewTypes.map((type) => {
						const Icon = viewTypeIcons[type];
						const active = type === view?.type;

						return (
							<Button
								size="sm"
								disabled={isViewTypeDisabled({ type, display: view?.display })}
								className={cn(
									"h-8 transition",
									active &&
										`bg-muted hover:bg-[] ${
											view?.color && colorClass[view.color]
										} shadow-none border-transparent`,
								)}
								variant={"outline"}
								key={type}
								onClick={() => onChange({ type })}
							>
								<Icon className="h-4" />
							</Button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export function EditView({ view }: { view: View }) {
	const deleteView = useViewGroup((s) => s.deleteView);
	const edit = useViewGroup((s) => s.editView);

	const onChange = React.useCallback(
		(p: Partial<View>) => {
			edit(view.id, p);
		},
		[view.id, edit],
	);

	const onRemove = React.useCallback(() => {
		deleteView(view.id);
	}, [view.id, deleteView]);

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<h4 className="font-medium leading-none">View</h4>
				<p className="text-sm text-muted-foreground">
					Customize your view settings.
				</p>
			</div>
			<EditViewForm view={view} onChange={onChange} />
			<Button
				variant="destructive"
				size="sm"
				className="pr-5"
				onClick={onRemove}
			>
				<TrashIcon className="h-4 mr-1" />
				Remove
			</Button>
		</div>
	);
}
