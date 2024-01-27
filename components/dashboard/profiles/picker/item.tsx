import { Profile, chartTypeIcons } from '@/contexts/profile'
import { cn, colorClass } from '@/lib/utils'
import { ProfilePickerActions } from './actions'

function ProfilePickerItemSkeleton({
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
          <div className="h-5 w-5 rounded bg-foreground/10" />
          <div className="text-sm tracking-tight h-5 rounded bg-muted w-32" />
        </div>
      </div>
    </div>
  )
}

export function ProfilePickerItem({
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
          <div className="text-sm tracking-tight">{profile.stat}</div>
        </div>
        <div
          className={cn(
            "flex items-center",
            active ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <ProfilePickerActions profile={profile} />
        </div>
      </div>
    </div>
  )
}

ProfilePickerItem.Skeleton = ProfilePickerItemSkeleton
