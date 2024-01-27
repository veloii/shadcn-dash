"use client"

import React, { useState } from "react"
import { useFilters } from "@/contexts/filters"
import {
  chartTypeIcons,
  Profile,
  Profiles,
  useProfiles,
} from "@/contexts/profile"
import {
  ArrowLeftFromLine,
  ArrowUpToLine,
  FilterIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react"

import { cn, colorClass } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import CombinedCharts from "@/components/ui/charts/combined-charts"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Header } from "@/components/dashboard/header"
import {
  FilterList,
  FilterManager,
} from "@/components/dashboard/profiles/filter-picker"
import {
  NewProfile,
  ProfileSettings,
} from "@/components/dashboard/profiles/profile-settings"

type TabsPosition = "top" | "side"

function SkeletonChartPicker({
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"div">, "children" | "type" | "id">) {
  return (
    <div
      className={cn(
        "relative flex h-9 min-w-56 cursor-default select-none gap-1 rounded-lg px-2 text-left transition animate-pulse",
        className
      )}
      aria-selected={false}
      {...props}
    >
      <div className="flex grow items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <div className="h-5 w-5 rounded bg-foreground/10"></div>
          <div className="text-sm tracking-tight h-5 rounded bg-muted w-32"></div>
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
  const Icon = chartTypeIcons[profile.chartType]

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
          <ChartPickerActions profile={profile} />
        </div>
      </div>
    </div>
  )
}

function ChartPickerActions({ profile }: { profile: Profile }) {
  const [addFilterOpen, setAddFilterOpen] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
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
      <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative size-7 hover:bg-foreground/10"
          >
            <SettingsIcon className="h-4 opacity-75" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80">
          <ProfileSettings profile={profile} />
        </PopoverContent>
      </Popover>
    </>
  )
}

function AddProfileButton({
  className,
  tabsPosition,
  ...props
}: Omit<ButtonProps, "type"> & {
  tabsPosition: TabsPosition
}) {
  const { addProfile, selectProfile } = useProfiles()
  const [open, setOpen] = useState(false)

  const onAddProfile = React.useCallback((newProfile: Profile) => {
    const { id } = addProfile(newProfile)
    selectProfile(id)
    setOpen(false)
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "size-9 p-2.5 transition active:scale-95",
            tabsPosition === "side" && "absolute bottom-4 right-4",
            className
          )}
          variant="ghost"
          {...props}
        >
          <PlusIcon className="h-full" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <NewProfile onAddProfile={onAddProfile} />
      </PopoverContent>
    </Popover>
  )
}

function MoveTabsPosition({
  className,
  tabsPosition,
  onClick,
  onChangeType,
  ...props
}: Omit<ButtonProps, "type"> & {
  tabsPosition: TabsPosition
  onChangeType: (_: TabsPosition) => void
}) {
  const MovePositionIcon =
    tabsPosition === "top" ? ArrowLeftFromLine : ArrowUpToLine

  return (
    <Button
      onClick={(e) => {
        onClick?.(e)
        onChangeType(tabsPosition === "top" ? "side" : "top")
      }}
      className={cn(
        "size-9 p-2.5 transition active:scale-95",
        tabsPosition === "side" && "absolute bottom-4",
        className
      )}
      variant="ghost"
      {...props}
    >
      <MovePositionIcon className="h-full" />
    </Button>
  )
}

function SomeInternalChartComponent() {
  const { loading, selectProfile, currentProfile, profiles } = useProfiles()
  const [type, setType] = React.useState<"top" | "side">("side")

  return (
    <div className={cn(type === "top" ? "divide-y" : "flex divide-x")}>
      <div
        className={cn(
          "relative bg-muted/20 p-3",
          type === "top" && "flex gap-2"
        )}
      >
        <MoveTabsPosition
          tabsPosition={type}
          onChangeType={setType}
          disabled={loading}
        />
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonChartPicker key={i} />
            ))
          : profiles.map((profile) => (
              <SomeSideChartPicker
                active={currentProfile?.id === profile.id}
                key={profile.id}
                onClick={() => selectProfile(profile.id)}
                profile={profile}
              />
            ))}
        <AddProfileButton tabsPosition={type} disabled={loading} />
      </div>
      <div className="grow p-3 pt-5 min-h-[432px]">
        <CombinedCharts />
      </div>
    </div>
  )
}

function SomeChartComponent() {
  return (
    <Profiles syncKey="hello">
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
