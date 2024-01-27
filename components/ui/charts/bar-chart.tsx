import { useProfiles } from "@/contexts/profile"
import { format, parseISO, subDays } from "date-fns"
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn, Color } from "@/lib/utils"

import { CustomTooltip } from "./tooltip"

const colorClass: Record<Color, string> = {
  primary: "fill-primary/75",
  red: "fill-red-400/75",
  orange: "fill-orange-400/75",
  amber: "fill-amber-400/75",
  yellow: "fill-yellow-400/75",
  lime: "fill-lime-400/75",
  green: "fill-green-400/75",
  emerald: "fill-emerald-400/75",
  teal: "fill-teal-400/75",
  cyan: "fill-cyan-400/75",
  sky: "fill-sky-400/75",
  blue: "fill-blue-400/75",
  indigo: "fill-indigo-400/75",
  violet: "fill-violet-400/75",
  purple: "fill-purple-400/75",
  fuchsia: "fill-fuchsia-400/75",
  pink: "fill-pink-400/75",
  rose: "fill-rose-400/75",
}

export function BarChart() {
  const { currentProfile } = useProfiles()

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
  if (!currentProfile) return null

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

        <Tooltip
          content={CustomTooltip}
          position={{ y: 100 }}
          isAnimationActive={false}
          cursor={{
            fill: "hsl(var(--muted))",
            style: { opacity: 1 },
            radius: 4,
          }}
        />

        <Bar
          dataKey="value"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className={cn("z-50 transition", colorClass[currentProfile.color])}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
