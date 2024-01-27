import React, { ChangeEventHandler, useCallback } from "react"
import {
  chartTypeIcons,
  chartTypes,
  Profile,
  useProfiles,
} from "@/contexts/profile"
import { TrashIcon } from "lucide-react"

import { cn, Color, colorClass } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ColorPickerSelect } from "@/components/ui/color-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"

function ProfileForm({
  onChange,
  profile,
}: {
  profile?: Partial<Profile>
  onChange: (profile: Partial<Profile>) => void
}) {
  const onNameChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      if (!("value" in event.target) || typeof event.target.value !== "string")
        return

      onChange({ name: event.target.value })
    },
    []
  )

  const onColorChange = useCallback((color: Color) => {
    onChange({ color })
  }, [])

  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-3 items-center gap-4">
        <Label htmlFor="name">Name</Label>
        <Input
          ignorePasswordManager
          id="name"
          placeholder={profile?.name}
          onChange={onNameChange}
          className="col-span-2 h-8"
        />
      </div>
      <div className="grid grid-cols-3 items-center gap-4">
        <Label>Color</Label>
        <Select onValueChange={onColorChange} defaultValue={profile?.color}>
          <SelectTrigger className="col-span-2 h-8">
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <ColorPickerSelect />
        </Select>
      </div>
      <div className="grid grid-cols-3 items-center gap-4">
        <Label>Graph</Label>
        <div className="grid-cols-3 grid col-span-2 gap-1">
          {chartTypes.map((chartType) => {
            const Icon = chartTypeIcons[chartType]
            const active = chartType === profile?.chartType

            return (
              <Button
                size="sm"
                className={cn(
                  "h-8 transition",
                  active &&
                    `bg-muted ${profile?.color && colorClass[profile.color]} dark:border-transparent`
                )}
                variant={"outline"}
                key={chartType}
                onClick={() => onChange({ chartType })}
              >
                <Icon className="h-4" />
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function RemoveProfileAlertContent({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the
          profile.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

export function ProfileSettings({ profile }: { profile: Profile }) {
  const { removeProfile, editProfile } = useProfiles()

  const onChange = React.useCallback(
    (p: Partial<Profile>) => {
      editProfile(profile.id, p)
    },
    [profile.id, editProfile]
  )

  const onRemove = React.useCallback(() => {
    removeProfile(profile.id)
  }, [profile.id, removeProfile])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Profile</h4>
        <p className="text-sm text-muted-foreground">
          Customize your profile settings.
        </p>
      </div>
      <ProfileForm profile={profile} onChange={onChange} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="pr-5">
            <TrashIcon className="h-4 mr-1" />
            Remove
          </Button>
        </AlertDialogTrigger>
        <RemoveProfileAlertContent onConfirm={onRemove} />
      </AlertDialog>
    </div>
  )
}

export function NewProfile({
  onAddProfile,
}: {
  onAddProfile: (_: Profile) => void
}) {
  const [profile, setProfile] = React.useState<Partial<Profile>>({})

  const onChange = React.useCallback(
    (p: Partial<Profile>) => {
      setProfile((profile) => ({ ...profile, ...p }))
    },
    [setProfile]
  )

  const isProfileValid = React.useMemo(() => {
    return (profile.name?.length || 0) > 0 && profile.color && profile.chartType
  }, [profile])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">New Profile</h4>
        <p className="text-sm text-muted-foreground">
          Fill in the details to create a new profile.
        </p>
      </div>
      <ProfileForm profile={profile} onChange={onChange} />
      <Button
        size="sm"
        onClick={() => {
          onAddProfile(profile as Profile)
          setProfile({})
        }}
        disabled={!isProfileValid}
      >
        Create
      </Button>
    </div>
  )
}
