"use client"

import * as React from "react"
import { useFilters } from "@/contexts/filters"
import { Check, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"

import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"

export function FilterManager({
  onOpenChange,
  closeWhenSelected = false,
}: {
  onOpenChange?: (open: boolean) => void
  closeWhenSelected?: boolean
}) {
  const { filters, availableFilters, removeFilter, addFilter } = useFilters()

  // biome-ignore lint: react-hooks/exhaustive-deps
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
              <div className="mb-1.5 text-sm text-muted-foreground">
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
                      "absolute right-2 size-4",
                      filters[name]?.includes(value)
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
        className="h-6 cursor-pointer px-2"
        onClick={() => removeFilter(name, v)}
      >
        {v.charAt(0).toUpperCase()}
        {v.slice(1)}
        <XIcon className="h-4" />
      </Badge>
    ))
  )
}
