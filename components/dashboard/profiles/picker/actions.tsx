import { Button } from '@/components/ui/button'
import { useFilters } from '@/contexts/filters'
import { Profile } from '@/contexts/profile'
import { cn } from '@/lib/utils'
import { FilterIcon, SettingsIcon } from 'lucide-react'
import React from 'react'
import { FilterList, FilterManager } from '../../filter-picker'
import { ProfileSettings } from './settings'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function ProfilePickerActions({ profile }: { profile: Profile }) {
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
              />
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


