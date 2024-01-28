import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TabsPosition, useViewStore } from '@/components/dashboard/views/store';
import { ArrowLeftFromLine, ArrowUpToLine } from 'lucide-react';
import { AddViewButton } from './view/add-view';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Slot } from '@radix-ui/react-slot';
import { ComponentProps, ComponentPropsWithoutRef } from 'react';

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

export function ViewsToolbar({ className, asChild, children, ...props }: { asChild?: boolean } & ComponentPropsWithoutRef<"div">) {
  const type = useViewStore(s => s.tabsPosition)
  const setType = useViewStore(s => s.setTabsPosition)

  const loading = false;

  const Comp = asChild ? Slot : "div"

  return (
    <div className={cn(type === "side" && "flex-col justify-between", 'flex p-3 relative gap-4 bg-muted/40')}>

      {type === "top" && (
        <MoveTabsPosition
          tabsPosition={type}
          onChangeType={setType}
          disabled={loading}
        />
      )}

      <ScrollArea className={cn(type === "top" && "w-full")}>

        <Comp className={cn(type === "top" ? 'flex gap-4' : "h-96 min-w-56", className)} {...props}>
          {children}
        </Comp>

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
  )
}

