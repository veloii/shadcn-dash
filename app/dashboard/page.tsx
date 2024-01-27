"use client"

import {
  ProfilesProvider
} from "@/contexts/profile"

import { Header } from "@/components/dashboard/header"
import { ProfilePicker } from '@/components/dashboard/profiles/picker'
import CombinedCharts from "@/components/ui/charts/combined-charts"

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <div className="mx-auto max-w-7xl py-10">
        <div className="space-y-5 rounded-lg border">
          <ProfilesProvider syncKey='hello'>
            <ProfilePicker>
              <CombinedCharts />
            </ProfilePicker>
          </ProfilesProvider>
        </div>
      </div>
    </div>
  )
}
