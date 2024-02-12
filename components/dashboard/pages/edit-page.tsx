import { XIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EmojiPickerSelection } from "@/components/ui/emoji-picker";
import { Page } from "@/stores/page";
import { useRootStore } from "@/stores/root";

export type EditPageFormErrors = {
	name?: string;
	emoji?: string;
};

export function EditPageFields({
	onChange,
	page,
	errors,
	resetError,
}: {
	page?: Partial<Page>;
	onChange: (profile: Partial<Page>) => void;
	errors?: EditPageFormErrors;
	resetError?: (key: string) => void;
}) {
	return (
		<div className="grid gap-2">
			<div className="grid grid-cols-3 items-center gap-4">
				<Label>Name</Label>
				<Input
					type="text"
					defaultValue={page?.name}
					error={errors?.name}
					placeholder="Enter a name"
					onChange={(e) => {
						onChange({ name: e.target.value });
						resetError?.("name");
					}}
					required
					className="col-span-2 h-8"
					ignorePasswordManager
				/>
			</div>
			<div className="grid grid-cols-3 items-center gap-4">
				<Label>Emoji</Label>
				<EmojiPickerSelection
					emoji={page?.emoji}
					onEmojiSelect={({ native: emoji }) => onChange({ emoji })}
				/>
			</div>
		</div>
	);
}

export function EditPage({
	page,
	onDelete,
}: { onDelete?: () => void; page: Page }) {
	const deletePage = useRootStore((s) => s.deletePage);
	const edit = useRootStore((s) => s.editPage);

	const onChange = React.useCallback(
		(p: Partial<Page>) => {
			edit(page.id, p);
		},
		[page.id, edit],
	);

	const onRemove = React.useCallback(() => {
		onDelete?.();
		deletePage(page.id);
	}, [page.id, deletePage, onDelete]);

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<h4 className="font-medium leading-none">Page</h4>
				<p className="text-sm text-muted-foreground">
					Customize your page settings.
				</p>
			</div>
			<EditPageFields page={page} onChange={onChange} />
			<Button
				variant="destructive"
				size="sm"
				className="pr-5"
				onClick={onRemove}
			>
				<XIcon className="h-4 mr-1" />
				Delete
			</Button>
		</div>
	);
}
