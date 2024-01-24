import React, { createContext, useMemo } from "react"

import { Color } from "@/lib/utils"

import { ControlledFilters, Filters } from "./filters"

export type ChartType = "area" | "bar" | "line"

type ProfileWithFilters = Profile & {
  filters: Filters
  color: Color
}

export type Profile = {
  name: string
  chartType: ChartType
  color: Color
}

export const ProfilesContext = createContext<{
  profiles: Profile[]
  currentProfile: Profile | undefined
  addProfile: (profile: Profile) => void
  removeProfile: (name: string) => void
  editProfile: (name: string, profile: Profile | ProfileWithFilters) => void
  selectProfile: (name: string) => void
}>({
  profiles: [],
  addProfile: () => {},
  removeProfile: () => {},
  editProfile: () => {},
  selectProfile: () => {},
  currentProfile: undefined,
})

export const Profiles = ({
  initialProfiles = [],
  children,
}: {
  children: React.ReactNode
  initialProfiles?: Profile[]
}) => {
  const [profiles, setProfiles] = React.useState<ProfileWithFilters[]>(
    initialProfiles.map((p) => ({ ...p, filters: {} }))
  )
  const [currentProfileName, setCurrentProfileName] = React.useState<string>(
    profiles[0].name
  )

  const addProfile = React.useCallback(
    (profile: Profile | ProfileWithFilters) => {
      setProfiles((profiles) => [...profiles, { filters: {}, ...profile }])
    },
    []
  )

  const removeProfile = React.useCallback((name: string) => {
    setProfiles((profiles) => profiles.filter((p) => p.name !== name))
  }, [])

  const editProfile = React.useCallback(
    (name: string, profile: Partial<ProfileWithFilters | Profile>) => {
      setProfiles((profiles) =>
        profiles.map((p) => (p.name === name ? { ...p, ...profile } : p))
      )
    },
    []
  )
  const currentProfile = useMemo(
    () => profiles.find((p) => p.name === currentProfileName),
    [profiles, currentProfileName]
  )

  const syncFilters = React.useCallback(
    (filters: Filters) => {
      if (!currentProfileName) return
      editProfile(currentProfileName, {
        filters,
      })
    },
    [currentProfileName, editProfile]
  )

  return (
    <ProfilesContext.Provider
      value={{
        profiles,
        addProfile,
        removeProfile,
        editProfile,
        selectProfile: setCurrentProfileName,
        currentProfile,
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
export const useCurrentProfile = () => {
  const { currentProfile } = useProfiles()
  if (!currentProfile) {
    throw new Error("No current profile")
  }
  return useMemo(() => currentProfile, [currentProfile])
}
