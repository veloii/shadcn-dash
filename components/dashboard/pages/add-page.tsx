import { Button, ButtonProps } from "@/components/ui/button";
import { useCallback, useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn, randomId } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { EditPageFields, EditPageFormErrors } from "./edit-page";
import { useRootStore } from "@/stores/root";
import { Page } from "@/stores/page";

export function AddPageButton({
	className,
	children,
	unstyled = false,
	...props
}: ButtonProps & { unstyled?: boolean }) {
	const add = useRootStore((s) => s.addPage);
	const select = useRootStore((s) => s.setCurrentPage);
	const [page, setPage] = useState<Partial<Page>>({});
	const [errors, setErrors] = useState<EditPageFormErrors>({});
	const [open, setOpen] = useState(false);

	const resetError = (key: string) => {
		setErrors((e) => ({ ...e, [key]: undefined }));
	};

	const onNew = useCallback<React.FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault();

			const errors: EditPageFormErrors = {};

			if (!page.name) errors.name = "Name is required";
			if (Object.keys(errors).length) {
				setErrors(errors);
				return;
			}

			const populatedPage = page as Page;
			populatedPage.id = randomId();
			populatedPage.splits = [];

			add(populatedPage);
			select(populatedPage.id);
			setPage({});
			setOpen(false);
		},
		[select, add, page],
	);

	const onChange = (e: Partial<Page>) => {
		setPage((p) => ({ ...p, ...e }));
	};

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
			<PopoverContent className="w-80" side="right">
				<div className="space-y-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">New Page</h4>
						<p className="text-sm text-muted-foreground">Create a new page.</p>
					</div>
					<form onSubmit={onNew} className="space-y-4">
						<EditPageFields
							resetError={resetError}
							onChange={onChange}
							errors={errors}
							page={page}
						/>
						<Button size="sm" type="submit">
							Create
						</Button>
					</form>
				</div>
			</PopoverContent>
		</Popover>
	);
}
