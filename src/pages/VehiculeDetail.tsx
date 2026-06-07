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
  Shield,
  Headphones,
  CreditCard,
  Sparkles,
  ChevronLeft,
  Infinity,
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
          <Car className="h-16 w-16 animate-pulse text-muted-foreground/30" />
          <p className="text-muted-foreground">{t("detail.chargement")}</p>
        </div>
      )
    }
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Car className="h-16 w-16 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold">{t("detail.introuvable")}</h1>
        <p className="text-muted-foreground">{t("detail.introuvableDesc")}</p>
        <Link to="/vehicules">
          <Button variant="outline" className="rounded-xl">
            {t("detail.voirTout")}
          </Button>
        </Link>
      </div>
    )
  }

  const specs = [
    { icon: Users, label: `${car.seats} ${t("vehicules.places")}` },
    { icon: Fuel, label: car.fuel },
    { icon: Snowflake, label: t("vehicules.climatisation") },
    { icon: Gauge, label: t("detail.boiteAuto") },
  ]

  const included = [
    { key: "detail.assuranceTousRisques", icon: Shield },
    { key: "detail.kilometrageInclus", icon: Infinity },
    { key: "detail.gpsIntegre", icon: MapPin },
    { key: "detail.support247", icon: Headphones },
    { key: "detail.annulationGratuite", icon: Calendar },
    { key: "detail.propreteGarantie", icon: Sparkles },
  ]

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
            { key: "accueil", href: "/" },
            { key: "vehicules", href: "/vehicules" },
            { key: "testimonials", href: "/#testimonials" },
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            {t("nav.accueil")}
          </Link>
          <ChevronLeft className="h-3 w-3 rotate-180" />
          <Link to="/vehicules" className="transition-colors hover:text-foreground">
            {t("nav.vehicules")}
          </Link>
          <ChevronLeft className="h-3 w-3 rotate-180" />
          <span className="text-foreground">{car.name}</span>
        </div>
      </div>

      <section className="pb-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="hidden items-end justify-between lg:flex">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-border/40 bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground">
                  {car.badge}
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                  {car.fuel}
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {car.name}
              </h1>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold tracking-tight sm:text-4xl">
                {car.price}DH
              </div>
              <div className="text-sm text-muted-foreground">
                {t("vehicules.parJour")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-12 lg:col-span-2">
              {/* Key Specs */}
              <div>
                <h2 className="text-lg font-semibold">{t("detail.caracteristiques")}</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {specs.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl border border-border/40 bg-background p-4 shadow-sm transition-all hover:border-border/60 hover:shadow-md"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold">{t("detail.description")}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Découvrez la {car.name}, un véhicule {car.badge.toLowerCase()}{" "}
                  idéal pour vos déplacements. Avec ses {car.seats} places et sa
                  motorisation {car.fuel.toLowerCase()}, elle allie confort et
                  performance. Profitez de l'assurance tous risques incluse et
                  d'un service client disponible 24/7.
                </p>
              </div>

              {/* What's included */}
              <div>
                <h2 className="text-lg font-semibold">{t("detail.ceQuiEstInclus")}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {included.map(({ key, icon: Icon }) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 rounded-xl border border-border/40 bg-background p-3.5 shadow-sm transition-all hover:border-border/60 hover:shadow-md"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-muted-foreground">{t(key)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Testimonials */}
              <div>
                <h2 className="text-lg font-semibold">{t("detail.ceQueDisentClients")}</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {testimonials.slice(0, 2).map((item) => (
                    <Card
                      key={item.name}
                      className="rounded-2xl border-border/40 shadow-sm transition-all hover:shadow-md"
                    >
                      <CardContent className="p-5">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < item.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          &ldquo;{item.text}&rdquo;
                        </p>
                        <div className="mt-4 flex items-center gap-2.5">
                          <Avatar size="sm">
                            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary shadow-sm">
                              {item.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.role}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="space-y-6">
              <Card className="sticky top-28 rounded-2xl border-border/40 shadow-sm transition-all hover:shadow-md">
                <CardContent className="space-y-5 p-6">
                  {reserved ? (
                    <div className="space-y-3 py-4 text-center">
                      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 shadow-sm">
                        <Check className="h-6 w-6 text-emerald-600" />
                      </div>
                      <p className="font-semibold">{t("detail.reservationConfirmee")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("detail.reservationDesc", {
                          carName: car.name,
                          start: new Date(startDate).toLocaleDateString("fr-FR"),
                          end: new Date(endDate).toLocaleDateString("fr-FR"),
                        })}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-3xl font-bold tracking-tight">
                            {car.price}DH
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("vehicules.parJour")}
                          </div>
                        </div>
                        <div className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary shadow-sm">
                          -20% {t("hero.search.premium")}
                        </div>
                      </div>
                      <Separator className="bg-border/30" />
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">
                            {t("hero.search.debut")}
                          </label>
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="h-9 rounded-xl"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">
                            {t("hero.search.fin")}
                          </label>
                          <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || new Date().toISOString().split("T")[0]}
                            className="h-9 rounded-xl"
                          />
                        </div>
                      </div>
                      <Separator className="bg-border/30" />
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
                            className="h-9 rounded-xl"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">
                            {t("detail.emailOptionnel")}
                          </label>
                          <Input
                            type="email"
                            placeholder={t("detail.emailPlaceholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-9 rounded-xl"
                          />
                        </div>
                      </div>
                      {days > 0 && (
                        <div className="rounded-xl bg-muted/50 p-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {car.price}DH × {days}{" "}
                              {days > 1
                                ? t("dashboard.reservations.jours")
                                : t("dashboard.reservations.jour")}
                            </span>
                            <span>{car.price * days}DH</span>
                          </div>
                          <Separator className="my-2.5 bg-border/30" />
                          <div className="flex justify-between font-semibold">
                            <span>{t("detail.total")}</span>
                            <span className="text-lg">{total}DH</span>
                          </div>
                        </div>
                      )}
                      {reserveError && (
                        <p className="text-xs text-destructive">{reserveError}</p>
                      )}
                      <Button
                        className="w-full rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                        size="lg"
                        disabled={!startDate || !endDate || days <= 0 || reserving}
                        onClick={handleReserve}
                      >
                        {reserving
                          ? t("detail.reservationEnCours")
                          : t("detail.reserverMaintenant")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5" />
                          {t("detail.pasFraisCaches")}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5" />
                          Paiement sécurisé
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Why book with us */}
              <div className="rounded-2xl border border-border/40 bg-background p-5 shadow-sm transition-all hover:shadow-md">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Shield className="h-4 w-4 text-primary" />
                  {t("detail.pourquoiReserver")}
                </h3>
                <div className="mt-4 space-y-3">
                  {features.slice(0, 3).map((f) => (
                    <div key={f.title} className="flex items-start gap-3">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm ${f.gradient} ${f.iconColor}`}
                      >
                        <f.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{f.title}</div>
                        <div className="text-xs leading-relaxed text-muted-foreground">
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
            <h2 className="text-2xl font-bold tracking-tight">{t("detail.autresVehicules")}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} to={`/vehicules/${r.slug}`}>
                  <Card className="group overflow-hidden rounded-2xl border-border/40 pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
                    <CardContent className="p-0">
                      <div
                        className={`bg-gradient-to-br ${r.gradient} h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105`}
                        style={{ backgroundImage: `url(${r.image})` }}
                      />
                      <div className="space-y-2 p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{r.name}</h3>
                          <span className="text-lg font-bold tracking-tight">
                            {r.price}DH
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {r.seats} {t("vehicules.places")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Fuel className="h-3 w-3" />
                            {r.fuel}
                          </span>
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
