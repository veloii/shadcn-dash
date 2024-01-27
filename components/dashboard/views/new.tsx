import { Button, ButtonProps } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TabsPosition } from '.'
import { useViewStore } from '@/stores/view'
import { useCallback, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { PlusIcon } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'

export function NewView({
  onSelect,
  stats,
}: {
  onSelect: (stat: string) => void
  stats: Record<string, string[]>
}) {
  return (
    <Command>
      <CommandInput placeholder="Search events to track..." />
      <ScrollArea className='h-64'>
        <CommandEmpty>No stats found.</CommandEmpty>
        {Object.entries(stats).map(([group, stats]) => (
          <CommandGroup className="p-3">
            <div className="mb-1.5 text-sm text-muted-foreground">
              {group[0].toUpperCase()}
              {group.slice(1)}
            </div>
            {stats.map((stat) => (
              <CommandItem
                key={stat}
                value={stat}
                onSelect={() => onSelect(stat)}
              >
                {stat}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </ScrollArea>
    </Command>
  )
}

const demoStats = {
  users: [
    "Visitors",
    "Page Views",
  ],
  events: [
    "Purchases",
    "Signups",
    "Logins",
    "Comments",
    "Likes",
  ]
}

export function AddViewButton({
  className,
  tabsPosition,
  ...props
}: Omit<ButtonProps, "type"> & {
  tabsPosition: TabsPosition
}) {
  const add = useViewStore(s => s.add)
  const select = useViewStore(s => s.select)

  const [open, setOpen] = useState(false)

  const onNew = useCallback((stat: string) => {
    const { id } = add(stat)
    select(id)
    setOpen(false)
  }, [select, add])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "size-9 p-2.5 transition active:scale-95",
            className
          )}
          variant="ghost"
          {...props}
        >
          <PlusIcon className="h-full" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <NewView onSelect={onNew} stats={demoStats} />
      </PopoverContent>
    </Popover>
  )
}
