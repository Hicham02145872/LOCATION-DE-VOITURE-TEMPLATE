import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CarCardSkeleton } from "@/components/CarCardSkeleton"
import { Plus, Pencil, Trash2, Car, Search, Users, Gauge } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Car as CarType } from "@/data/cars"

function DashboardCars() {
  const { t } = useTranslation()
  const [cars, setCars] = useState<CarType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchCars = async () => {
    if (!supabase) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from("cars").select("*").order("name")
    if (data) setCars(data as unknown as CarType[])
    setLoading(false)
  }

  useEffect(() => {
    fetchCars()
  }, [])

  const handleDelete = async (slug: string) => {
    if (!supabase || !confirm(t("dashboard.cars.supprimerConfirm"))) return
    const { error } = await supabase.from("cars").delete().eq("slug", slug)
    if (!error) {
      setCars((prev) => prev.filter((c) => c.slug !== slug))
    }
  }

  const filtered = cars.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.badge.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.cars.title")}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {t("dashboard.cars.desc")}
          </p>
        </div>
        <Link to="/dashboard/cars/new">
          <Button className="rounded-lg">
            <Plus className="mr-1.5 h-4 w-4" />
            {t("dashboard.cars.ajouter")}
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("dashboard.cars.rechercher")}
          className="h-9 rounded-lg pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <CarCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16">
            <Car className="h-12 w-12 text-muted-foreground/30" />
            <p className="font-medium">
              {search ? `${t("dashboard.cars.aucunResultat")} "${search}"` : t("dashboard.cars.aucunVehicule")}
            </p>
            <p className="text-sm text-muted-foreground">
              {search
                ? t("dashboard.cars.essayezAutre")
                : t("dashboard.cars.ajoutezPremier")
              }
            </p>
            {!search && (
              <Link to="/dashboard/cars/new">
                <Button size="sm" className="rounded-lg">
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  {t("dashboard.cars.ajouter")}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((car) => (
            <Card key={car.slug} className="overflow-hidden group">
              <div className="relative h-40 bg-muted">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${car.image})` }}
                />
                <div className="absolute right-2 top-2">
                  <Badge variant="secondary" className="rounded-full text-xs bg-background/80 backdrop-blur-sm">
                    {car.badge}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-white">{car.price}DH</span>
                  <span className="text-xs text-white/80">{t("vehicules.parJour")}</span>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="mb-2">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold leading-tight">{car.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{car.slug}</p>
                </div>
                <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {car.seats} {t("vehicules.places")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Gauge className="h-3 w-3" />
                    {car.fuel}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <Link to={`/dashboard/cars/${car.slug}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full rounded-lg">
                      <Pencil className="mr-1 h-3 w-3" />
                      {t("dashboard.cars.modifier")}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-destructive hover:text-destructive"
                    onClick={() => handleDelete(car.slug)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardCars
