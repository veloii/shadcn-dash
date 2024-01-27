import { cn, colorClass } from '@/lib/utils'
import { View, viewTypeIcons } from '@/stores/view'
import { ViewActions } from './actions'
import React, { useEffect } from 'react'

function ViewItemSkeleton({
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

export function ViewItem({
  view,
  active = false,
  className,
  ...props
}: {
  active?: boolean
  view: View
} & Omit<React.ComponentPropsWithoutRef<"div">, "children" | "type" | "id">) {
  const Icon = viewTypeIcons[view.type]
  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (active && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    }
  }, [active]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-9 whitespace-nowrap min-w-56 cursor-default select-none gap-1 rounded-lg px-2 text-left transition",
        active
          ? `bg-muted text-foreground ${colorClass[view.color]}`
          : "opacity-75 hover:opacity-100 active:scale-[.98] dark:hover:bg-muted",
        className
      )}
      aria-selected={active}
      {...props}
    >
      <div className="flex grow items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <Icon className="h-4" />
          <div className="text-sm tracking-tight pr-6">{view.stat}</div>
        </div>
        <div
          className={cn(
            "flex items-center",
            active ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <ViewActions view={view} />
        </div>
      </div>
    </div>
  )
}

ViewItem.Skeleton = ViewItemSkeleton
