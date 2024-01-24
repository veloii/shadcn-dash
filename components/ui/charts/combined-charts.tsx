import { useCurrentProfile } from "@/contexts/profile"

import { AreaChart } from "./area-chart"
import { BarChart } from "./bar-chart"

const charts = {
  area: AreaChart,
  line: AreaChart,
  bar: BarChart,
} as const

export default function CombinedCharts() {
  const { chartType } = useCurrentProfile()
  const Comp = charts[chartType]

  return <Comp />
}
