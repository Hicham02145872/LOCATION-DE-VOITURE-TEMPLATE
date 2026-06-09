import { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"
import {
  startOfMonth,
  endOfMonth,
  startOfDay,
  differenceInDays,
  addMonths,
  subMonths,
  format,
  isSameDay,
  parseISO,
} from "date-fns"
import { fr } from "date-fns/locale"
import {
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  X,
  Phone,
  Mail,
  Calendar,
  MapPin,
  User,
} from "lucide-react"

interface Reservation {
  id: string
  car_slug: string
  start_date: string
  end_date: string
  status: string
  user_id: string
  email: string | null
  phone: string
  ville: string | null
  cars: { name: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: "#3b82f6",
  completed: "#10b981",
  cancelled: "#ef444480",
  pending: "#f59e0b",
}

const DAY_COLS_CLASS = "minmax(36px,1fr)"

function DashboardReservations() {
  const { t, i18n } = useTranslation()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  const locale = i18n.language === "fr" ? fr : undefined

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase
      .from("reservations")
      .select("*, cars(name)")
      .order("start_date", { ascending: true })
      .then(({ data }) => {
        if (data) setReservations(data as unknown as Reservation[])
        setLoading(false)
      })
  }, [])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const totalDays = differenceInDays(monthEnd, monthStart) + 1

  const dayHeaders = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(monthStart)
    d.setDate(d.getDate() + i)
    return d
  })

  const filtered = useMemo(() => {
    let list = reservations
    if (statusFilter !== "all") {
      list = list.filter((r) => r.status === statusFilter)
    }
    return list.filter((r) => {
      const s = startOfDay(parseISO(r.start_date))
      const e = startOfDay(parseISO(r.end_date))
      return s <= monthEnd && e >= monthStart
    })
  }, [reservations, statusFilter, monthStart, monthEnd])

  const today = startOfDay(new Date())
  const todayIndex = differenceInDays(today, monthStart)

  const statusVariant = (s: string) => {
    if (s === "confirmed") return "secondary" as const
    if (s === "completed") return "outline" as const
    if (s === "cancelled") return "destructive" as const
    return "default" as const
  }

  const statusLabel = (s: string) => {
    if (s === "confirmed") return t("dashboard.reservations.confirmee")
    if (s === "completed") return t("dashboard.reservations.terminee")
    if (s === "cancelled") return t("dashboard.reservations.annulee")
    return s
  }

  const gridCols = `200px repeat(${totalDays}, ${DAY_COLS_CLASS})`

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.reservations.title")}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t("dashboard.reservations.desc")}</p>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth((m) => subMonths(m, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="min-w-[180px] text-center text-base font-semibold tabular-nums">
                {format(currentMonth, "MMMM yyyy", { locale })}
              </CardTitle>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth((m) => addMonths(m, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setCurrentMonth(startOfMonth(new Date()))}>
                {t("dashboard.reservations.aujourdhui")}
              </Button>
            </div>
            <div className="flex gap-1">
              {["all", "confirmed", "completed", "cancelled"].map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "ghost"}
                  size="sm"
                  className="h-8 rounded-lg px-3 text-xs"
                  onClick={() => setStatusFilter(s)}
                >
                  {s === "all"
                    ? t("dashboard.reservations.tous")
                    : statusLabel(s)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <CalendarCheck className="h-12 w-12 text-muted-foreground/30" />
              <p className="font-medium">{t("dashboard.reservations.aucune")}</p>
              <p className="text-sm text-muted-foreground">{t("dashboard.reservations.aucuneDesc")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Header row */}
                <div
                  className="sticky top-0 z-10 grid border-b bg-background text-xs"
                  style={{ gridTemplateColumns: gridCols }}
                >
                  <div className="border-r px-3 py-2 font-medium text-muted-foreground">
                    {t("dashboard.reservations.vehicule")}
                  </div>
                  {dayHeaders.map((d, i) => (
                    <div
                      key={i}
                      className={`border-r px-1 py-2 text-center ${
                        isSameDay(d, today)
                          ? "bg-primary/10 font-bold text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <div>{format(d, "EEE", { locale }).slice(0, 2)}</div>
                      <div className="mt-0.5">{format(d, "d")}</div>
                    </div>
                  ))}
                </div>

                {/* Reservation rows */}
                <div className="divide-y">
                  {filtered.map((r) => {
                    const start = startOfDay(parseISO(r.start_date))
                    const end = startOfDay(parseISO(r.end_date))
                    const barStart = Math.max(0, differenceInDays(start, monthStart))
                    const barEnd = Math.min(totalDays - 1, differenceInDays(end, monthStart))
                    const barWidth = barEnd - barStart + 1

                    return (
                      <div
                        key={r.id}
                        className="group grid min-h-[52px] transition-colors hover:bg-muted/20"
                        style={{ gridTemplateColumns: gridCols }}
                      >
                        {/* Car info */}
                        <div className="flex items-center gap-2 border-r px-3 py-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {r.cars?.name ?? r.car_slug}
                            </p>
                            <Badge
                              variant={statusVariant(r.status)}
                              className="mt-0.5 rounded-full text-[10px] leading-none"
                            >
                              {statusLabel(r.status)}
                            </Badge>
                          </div>
                        </div>

                        {/* Timeline area */}
                        <div
                          className="relative"
                          style={{ gridColumn: `2 / span ${totalDays}` }}
                        >
                          {/* Day separators */}
                          <div
                            className="absolute inset-0 grid"
                            style={{ gridTemplateColumns: `repeat(${totalDays}, ${DAY_COLS_CLASS})` }}
                          >
                            {dayHeaders.map((_, i) => (
                              <div key={i} className="border-r border-border/20" />
                            ))}
                          </div>

                          {/* Today line */}
                          {isSameDay(monthStart, today) && (
                            <div
                              className="absolute inset-y-0 w-0.5 bg-primary/60 z-20"
                              style={{
                                left: `calc(${((todayIndex + 0.5) / totalDays) * 100}%)`,
                              }}
                            />
                          )}

                          {/* Bar */}
                          <button
                            type="button"
                            onClick={() => setSelectedReservation(r)}
                            className="absolute top-1/2 z-10 flex h-7 -translate-y-1/2 cursor-pointer items-center overflow-hidden rounded-md px-2 text-xs font-medium text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.97]"
                            style={{
                              left: `${(barStart / totalDays) * 100}%`,
                              width: `${(barWidth / totalDays) * 100}%`,
                              minWidth: barWidth === 1 ? "20px" : "40px",
                              backgroundColor: STATUS_COLORS[r.status] ?? "#6b7280",
                            }}
                            title={`${r.cars?.name ?? r.car_slug} — ${format(start, "dd/MM")} au ${format(end, "dd/MM")}`}
                          >
                            <span className="truncate leading-none">
                              {r.cars?.name ?? r.car_slug}
                            </span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail modal */}
      {selectedReservation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setSelectedReservation(null)}
        >
          <Card
            className="relative w-full max-w-md mx-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-7 w-7 rounded-full"
              onClick={() => setSelectedReservation(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base">
                    {selectedReservation.cars?.name ?? selectedReservation.car_slug}
                  </CardTitle>
                  <Badge
                    variant={statusVariant(selectedReservation.status)}
                    className="mt-1 rounded-full text-[10px] leading-none"
                  >
                    {statusLabel(selectedReservation.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>
                    {format(parseISO(selectedReservation.start_date), "dd MMM yyyy")}
                    {" — "}
                    {format(parseISO(selectedReservation.end_date), "dd MMM yyyy")}
                  </span>
                </div>
                <Separator />
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium">{selectedReservation.ville || "—"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium">{selectedReservation.phone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium break-all">{selectedReservation.email || "—"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default DashboardReservations
