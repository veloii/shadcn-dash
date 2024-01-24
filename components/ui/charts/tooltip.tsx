import { formatRelative, parseISO } from "date-fns"
import { TooltipProps } from "recharts"

export function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<string, string>) {
  const date = label ? formatRelative(parseISO(label), new Date()) : ""

  if (active && payload) {
    const { value } = payload?.[0]

    return (
      <div className="bg-background/60 shadow backdrop-blur-sm px-4 py-2 transition-[width] duration-100 ease-in-out rounded-md border whitespace-nowrap">
        <div className="text-sm text-muted-foreground">{date}</div>
        <div>${(value as unknown as number).toFixed(2)}</div>
      </div>
    )
  }
  return null
}

