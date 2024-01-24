import { BarChart2Icon, LineChartIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useChartType } from "@/hooks/use-chart-type"

import { Button } from "../button"

export default function ChartPicker() {
  const [chart, setChart] = useChartType()

  return (
    <div className="relative w-64 overflow-hidden rounded-md">
      <div
        style={{
          transform: `translateX(${chart === "line" ? "0" : "100%"})`,
        }}
        className="absolute -z-10 h-full w-1/2 rounded-md border border-zinc-700 bg-muted transition-transform duration-500 [transition-timing-function:ease]"
      ></div>

      <Button
        variant="outline"
        onClick={() => setChart("line")}
        className={cn(
          "w-1/2 rounded-r-none border-0 bg-transparent hover:bg-muted/30",
          chart !== "line" && "text-muted-foreground"
        )}
      >
        <LineChartIcon className="mr-2 h-5" />
        Line Chart
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "w-1/2 rounded-l-none border-0 bg-transparent hover:bg-muted/30",
          chart !== "bar" && "text-muted-foreground"
        )}
        onClick={() => setChart("bar")}
      >
        <BarChart2Icon className="mr-2 h-5" />
        Bar Chart
      </Button>
    </div>
  )
}
