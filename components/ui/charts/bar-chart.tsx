import { useCurrentProfile } from "@/contexts/profile"
import { format, parseISO, subDays } from "date-fns"
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Color, cn } from "@/lib/utils"

import { CustomTooltip } from "./tooltip"

const data: {
  date: string
  value: number
}[] = []
for (let num = 30; num >= 0; num--) {
  data.push({
    date: subDays(new Date(), num).toISOString().substr(0, 10),
    value: 1 + Math.random(),
  })
}

const colorClass: Record<Color, string> = {
  red: "fill-red-500",
  orange: "fill-orange-500",
  amber: "fill-amber-500",
  yellow: "fill-yellow-500",
  lime: "fill-lime-500",
  green: "fill-green-500",
  emerald: "fill-emerald-500",
  teal: "fill-teal-500",
  cyan: "fill-cyan-500",
  sky: "fill-sky-500",
  blue: "fill-blue-600",
  indigo: "fill-indigo-500",
  violet: "fill-violet-500",
  purple: "fill-purple-500",
  fuchsia: "fill-fuchsia-500",
  pink: "fill-pink-500",
  rose: "fill-rose-500",
}

export function BarChart() {
  const profile = useCurrentProfile()

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsBarChart data={data}>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          padding={{ left: 20, right: 20 }}
          tickFormatter={(str, i) => {
            const date = parseISO(str)
            if (i % 2 === 0) return format(date, "MMM d")
            return ""
          }}
          tickMargin={10}
          className="text-xs"
        />

        <YAxis
          dataKey="value"
          axisLine={false}
          tickLine={false}
          tickCount={7}
          tickMargin={10}
          className="text-xs"
          tickFormatter={(number) => `$${number.toFixed(2)}`}
        />

        <Bar
          dataKey="value"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className={cn("z-50", colorClass[profile.color])}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
