import { BarChart2 } from "lucide-react"

import { Button } from "../ui/button"
import { OptionsPopover } from "./options-popover"

export function Header() {
  return (
    <div className="border-b p-4">
      <div className="max-w-7xl flex justify-between items-center mx-auto">
        <h3>Overview</h3>
        <div className="flex gap-2">
          <OptionsPopover />
        </div>
      </div>
    </div>
  )
}
