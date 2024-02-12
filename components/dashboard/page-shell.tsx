import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { EmojiPickerSelection } from "../ui/emoji-picker";
import { Page } from "@/stores/page";
import { useRootStore } from "@/stores/root";

export function PageShell({
	children,
	className,
	page,
	...props
}: {
	children: React.ReactNode;
	page: Page;
} & React.ComponentPropsWithoutRef<"div">) {
	const edit = useRootStore((s) => s.editPage);

	return (
		<div className="space-y-4">
			<div className="px-12 pb-36 pt-20 dark:bg-neutral-900 bg-neutral-50 -mb-32 border-b">
				<div className="max-w-7xl mx-auto space-y-7">
					{page.emoji && (
						<EmojiPickerSelection
							className="shadow-none dark:bg-neutral-800 hover:dark:bg-neutral-700 dark:border-0 border bg-background hover:bg-muted rounded p-2 size-12"
							emoji={page.emoji}
							onEmojiSelect={({ native: emoji }) => edit(page.id, { emoji })}
						/>
					)}
					<div className="space-y-4">
						<Input
							className="border-none shadow-none p-0 font-bold text-4xl focus-visible:ring-0 h-12 rounded-none"
							value={page.name}
							onChange={(e) => edit(page.id, { name: e.target.value })}
						/>
						<Input
							className="border-none shadow-none p-0 focus-visible:ring-0 text-base h-auto rounded-none"
							placeholder="Click to add text."
							type="text"
						/>
					</div>
				</div>
			</div>
			<div className={"px-12"}>
				<div className={cn("max-w-7xl mx-auto", className)} {...props}>
					{children}
				</div>
			</div>
		</div>
	);
}
