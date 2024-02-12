import { DateRangePickerPopover } from "./options-popover";

export function Header() {
  return (
    <>
      <h3>Overview</h3>
      <div className="flex gap-2">
        <DateRangePickerPopover />
      </div>
    </>
  );
}
