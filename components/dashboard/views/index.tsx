import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TabsPosition, useViewStore } from '@/stores/view'
import { ArrowLeftFromLine, ArrowUpToLine } from 'lucide-react'
import React from 'react'
import { ViewItem } from './item'
import { AddViewButton } from './new'
import { ScrollBar, ScrollArea } from '@/components/ui/scroll-area'


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
        className
      )}
      variant="ghost"
      {...props}
    >
      <MovePositionIcon className="h-full" />
    </Button>
  )
}

export function ViewsPickerList({ children }: { children: React.ReactNode }) {
  const select = useViewStore(s => s.select)
  const views = useViewStore(s => s.views)
  const selectedId = useViewStore(s => s.selectedId)
  const type = useViewStore(s => s.tabsPosition)
  const setType = useViewStore(s => s.setTabsPosition)

  const loading = false;

  return (
    <div className={cn(type === "top" ? "divide-y" : "flex divide-x")}>
      <div className={cn(type === "top" ? 'items-center' : "flex-col justify-between", 'flex p-3 relative gap-4 bg-muted/40')}>
        {type === "top" && (
          <MoveTabsPosition
            tabsPosition={type}
            onChangeType={setType}
            disabled={loading}
          />
        )}
        <ScrollArea className={cn(type === "top" ? "w-full" : "h-96 min-w-56")}>
          <div className={cn(type === "top" && 'flex gap-4')}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint: this is a skeleton
                <ViewItem.Skeleton key={i} />
              ))
              :
              views.map((view) => (
                <ViewItem
                  active={selectedId === view.id}
                  key={view.id}
                  onClick={() => select(view.id)}
                  view={view}
                />
              ))}
          </div>
          {type === "top" && (
            <ScrollBar orientation='horizontal' />
          )}
        </ScrollArea>

        {type === "top" &&
          <AddViewButton tabsPosition={type} disabled={loading} />
        }

        {type === "side" && (
          <div className='flex gap-2 justify-between'>
            <MoveTabsPosition
              tabsPosition={type}
              onChangeType={setType}
              disabled={loading}
            />
            <AddViewButton
              tabsPosition={type}
              disabled={loading}
            />
          </div>
        )}
      </div>
      <div className="grow p-3 pt-5 min-h-[432px]">
        {children}
      </div>
    </div>
  )
}
