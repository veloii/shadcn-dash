/// <reference path="emoji-picker.d.ts" />

import React, { memo } from "react";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import Twemoji from "./twemoji";
import { cn } from "@/lib/utils";
import { PickerProps } from "@emoji-mart/react";
import Picker from "@emoji-mart/react";
import { PlusIcon } from "lucide-react";

const EmojiPicker = memo(({ set = "twitter", ...props }: PickerProps) => {
	const { resolvedTheme } = useTheme();
	return (
		<Picker
			{...props}
			theme={resolvedTheme === "dark" ? "dark" : "light"}
			emojiButtonRadius="8px"
			autoFocus={true}
			set={set}
		/>
	);
});

export const EmojiPickerSelection = ({
	emoji,
	className,
	onEmojiSelect: onEmojiClickProp,
	unstyled,
	...props
}: PickerProps & {
	emoji?: string;
	className?: string;
	unstyled?: boolean;
}) => {
	const [open, setOpen] = React.useState(false);

	const onEmojiClick = React.useCallback<
		NonNullable<PickerProps["onEmojiSelect"]>
	>(
		(emoji) => {
			onEmojiClickProp?.(emoji);
			setOpen(false);
		},
		[onEmojiClickProp],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					className={cn(
						!unstyled && "flex h-8 w-8 p-1.5 justify-center items-center",
						className,
					)}
					variant={unstyled ? "default" : "outline"}
				>
					{emoji ? (
						<Twemoji emoji={emoji} className="h-full w-full" />
					) : (
						<PlusIcon />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0 w-[352px] h-[435px] border overflow-hidden">
				<EmojiPicker onEmojiSelect={onEmojiClick} {...props} />
			</PopoverContent>
		</Popover>
	);
};

EmojiPicker.displayName = "EmojiPicker";

export { EmojiPicker };
