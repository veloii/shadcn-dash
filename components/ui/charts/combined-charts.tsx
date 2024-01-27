import { useProfiles } from "@/contexts/profile"

import { AreaChart } from "./area-chart"
import { BarChart } from "./bar-chart"

const charts = {
  area: AreaChart,
  line: AreaChart,
  bar: BarChart,
} as const

export default function CombinedCharts() {
  const { currentProfile } = useProfiles()
  if (!currentProfile) return null

  const Comp = charts[currentProfile.chartType]

  return <Comp />
}
