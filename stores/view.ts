import { createStoreContext } from '@/lib/context'
import { Color, colors } from '@/lib/utils'
import { AreaChartIcon, BarChart, LineChartIcon, LucideIcon } from 'lucide-react'
import React from 'react'
import { create } from 'zustand'
import { persist, combine, createJSONStorage } from 'zustand/middleware'

export const viewTypes = ['area', 'bar', 'line'] as const

export type ViewType = typeof viewTypes[number]
export type Id = number
export type Filters = Record<string, string[]>

export const viewTypeIcons: Record<ViewType, LucideIcon> = {
  line: LineChartIcon,
  area: AreaChartIcon,
  bar: BarChart,
}

export type View = {
  stat: string
  id: Id
  type: ViewType
  color: Color
  filters: Filters
}

export type TabsPosition = "top" | "side"

const randomId = () => Math.floor(Math.random() * 1000000) satisfies Id
const randomColor = () => colors[Math.floor(Math.random() * colors.length)]

export const createViewStore = ({ syncKey }: { syncKey: string }) => create(
  persist(
    combine({ tabsPosition: "side" as TabsPosition, views: [] as View[], selectedId: null as null | Id }, (set, get) => ({
      remove: Object.assign((id: number) => set((state) => ({ views: state.views.filter((v) => v.id !== id) })), {
        filter: (id: number, key: string, value?: string) => set((state) => {
          if (!value) return { views: state.views.map((v) => (v.id === id ? { ...v, filters: { ...v.filters, [key]: [] } } : v)) }

          return {
            views: state.views.map((v) => (v.id === id ? { ...v, filters: { ...v.filters, [key]: (v.filters[key] || []).filter((v) => v !== value) } } : v))
          }
        })
      }),

      add: Object.assign((stat: string) => {
        const existingView = (get().views.find(v => v.stat === stat))
        if (existingView) return existingView

        const view: View = { stat, id: randomId(), type: 'area', color: randomColor(), filters: {} }

        set((state) => ({
          views: [...state.views, view]
        }))

        return view;
      }, {
        filter: (id: number, key: string, value: string) => set((state) => ({
          views: state.views.map((v) => (v.id === id ? { ...v, filters: { ...v.filters, [key]: [...(v.filters[key] || []), value] } } : v))
        }))
      }),

      edit: (id: number, view: Partial<View>) => set((state) => ({
        views: state.views.map((v) => (v.id === id ? { ...v, ...view } : v))
      })),

      select: (id: number) => set({ selectedId: id }),

      setTabsPosition: (tabsPosition: TabsPosition) => set({ tabsPosition }),
    })),
    { name: `view-${syncKey}`, storage: createJSONStorage(() => localStorage) }
  )
)

export const [ViewStoreProvider, useViewStore] = createStoreContext(createViewStore)

export const useCurrentView = () => {
  const selectedId = useViewStore((state) => state.selectedId)
  const view = useViewStore((state) => state.views.find((v) => v.id === selectedId))
  return view
}

export const useWithId = (id: Id) => React.useCallback(
  <U, T extends U[]>(fn: (id: Id, ...args: T) => void) => {
    return (...args: T) => fn(id, ...args)
  },
  [id]
);

