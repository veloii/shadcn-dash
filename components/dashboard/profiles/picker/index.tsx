import { Button, ButtonProps } from '@/components/ui/button'
import { useProfiles } from '@/contexts/profile'
import { cn } from '@/lib/utils'
import { ArrowLeftFromLine, ArrowUpToLine, PlusIcon } from 'lucide-react'
import React, { useState } from 'react'
import { ProfilePickerItem } from './item'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { NewProfile } from './settings'

export type TabsPosition = "top" | "side"

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


function AddProfileButton({
  className,
  tabsPosition,
  ...props
}: Omit<ButtonProps, "type"> & {
  tabsPosition: TabsPosition
}) {
  const { stats, addProfile, selectProfile } = useProfiles()
  const [open, setOpen] = useState(false)

  const onAddProfile = React.useCallback((newProfile: string) => {
    const { id } = addProfile(newProfile)
    selectProfile(id)
    setOpen(false)
  }, [selectProfile, addProfile])

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
        <NewProfile onAddProfile={onAddProfile} stats={stats} />
      </PopoverContent>
    </Popover>
  )
}

export function ProfilePicker({ children }: { children: React.ReactNode }) {
  const { loading, selectProfile, currentProfile, profiles } = useProfiles()
  const [type, setType] = React.useState<"top" | "side">("side")

  return (
    <div className={cn(type === "top" ? "divide-y" : "flex divide-x")}>
      <div
        className={cn(
          "relative bg-muted/20 p-3 min-w-64",
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
            // biome-ignore lint: this is a skeleton
            <ProfilePickerItem.Skeleton key={i} />
          ))
          : profiles.map((profile) => (
            <ProfilePickerItem
              active={currentProfile?.id === profile.id}
              key={profile.id}
              onClick={() => selectProfile(profile.id)}
              profile={profile}
            />
          ))}
        <AddProfileButton tabsPosition={type} disabled={loading} />
      </div>
      <div className="grow p-3 pt-5 min-h-[432px]">
        {children}
      </div>
    </div>
  )
}
