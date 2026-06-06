import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth"
import {
  Car,
  Users,
  Fuel,
  Snowflake,
  Star,
  ArrowRight,
  Check,
  Gauge,
  MapPin,
  Calendar,
} from "lucide-react"
import { testimonials, features } from "@/data/cars"
import { useCar, useCars } from "@/hooks/useCars"
import { CarGallery } from "@/components/CarGallery"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useAuthModal } from "@/lib/auth-modal"

function VehiculeDetail() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const { user } = useAuth()
  const { car, loading } = useCar(slug)
  const { cars: relatedCars } = useCars()
  const related = relatedCars.filter((c) => c.slug !== slug).slice(0, 3)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState(user?.email ?? "")
  const [reserving, setReserving] = useState(false)
  const [reserveError, setReserveError] = useState("")
  const [reserved, setReserved] = useState(false)
  const { open: openAuth } = useAuthModal()

  const start = startDate ? new Date(startDate) : null
  const end = endDate ? new Date(endDate) : null
  const days = start && end ? Math.max(0, Math.ceil((end.getTime() - start.getTime()) / 86400000)) : 0
  const total = car ? car.price * days : 0

  const handleReserve = async () => {
    if (!startDate || !endDate) return
    if (days <= 0) { setReserveError(t("detail.dateFinError")); return }
    if (!phone.trim()) { setReserveError(t("detail.telephoneRequis")); return }
    setReserveError("")
    if (!supabase) { setReserveError(t("detail.baseDonneesError")); return }
    setReserving(true)
    const { error } = await supabase.from("reservations").insert({
      user_id: user?.id ?? null,
      car_slug: slug,
      start_date: startDate,
      end_date: endDate,
      phone: phone.trim(),
      email: email.trim() || null,
      status: "confirmed",
    })
    setReserving(false)
    if (error) { setReserveError(error.message); return }
    setReserved(true)
  }

  if (!car) {
    if (loading) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <Car className="h-16 w-16 text-muted-foreground/30 animate-pulse" />
          <p className="text-muted-foreground">{t("detail.chargement")}</p>
        </div>
      )
    }
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Car className="h-16 w-16 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold">{t("detail.introuvable")}</h1>
        <p className="text-muted-foreground">
          {t("detail.introuvableDesc")}
        </p>
        <Link to="/vehicules">
          <Button variant="outline" className="rounded-lg">
            {t("detail.voirTout")}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-border/40 bg-background/70 px-6 py-3 shadow-xs backdrop-blur-xl sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Car className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight">{t("app.name")}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { key: "vehicules", href: "/vehicules" },
            { key: "tarifs", href: "/#tarifs" },
            { key: "agences", href: "/#contact" },
            { key: "contact", href: "/#contact" },
          ].map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
            onClick={() => openAuth("login")}
          >
            {t("nav.connexion")}
          </Button>
          <Link to="/vehicules">
            <Button size="sm" className="rounded-lg">
              {t("nav.reserver")}
            </Button>
          </Link>
        </div>
      </header>

      <section className="pt-16">
        <CarGallery
          images={car.images}
          name={car.name}
          badge={car.badge}
          fuel={car.fuel}
          price={car.price}
        />
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-xl font-semibold">{t("detail.caracteristiques")}</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { icon: Users, label: `${car.seats} ${t("vehicules.places")}` },
                    { icon: Fuel, label: car.fuel },
                    { icon: Snowflake, label: t("vehicules.climatisation") },
                    { icon: Gauge, label: t("detail.boiteAuto") },
                    { icon: MapPin, label: t("detail.gpsInclus") },
                    { icon: Calendar, label: t("detail.annulationJ2") },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-muted/30 px-4 py-3"
                    >
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold">{t("detail.description")}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Découvrez la {car.name}, un véhicule {car.badge.toLowerCase()}{" "}
                  idéal pour vos déplacements. Avec ses {car.seats} places et sa
                  motorisation {car.fuel.toLowerCase()}, elle allie confort et
                  performance. Profitez de {t("detail.assuranceTousRisques").toLowerCase()} incluse et
                  d'un service client disponible 24/7.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  {t("detail.ceQuiEstInclus")}
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    "detail.assuranceTousRisques",
                    "detail.kilometrageInclus",
                    "detail.gpsIntegre",
                    "detail.support247",
                    "detail.annulationGratuite",
                    "detail.propreteGarantie",
                  ].map((key) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{t(key)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div>
                <h2 className="text-xl font-semibold">{t("detail.ceQueDisentClients")}</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {testimonials.slice(0, 2).map((t) => (
                    <Card key={t.name} className="border-border/50">
                      <CardContent className="p-5">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < t.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          "{t.text}"
                        </p>
                        <div className="mt-4 flex items-center gap-2.5">
                          <Avatar size="sm">
                            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                              {t.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{t.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {t.role}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-border/50 sticky top-28">
                <CardContent className="p-6 space-y-5">
                  {reserved ? (
                    <div className="space-y-3 py-4 text-center">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                        <Check className="h-6 w-6 text-emerald-600" />
                      </div>
                      <p className="font-semibold">{t("detail.reservationConfirmee")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("detail.reservationDesc", { carName: car.name, start: new Date(startDate).toLocaleDateString("fr-FR"), end: new Date(endDate).toLocaleDateString("fr-FR") })}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="text-3xl font-bold">{car.price}DH</div>
                        <div className="text-sm text-muted-foreground">
                          {t("vehicules.parJour")} · {car.price * 7}DH / 7 {t("dashboard.reservations.jours")}
                        </div>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">{t("hero.search.debut")}</label>
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="h-8 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">{t("hero.search.fin")}</label>
                          <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || new Date().toISOString().split("T")[0]}
                            className="h-8 rounded-lg"
                          />
                        </div>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">
                            {t("detail.telephone")}
                          </label>
                          <Input
                            type="tel"
                            placeholder={t("detail.telephonePlaceholder")}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="h-8 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">{t("detail.emailOptionnel")}</label>
                          <Input
                            type="email"
                            placeholder={t("detail.emailPlaceholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-8 rounded-lg"
                          />
                        </div>
                      </div>
                      {days > 0 && (
                        <div className="rounded-lg bg-muted/50 p-3 text-sm">
                          <div className="flex justify-between">
                            <span>{car.price}DH × {days} {days > 1 ? t("dashboard.reservations.jours") : t("dashboard.reservations.jour")}</span>
                            <span>{total}DH</span>
                          </div>
                          <Separator className="my-2 bg-border/50" />
                          <div className="flex justify-between font-semibold">
                            <span>{t("detail.total")}</span>
                            <span>{total}DH</span>
                          </div>
                        </div>
                      )}
                      {reserveError && (
                        <p className="text-xs text-destructive">{reserveError}</p>
                      )}
                      <Button
                        className="w-full rounded-lg"
                        size="lg"
                        disabled={!startDate || !endDate || days <= 0 || reserving}
                        onClick={handleReserve}
                      >
                        {reserving ? t("detail.reservationEnCours") : t("detail.reserverMaintenant")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        {t("detail.pasFraisCaches")}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="rounded-xl border border-border/50 p-5">
                <h3 className="text-sm font-semibold">
                  {t("detail.pourquoiReserver")}
                </h3>
                <div className="mt-4 space-y-3">
                  {features.slice(0, 3).map((f) => (
                    <div key={f.title} className="flex items-start gap-2.5">
                      <div
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${f.gradient} ${f.iconColor}`}
                      >
                        <f.icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{f.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {f.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight">
            {t("detail.autresVehicules")}
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} to={`/vehicules/${r.slug}`}>
                  <Card className="group overflow-hidden border-border/50 pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                    <CardContent className="p-0">
                      <div
                        className={`bg-gradient-to-br ${r.gradient} bg-cover bg-center h-48 transition-transform duration-300 group-hover:scale-105`}
                        style={{ backgroundImage: `url(${r.image})` }}
                      />
                      <div className="space-y-2 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{r.name}</h3>
                          <span className="text-lg font-bold">{r.price}DH</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{r.seats} {t("vehicules.places")}</span>
                          <span>{r.fuel}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
                <Car className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-base font-bold">{t("app.name")}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {t("app.name")}. {t("footer.droits")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default VehiculeDetail
