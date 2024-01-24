"use client"

import * as React from "react"
import { useFilters } from "@/contexts/filters"
import { Check, PlusIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Badge } from "./badge"
import { ScrollArea } from "./scroll-area"

export function FilterManager({
  onOpenChange,
  closeWhenSelected = false,
}: {
  onOpenChange?: (open: boolean) => void
  closeWhenSelected?: boolean
}) {
  const { filters, availableFilters, removeFilter, addFilter } = useFilters()

  const toggleFilter = React.useCallback(
    (name: string, value: string) => {
      if (filters[name]?.includes(value)) {
        removeFilter(name, value)
        return
      }
      addFilter(name, value)
    },
    [filters, removeFilter, addFilter]
  )

  return (
    <Command>
      <CommandInput placeholder="Search filters..." />
      <CommandEmpty>No filter found.</CommandEmpty>
      <ScrollArea className="h-96">
        {Object.entries(availableFilters).map(([name, values], index) => (
          <>
            {index > 0 && <CommandSeparator />}
            <CommandGroup key={name} className="p-3">
              <div className="text-sm text-muted-foreground mb-1.5">
                {name[0].toUpperCase()}
                {name.slice(1)}
              </div>
              {values?.map((value) => (
                <CommandItem
                  key={name + value}
                  value={value}
                  onSelect={() => {
                    if (closeWhenSelected) onOpenChange?.(false)
                    toggleFilter?.(name, value)
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 absolute right-2",
                      filters?.[name] && filters[name]?.includes(value)
                        ? ""
                        : "hidden"
                    )}
                  />
                  {value}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ))}
      </ScrollArea>
    </Command>
  )
}

export function FilterList() {
  const { filters, removeFilter } = useFilters()

  return Object.entries(filters).map(([name, value]) =>
    value?.map((v) => (
      <Badge
        key={name + v}
        className="h-6 px-2 cursor-pointer"
        onClick={() => removeFilter(name, v)}
      >
        {v.charAt(0).toUpperCase()}
        {v.slice(1)}
        <XIcon className="h-4" />
      </Badge>
    ))
  )
}

export function ScopedFilterPicker() {
  const [addFilterOpen, setAddFilterOpen] = React.useState(false)

  return (
    <div className="flex gap-2">
      <FilterList />

      <Popover open={addFilterOpen} onOpenChange={setAddFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <PlusIcon className="h-5" />
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <FilterManager onOpenChange={setAddFilterOpen} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
