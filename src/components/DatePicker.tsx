import { useState, useRef, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useTranslation } from "react-i18next"

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, placeholder, className }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { i18n } = useTranslation()
  const locale = i18n.language === "fr" ? fr : undefined

  const selected = value ? new Date(value) : undefined

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(!open)}
        className={cn(
          "h-9 w-full justify-start rounded-xl text-left font-normal",
          !selected && "text-muted-foreground",
          className
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        {selected ? format(selected, "dd MMM yyyy", { locale }) : (placeholder || "Sélectionner")}
      </Button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 rounded-xl border bg-background p-2 shadow-xl">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(d) => {
              if (d) {
                onChange(format(d, "yyyy-MM-dd"))
                setOpen(false)
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
