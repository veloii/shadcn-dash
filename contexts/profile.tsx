import React, { createContext, useEffect, useMemo } from "react"
import { BarChart, LineChartIcon, LucideIcon } from "lucide-react"
import * as v from "valibot"

import { Color, colors } from "@/lib/utils"

import { ControlledFilters, Filters } from "./filters"

export const chartTypes = ["area", "bar", "line"] as const
export type ChartType = (typeof chartTypes)[number]

export const ProfileSchema = v.object({
  id: v.number(),
  name: v.string(),
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
  name: string
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
  profile: WithoutId<Profile | WithFilters<Profile>>
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
  loading: boolean
}>({
  profiles: [],
  addProfile: () => {
    throw new Error("No profile provider")
  },
  removeProfile: () => {},
  editProfile: () => {},
  selectProfile: () => {},
  currentProfile: undefined,
  loading: false,
})

const newId = () => new Date().valueOf()

export const Profiles = ({
  initialProfiles = [],
  children,
  syncKey,
}: {
  children: React.ReactNode
  initialProfiles?: Profile[]
  syncKey?: string
}) => {
  const [profiles, setProfiles] = React.useState<WithFilters<Profile>[]>(
    initialProfiles.map((p) => ({ ...p, filters: {} }))
  )

  const [currentProfileId, setCurrentProfileId] = React.useState<number | null>(
    profiles.length > 0 ? profiles[0].id : null
  )

  const [loading, setLoading] = React.useState(syncKey !== undefined)

  const addProfile = React.useCallback<AddProfile>((profile) => {
    const newProfile = { id: newId(), filters: {}, ...profile }

    setProfiles((profiles) => {
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
  }, [])

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
    [JSON.parse]
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
    if (syncKey && loading) {
      const json = localStorage.getItem(syncKey)
      if (json) importJson(json)
      setLoading(false)
    }
  }, [syncKey])

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
