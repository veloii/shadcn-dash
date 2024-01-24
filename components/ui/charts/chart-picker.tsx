import { BarChart2Icon, LineChartIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useChartType } from "@/hooks/use-chart-type"

import { Button } from "../button"

export default function ChartPicker() {
  const [chart, setChart] = useChartType()

  return (
    <div className="relative overflow-hidden rounded-md w-64">
      <div
        style={{
          transform: `translateX(${chart === "line" ? "0" : "100%"})`,
        }}
        className="absolute bg-muted w-1/2 h-full transition-transform duration-500 [transition-timing-function:ease] -z-10 border border-zinc-700 rounded-md"
      ></div>

      <Button
        variant="outline"
        onClick={() => setChart("line")}
        className={cn(
          "rounded-r-none border-0 hover:bg-muted/30 bg-transparent w-1/2",
          chart !== "line" && "text-muted-foreground"
        )}
      >
        <LineChartIcon className="h-5 mr-2" />
        Line Chart
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "rounded-l-none hover:bg-muted/30 bg-transparent w-1/2 border-0",
          chart !== "bar" && "text-muted-foreground"
        )}
        onClick={() => setChart("bar")}
      >
        <BarChart2Icon className="h-5 mr-2" />
        Bar Chart
      </Button>
    </div>
  )
}
