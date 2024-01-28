"use client"

import { Header } from "@/components/dashboard/header"
import { DndViews } from '@/components/dashboard/views'
import { Dnd } from '@/components/dashboard/views/drag-n-drop'

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <div className="mx-auto max-w-7xl py-5 space-y-10">

        <Dnd>
          <DndViews syncKey='hi2' />
          <DndViews syncKey='hi' />
        </Dnd>

      </div>
    </div>
  )
}
