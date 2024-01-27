import { View, useCurrentView } from '@/stores/view'
import { AreaChart } from "../../ui/charts/area-chart"
import { BarChart } from "../../ui/charts/bar-chart"
import { subDays } from 'date-fns'

const charts = {
  area: AreaChart,
  line: AreaChart,
  bar: BarChart,
} as const

function ViewChart({ view }: { view: View }) {
  const Comp = charts[view.type]

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

  return <Comp data={data} x="date" y="value" color={view.color} />
}

export function CurrentViewChart() {
  const view = useCurrentView();

  // some empty state
  if (!view) return null;

  return <ViewChart view={view} />
}
