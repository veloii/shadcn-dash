import React, { createContext, useEffect, useMemo } from "react"
import { BarChart, LineChartIcon, LucideIcon } from "lucide-react"
import * as v from "valibot"

import { Color, colors } from "@/lib/utils"

import { ControlledFilters, Filters } from "./filters"

export const chartTypes = ["area", "bar", "line"] as const
export type ChartType = (typeof chartTypes)[number]

export const ProfileSchema = v.object({
  id: v.number(),
  stat: v.string(),
  chartType: v.picklist(chartTypes),
  color: v.picklist(colors),
  filters: v.record(v.array(v.string())),
})

export const chartTypeIcons: Record<ChartType, LucideIcon> = {
  line: LineChartIcon,
  area: LineChartIcon,
  bar: BarChart,
}

export type Profile = {
  id: number
  stat: string
  chartType: ChartType
  color: Color
}

type WithFilters<T> = T & {
  filters: Filters
}

export type WithoutId<T> = Omit<T, "id">
export type EditProfile = (
  id: number,
  profile: Partial<WithoutId<WithFilters<Profile>>>
) => void
export type RemoveProfile = (id: number) => void
export type AddProfile = (
  stat: string
) => WithFilters<Profile>
export type SetCurrentProfile = (id: number) => void
export type ImportJson = (json: string) => void
export type ExportJson = () => string

export const ProfilesContext = createContext<{
  profiles: Profile[]
  currentProfile: Profile | undefined
  addProfile: AddProfile
  removeProfile: RemoveProfile
  editProfile: EditProfile
  selectProfile: SetCurrentProfile
  stats: string[]
  loading: boolean
}>({
  profiles: [],
  addProfile: () => {
    throw new Error("No profile provider")
  },
  removeProfile: () => { },
  editProfile: () => { },
  selectProfile: () => { },
  currentProfile: undefined,
  stats: [],
  loading: false,
})

const newId = () => new Date().valueOf()
const randomColor = () => colors[Math.floor(Math.random() * colors.length)]

export const ProfilesProvider = ({
  children,
  syncKey,
}: {
  children: React.ReactNode
  syncKey?: string
}) => {
  const [profiles, setProfiles] = React.useState<WithFilters<Profile>[]>([])
  const [currentProfileId, setCurrentProfileId] = React.useState<number | null>(null)

  const [loading, setLoading] = React.useState(syncKey !== undefined)

  const stats = ["Page views", "Vistors", "Signups", "Purchases", "Revenue"];

  const addProfile = React.useCallback<AddProfile>((stat) => {
    let newProfile: WithFilters<Profile> = {
      id: newId(), filters: {}, stat, chartType: "line", color: randomColor()
    };

    setProfiles((profiles) => {
      const existingProfile = profiles.find(p => p.stat === stat)
      if (existingProfile) {
        newProfile = existingProfile
        return profiles
      }

      const newProfiles = [...profiles, newProfile]
      syncToLocalStorage(newProfiles)
      return newProfiles
    })

    return newProfile
  }, [])

  const removeProfile = React.useCallback<RemoveProfile>((id) => {
    if (id === currentProfileId) setCurrentProfileId(null)

    setProfiles((profiles) => {
      const newProfiles = profiles.filter((p) => p.id !== id)
      syncToLocalStorage(newProfiles)
      return newProfiles
    })
  }, [currentProfileId]);

  const editProfile = React.useCallback<EditProfile>((id, profile) => {
    setProfiles((profiles) => {
      const newProfiles = profiles.map((p) =>
        p.id === id ? { ...p, ...profile } : p
      )
      syncToLocalStorage(newProfiles)
      return newProfiles
    })
  }, [])

  const importJson = React.useCallback(
    (json: string) => {
      try {
        const unknownJson = JSON.parse(json)
        const profiles = v.parse(v.array(ProfileSchema), unknownJson)
        setProfiles(profiles)
        if (profiles.length > 0) setCurrentProfileId(profiles[0].id)
      } catch (e) {
        return undefined
      }
    },
    []
  )

  const currentProfile = useMemo(
    () => profiles.find((p) => p.id === currentProfileId),
    [profiles, currentProfileId]
  )

  const syncFilters = React.useCallback(
    (filters: Filters) => {
      if (!currentProfileId) return
      editProfile(currentProfileId, {
        filters,
      })
    },
    [currentProfileId, editProfile]
  )

  const syncToLocalStorage = React.useCallback(
    (newProfiles: WithFilters<Profile>[]) => {
      if (syncKey) {
        localStorage.setItem(syncKey, JSON.stringify(newProfiles))
      }
    },
    [syncKey]
  )

  useEffect(() => {
    if (syncKey) {
      const json = localStorage.getItem(syncKey)
      if (json) importJson(json)
      setLoading(false)
    }
  }, [syncKey, importJson])

  return (
    <ProfilesContext.Provider
      value={{
        profiles,
        removeProfile,
        editProfile,
        addProfile,
        selectProfile: setCurrentProfileId,
        currentProfile,
        loading,
        stats,
      }}
    >
      <ControlledFilters
        filters={currentProfile?.filters || {}}
        setFilters={syncFilters}
      >
        {children}
      </ControlledFilters>
    </ProfilesContext.Provider>
  )
}

export const useProfiles = () => React.useContext(ProfilesContext)
