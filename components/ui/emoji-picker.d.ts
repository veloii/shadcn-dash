declare module "@emoji-mart/react" {
	export interface Emoji {
		id: string;
		name: string;
		native: string;
		unified: string;
		keywords: string[];
		shortcodes: string;
		skin: number;
	}

	export interface PickerProps {
		data?: object;
		i18n?: object;
		categories?: Array<
			| "frequent"
			| "people"
			| "nature"
			| "foods"
			| "activity"
			| "places"
			| "objects"
			| "symbols"
			| "flags"
		>;
		custom?: unknown[];
		onEmojiSelect?: (emoji: Emoji) => void;
		onClickOutside?: () => void;
		onAddCustomEmoji?: () => void;
		autoFocus?: boolean;
		categoryIcons?: object;
		dynamicWidth?: boolean;
		emojiButtonColors?: string[];
		emojiButtonRadius?: string;
		emojiButtonSize?: number;
		emojiSize?: number;
		emojiVersion?:
			| "1"
			| "2"
			| "3"
			| "4"
			| "5"
			| "11"
			| "12"
			| "12.1"
			| "13"
			| "13.1"
			| "14";
		exceptEmojis?: string[];
		icons?: "auto" | "outline" | "solid";
		locale?:
			| "en"
			| "ar"
			| "be"
			| "cs"
			| "de"
			| "es"
			| "fa"
			| "fi"
			| "fr"
			| "hi"
			| "it"
			| "ja"
			| "ko"
			| "nl"
			| "pl"
			| "pt"
			| "ru"
			| "sa"
			| "tr"
			| "uk"
			| "vi"
			| "zh";
		maxFrequentRows?: number;
		navPosition?: "top" | "bottom" | "none";
		noCountryFlags?: boolean;
		noResultsEmoji?: string;
		perLine?: number;
		previewEmoji?: string;
		previewPosition?: "top" | "bottom" | "none";
		searchPosition?: "sticky" | "static" | "none";
		set?: "native" | "apple" | "facebook" | "google" | "twitter";
		skin?: "1" | "2" | "3" | "4" | "5" | "6";
		skinTonePosition?: "preview" | "search" | "none";
		theme?: "auto" | "light" | "dark";
		getSpritesheetURL?: () => string;
	}

	export default function Picker(props: PickerProps): JSX.Element;
}
