"use client"

import { Header } from "@/components/dashboard/header"
import { ViewsPickerList } from '@/components/dashboard/views'
import { CurrentViewChart } from '@/components/dashboard/views/chart'
import { ViewStoreProvider } from '@/stores/view'

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <div className="mx-auto max-w-7xl py-5 space-y-10">
        <div className="space-y-5 rounded-lg border">
          <ViewStoreProvider syncKey="hi2">
            <ViewsPickerList>
              <CurrentViewChart />
            </ViewsPickerList>
          </ViewStoreProvider>
        </div>
        <div className="space-y-5 rounded-lg border">
          <ViewStoreProvider syncKey="hi">
            <ViewsPickerList>
              <CurrentViewChart />
            </ViewsPickerList>
          </ViewStoreProvider>
        </div>
      </div>
    </div>
  )
}
