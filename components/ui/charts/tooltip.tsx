import { formatRelative, parseISO } from "date-fns";
import { TooltipProps } from "recharts";

export function CustomTooltip({
	active,
	payload,
	label,
	formatAsDate = true,
}: TooltipProps<string, string> & { formatAsDate?: boolean }) {
	const date =
		label && formatAsDate ? formatRelative(parseISO(label), new Date()) : label;

	if (active && payload && payload.length > 0) {
		const { value } = payload[0];

		return (
			<div className="whitespace-nowrap rounded-md border bg-background/60 px-4 py-2 shadow backdrop-blur-sm transition-[width] duration-100 ease-in-out">
				<div className="text-sm text-muted-foreground">{date}</div>
				<div>${(value as unknown as number).toFixed(2)}</div>
			</div>
		);
	}
	return null;
}
