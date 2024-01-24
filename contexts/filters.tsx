import React, { createContext, useEffect } from "react"

export type Filters = Record<string, string[] | undefined>

const FiltersContext = createContext<{
  filters: Filters
  availableFilters: Filters
  addFilter: (name: string, value: string) => void
  removeFilter: (name: string, value?: string) => void
}>({
  filters: {},
  availableFilters: {},
  removeFilter: () => {},
  addFilter: () => {},
})

const demoAvailableFilters = {
  author: ["@pomber", "@jamesplease"],
  is: ["open", "closed"],
  label: ["bug", "enhancement"],
  sort: ["created", "updated"],
  user: ["pomber", "jamesplease"],
}

function useFilterActions(
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
) {
  const addFilter = React.useCallback(
    (name: string, value: string) => {
      setFilters((filters) => ({
        ...filters,
        [name]: [...(filters[name] || []), value],
      }))
    },
    [setFilters]
  )

  const removeFilter = React.useCallback(
    (name: string, value?: string) => {
      if (value) {
        setFilters((filters) => {
          if (filters.hasOwnProperty(name) && filters[name]?.length === 1) {
            const { [name]: _, ...rest } = filters
            return rest
          }

          return {
            ...filters,
            [name]: filters[name]?.filter((v) => v !== value),
          }
        })

        return
      }

      setFilters((filters) => {
        const { [name]: _, ...rest } = filters

        return rest
      })
    },
    [setFilters]
  )

  return { addFilter, removeFilter }
}

export function useAvailableFilters() {
  const [availableFilters, setAvailableFilters] =
    React.useState<Filters>(demoAvailableFilters)

  return availableFilters
}

export function ControlledFilters({
  filters,
  setFilters: setFiltersProp,
  children,
}: {
  setFilters: (filters: Filters) => void
  filters: Filters
  children: React.ReactNode
}) {
  const availableFilters = useAvailableFilters()

  const setFilters = React.useCallback(
    (arg: Filters | ((f: Filters) => Filters)) => {
      if (typeof arg === "function") setFiltersProp(arg(filters))
      else setFiltersProp(arg)
    },
    [filters, setFiltersProp]
  )
  // this really sucks for perf, especially if a setState hook is being used anyway

  const actions = useFilterActions(setFilters)

  return (
    <FiltersContext.Provider
      value={{
        availableFilters,
        filters,
        ...actions,
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export function Filters({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = React.useState<Filters>({})
  const availableFilters = useAvailableFilters()
  const actions = useFilterActions(setFilters)

  return (
    <FiltersContext.Provider
      value={{
        availableFilters,
        filters,
        ...actions,
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export const useFilters = () => React.useContext(FiltersContext)
