import { useState } from "react"
import { DayPicker } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>(value)

  const handleSelect = (newRange: DateRange | undefined) => {
    setDate(newRange)
    onChange(newRange)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[250px] justify-start text-left">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from && date?.to ? (
            <span>
              {format(date.from, "yyyy-MM-dd")} → {format(date.to, "yyyy-MM-dd")}
            </span>
          ) : (
            <span>Select date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-2">
        <DayPicker
          mode="range"
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
