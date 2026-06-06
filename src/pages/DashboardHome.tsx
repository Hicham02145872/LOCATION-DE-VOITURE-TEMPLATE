import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import {
  startOfMonth,
  parseISO,
  differenceInDays,
  format,
} from "date-fns"
import { fr } from "date-fns/locale"
import { Car, CalendarCheck, Euro, TrendingUp, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

interface ReservationWithCar {
  id: string
  car_slug: string
  start_date: string
  end_date: string
  status: string
  cars: { name: string; price: number } | null
}

function DashboardHome() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === "fr" ? fr : undefined

  const [loading, setLoading] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [reservationCount, setReservationCount] = useState(0)
  const [thisMonthCount, setThisMonthCount] = useState(0)
  const [lastMonthCount, setLastMonthCount] = useState(0)
  const [carCount, setCarCount] = useState(0)
  const [recentReservations, setRecentReservations] = useState<ReservationWithCar[]>([])

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    const now = new Date()
    const thisMonthStart = startOfMonth(now)
    const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1))
    const lastMonthEnd = startOfMonth(now)

    Promise.all([
      supabase.from("reservations").select("*, cars(name, price)"),
      supabase.from("cars").select("id", { count: "exact", head: true }),
    ]).then(([res, carsRes]) => {
      const data = (res.data ?? []) as unknown as ReservationWithCar[]
      const totalCars = carsRes.count ?? 0

      setCarCount(totalCars)

      let revenue = 0
      let thisMonth = 0
      let lastMonth = 0

      for (const r of data) {
        const start = startOfMonth(parseISO(r.start_date))
        const days = Math.max(1, differenceInDays(parseISO(r.end_date), parseISO(r.start_date)))
        const price = r.cars?.price ?? 0
        revenue += price * days

        if (start >= thisMonthStart) thisMonth++
        else if (start >= lastMonthStart && start < lastMonthEnd) lastMonth++
      }

      setTotalRevenue(revenue)
      setReservationCount(data.length)
      setThisMonthCount(thisMonth)
      setLastMonthCount(lastMonth)

      const sorted = [...data].sort(
        (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      )
      setRecentReservations(sorted.slice(0, 5))

      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const growth = lastMonthCount > 0
    ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100)
    : thisMonthCount > 0 ? 100 : 0

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

  const formatRevenue = (n: number) =>
    new Intl.NumberFormat("fr-FR").format(n) + " DH"

  const cards = [
    {
      titleKey: "dashboard.home.revenuTotal",
      value: formatRevenue(totalRevenue),
      change: `${growth > 0 ? "+" : ""}${growth}%`,
      trend: growth >= 0 ? "up" : "down",
      descKey: "dashboard.home.hausseDesc",
      icon: Euro,
    },
    {
      titleKey: "dashboard.home.reservations",
      value: String(reservationCount),
      change: String(thisMonthCount),
      trend: "neutral",
      descKey: "dashboard.home.reservationsDesc",
      icon: CalendarCheck,
    },
    {
      titleKey: "dashboard.home.vehiculesActifs",
      value: String(carCount),
      change: String(carCount),
      trend: "up",
      descKey: "dashboard.home.flotteDisponible",
      icon: Car,
    },
    {
      titleKey: "dashboard.home.croissance",
      value: `${growth}%`,
      change: `${growth > 0 ? "+" : ""}${growth}%`,
      trend: growth >= 0 ? "up" : "down",
      descKey: "dashboard.home.performanceStable",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat) => (
          <Card key={stat.titleKey}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t(stat.titleKey)}
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-7 w-20 animate-pulse rounded bg-muted" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                {!loading && (
                  <Badge
                    variant={stat.trend === "up" ? "secondary" : "outline"}
                    className={`h-5 rounded-sm px-1 text-[10px] font-medium ${
                      stat.trend === "up"
                        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                        : stat.trend === "down"
                          ? "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400"
                          : ""
                    }`}
                  >
                    {stat.change}
                  </Badge>
                )}
                <span>{t(stat.descKey)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{t("dashboard.home.apercuReservations")}</CardTitle>
          <Link
            to="/dashboard/reservations"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {t("dashboard.sidebar.reservations")}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : recentReservations.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <CalendarCheck className="h-12 w-12 text-muted-foreground/30" />
              <p className="font-medium">{t("dashboard.home.aucuneReservation")}</p>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.home.aucuneReservationDesc")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentReservations.map((r) => {
                const start = parseISO(r.start_date)
                const end = parseISO(r.end_date)
                const days = Math.max(1, differenceInDays(end, start))
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {r.cars?.name ?? r.car_slug}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {format(start, "dd MMM", { locale })} — {format(end, "dd MMM", { locale })}
                        <span className="ml-1">({days}j)</span>
                      </p>
                    </div>
                    <Badge
                      variant={statusVariant(r.status)}
                      className="ml-3 shrink-0 rounded-full text-[10px] leading-none"
                    >
                      {statusLabel(r.status)}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardHome
