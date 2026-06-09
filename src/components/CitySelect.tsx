import { useState, useRef, useEffect } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { villes } from "@/data/villes"

interface CitySelectProps {
  value: string
  onChange: (value: string) => void
}

export function CitySelect({ value, onChange }: CitySelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  const filtered = query.trim()
    ? villes.filter((v) => v.toLowerCase().includes(query.toLowerCase()))
    : villes

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
        role="combobox"
        aria-expanded={open}
        onClick={() => { setOpen(!open); setQuery("") }}
        className="h-8 w-full justify-between rounded-lg font-normal"
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {value || "Sélectionner une ville"}
        </span>
        <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </Button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-xl border bg-background shadow-xl">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              className="border-none bg-transparent p-0 py-2.5 text-sm shadow-none focus-visible:ring-0"
              placeholder="Rechercher une ville..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-sm text-muted-foreground">Aucune ville trouvée</div>
            ) : (
              filtered.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => { onChange(city); setOpen(false) }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                    city === value && "bg-muted/50 font-medium"
                  )}
                >
                  <Check className={cn("h-4 w-4", city === value ? "opacity-100" : "opacity-0")} />
                  {city}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
