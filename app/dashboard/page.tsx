"use client"

import React from "react"
import { useFilters } from "@/contexts/filters"
import { Profile, Profiles, useProfiles } from "@/contexts/profile"
import {
  ArrowLeftFromLine,
  ArrowLeftToLine,
  ArrowUpToLine,
  BarChart,
  FilterIcon,
  LineChartIcon,
  SettingsIcon,
} from "lucide-react"

import { Color, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import CombinedCharts from "@/components/ui/charts/combined-charts"
import { FilterList, FilterManager } from "@/components/ui/filter-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Header } from "@/components/dashboard/header"

const profileTypeIcons = {
  line: LineChartIcon,
  area: LineChartIcon,
  bar: BarChart,
} as const

const colorClass: Record<Color, string> = {
  red: "text-red-700 dark:text-red-100 dark:bg-red-500/50",
  orange: "text-orange-700 dark:text-orange-100 dark:bg-orange-500/50",
  amber: "text-amber-700 dark:text-amber-100 dark:bg-amber-500/50",
  yellow: "text-yellow-700 dark:text-yellow-100 dark:bg-yellow-500/50",
  lime: "text-lime-700 dark:text-lime-100 dark:bg-lime-500/50",
  green: "text-green-700 dark:text-green-100 dark:bg-green-500/50",
  emerald: "text-emerald-700 dark:text-emerald-100 dark:bg-emerald-500/50",
  teal: "text-teal-700 dark:text-teal-100 dark:bg-teal-500/50",
  cyan: "text-cyan-700 dark:text-cyan-100 dark:bg-cyan-500/50",
  sky: "text-sky-700 dark:text-sky-100 dark:bg-sky-500/50",
  blue: "text-blue-700 dark:text-blue-100 dark:bg-blue-500/50",
  indigo: "text-indigo-700 dark:text-indigo-100 dark:bg-indigo-500/50",
  violet: "text-violet-700 dark:text-violet-100 dark:bg-violet-500/50",
  purple: "text-purple-700 dark:text-purple-100 dark:bg-purple-500/50",
  fuchsia: "text-fuchsia-700 dark:text-fuchsia-100 dark:bg-fuchsia-500/50",
  pink: "text-pink-700 dark:text-pink-100 dark:bg-pink-500/50",
  rose: "text-rose-700 dark:text-rose-100 dark:bg-rose-500/50",
}

function SomeTopChartPicker({
  profile,
  active = false,
  className,
  ...props
}: {
  active?: boolean
  profile: Profile
} & Omit<React.ComponentPropsWithoutRef<"div">, "children" | "type" | "id">) {
  const Icon = profileTypeIcons[profile.chartType]

  return (
    <div
      className={cn(
        "relative flex h-9 min-w-56 cursor-default select-none gap-1 rounded-lg px-2 text-left transition",
        active
          ? `bg-muted text-foreground ${colorClass[profile.color]}`
          : "opacity-75 hover:opacity-100 active:scale-[.98] dark:hover:bg-muted",
        className
      )}
      aria-selected={active}
      {...props}
    >
      <div className="flex grow items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <Icon className="h-4" />
          <div className="text-sm tracking-tight">{profile.name}</div>
        </div>
        <div
          className={cn(
            "flex items-center",
            active ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <ChartPickerActions />
        </div>
      </div>
    </div>
  )
}

function SomeSideChartPicker({
  profile,
  active = false,
  className,
  ...props
}: {
  active?: boolean
  profile: Profile
} & Omit<React.ComponentPropsWithoutRef<"div">, "children" | "type" | "id">) {
  const Icon = profileTypeIcons[profile.chartType]

  return (
    <div
      className={cn(
        "relative flex h-9 min-w-56 cursor-default select-none gap-1 rounded-lg px-2 text-left transition",
        active
          ? `bg-muted text-foreground ${colorClass[profile.color]}`
          : "opacity-75 hover:opacity-100 active:scale-[.98] dark:hover:bg-muted",
        className
      )}
      aria-selected={active}
      {...props}
    >
      <div className="flex grow items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <Icon className="h-4" />
          <div className="text-sm tracking-tight">{profile.name}</div>
        </div>
        <div
          className={cn(
            "flex items-center",
            active ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <ChartPickerActions />
        </div>
      </div>
    </div>
  )
}

function ChartPickerActions() {
  const [addFilterOpen, setAddFilterOpen] = React.useState(false)
  const { filters } = useFilters()
  const hasFilters = Object.keys(filters).length > 0

  return (
    <>
      <Popover open={addFilterOpen} onOpenChange={setAddFilterOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative size-7 hover:bg-foreground/10"
          >
            {hasFilters && (
              <div
                className={cn(
                  "absolute right-0.5 top-0.5 z-10 size-1.5 rounded-full bg-foreground"
                )}
              ></div>
            )}
            <FilterIcon className="h-4 opacity-75" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="relative overflow-hidden p-0">
          {hasFilters && (
            <div className="absolute bottom-0 left-0 z-10 flex w-full flex-wrap gap-2 bg-gradient-to-t from-background from-[60%] to-transparent p-3 pt-10">
              <FilterList />
            </div>
          )}
          <FilterManager />
        </PopoverContent>
      </Popover>
      <Button
        className={cn("size-7 p-1.5 hover:bg-foreground/10")}
        variant="ghost"
        size="icon"
      >
        <SettingsIcon className="size-full opacity-75" />
      </Button>
    </>
  )
}

function SomeChartPicker({
  profile,
  active = false,
  className,
  ...props
}: {
  active?: boolean
  profile: Profile
} & Omit<React.ComponentPropsWithoutRef<"div">, "children" | "type" | "id">) {
  const Icon = profileTypeIcons[profile.chartType]

  return (
    <div
      className={cn(
        "relative flex h-20 w-48 cursor-pointer select-none flex-col justify-center gap-1 rounded-t-lg border border-b-2 p-2 px-4 text-left",
        active
          ? `bg-muted/50 ${"color"}`
          : "border-transparent hover:border-b-border hover:bg-muted/25",
        className
      )}
      aria-selected={active}
      {...props}
    >
      <div className="-ml-1 flex gap-1 text-sm opacity-75">
        <Icon className="h-5" />
        {profile.chartType[0].toUpperCase() + profile.chartType.slice(1)}
      </div>
      <div className="text-lg font-semibold tracking-tight">{profile.name}</div>
      <div
        className={cn(
          "absolute bottom-4 right-4 flex items-center justify-center",
          active ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <ChartPickerActions />
      </div>
    </div>
  )
}

const demoProfiles: Profile[] = [
  {
    name: "Visitors",
    color: "red",
    chartType: "bar",
  },
  {
    name: "Sales",
    color: "green",
    chartType: "bar",
  },
  {
    name: "Orders",
    color: "indigo",
    chartType: "line",
  },
  {
    name: "Revenue",
    color: "teal",
    chartType: "area",
  },
]

function SomeInternalChartComponent() {
  const { selectProfile, currentProfile, profiles } = useProfiles()
  const [type, setType] = React.useState<"top" | "side">("side")

  if (type === "top")
    return (
      <div className="divide-y">
        <div className="flex gap-2 bg-muted/20 p-3">
          <Button
            onClick={() => {
              setType("side")
            }}
            className="size-9 p-2.5 transition active:scale-95"
            variant="ghost"
          >
            <ArrowLeftToLine className="h-full" />
          </Button>
          {profiles.map((profile) => (
            <SomeTopChartPicker
              active={currentProfile?.name === profile.name}
              key={profile.name}
              onClick={() => selectProfile(profile.name)}
              profile={profile}
            />
          ))}
        </div>
        <div className="grow p-3 pt-5">
          <CombinedCharts />
        </div>
      </div>
    )

  return (
    <div className="flex divide-x">
      <div className="relative bg-muted/20 p-3">
        <Button
          onClick={() => {
            setType("top")
          }}
          className="absolute bottom-4 size-9 p-2.5 transition  active:scale-95"
          variant="ghost"
        >
          <ArrowUpToLine className="h-full" />
        </Button>
        {profiles.map((profile) => (
          <SomeSideChartPicker
            active={currentProfile?.name === profile.name}
            key={profile.name}
            onClick={() => selectProfile(profile.name)}
            profile={profile}
          />
        ))}
      </div>
      <div className="grow p-3 pt-5">
        <CombinedCharts />
      </div>
    </div>
  )
}

function SomeChartComponent() {
  return (
    <Profiles initialProfiles={demoProfiles}>
      <SomeInternalChartComponent />
    </Profiles>
  )
}

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <div className="mx-auto max-w-7xl py-10">
        <div className="space-y-5 rounded-lg border">
          <SomeChartComponent />
        </div>
      </div>
    </div>
  )
}
