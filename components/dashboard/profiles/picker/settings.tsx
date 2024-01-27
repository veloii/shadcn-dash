import {
  Profile,
  chartTypeIcons,
  chartTypes,
  useProfiles,
} from "@/contexts/profile"
import { TrashIcon } from "lucide-react"
import React, { useCallback } from "react"

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
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Color, cn, colorClass } from "@/lib/utils"

function ProfileForm({
  onChange,
  profile,
}: {
  profile?: Partial<Profile>
  onChange: (profile: Partial<Profile>) => void
}) {
  const onColorChange = useCallback((color: Color) => {
    onChange({ color })
  }, [onChange])

  return (
    <div className="grid gap-2">
      {/* <div className="grid grid-cols-3 items-center gap-4"> */}
      {/*   <Label htmlFor="name">Name</Label> */}
      {/*   <Input */}
      {/*     ignorePasswordManager */}
      {/*     id="name" */}
      {/*     placeholder={profile?.name} */}
      {/*     onChange={onNameChange} */}
      {/*     className="col-span-2 h-8" */}
      {/*   /> */}
      {/* </div> */}
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
      <Button variant="destructive" size="sm" className="pr-5" onClick={onRemove}>
        <TrashIcon className="h-4 mr-1" />
        Remove
      </Button>
    </div>
  )
}

export function NewProfile({
  onAddProfile,
  stats,
}: {
  onAddProfile: (name: string) => void
  stats: string[]
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">New Profile</h4>
        <p className="text-sm text-muted-foreground">
          Fill in the details to create a new profile.
        </p>
      </div>
      {stats.map(stat => (
        <Button key={stat} onClick={() => {
          onAddProfile(stat)
        }}>
          {stat}
        </Button>
      ))}
    </div>
  )
}
