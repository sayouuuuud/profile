'use client'

import * as React from 'react'
import { format, parseISO } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", className }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (!value) return undefined
    try {
      const d = parseISO(value)
      return isNaN(d.getTime()) ? undefined : d
    } catch {
      return undefined
    }
  })

  // Update internal date state when external value changes
  React.useEffect(() => {
    if (value) {
      try {
        const d = parseISO(value)
        if (!isNaN(d.getTime())) {
          setDate(d)
        }
      } catch {
        // Keep current internal date if external value is invalid
      }
    } else {
        setDate(undefined)
    }
  }, [value])

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (onChange) {
      if (newDate) {
        onChange(format(newDate, 'yyyy-MM-dd'))
      } else {
        onChange('')
      }
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-background border-border hover:bg-accent/50 transition-colors h-10",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[600]" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
