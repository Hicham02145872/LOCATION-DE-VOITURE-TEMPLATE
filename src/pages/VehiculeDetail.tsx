import { useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth"
import {
  Car,
  Users,
  Fuel,
  Star,
  ArrowRight,
  Check,
  Gauge,
  MapPin,
  Shield,
  Headphones,
  Sparkles,
  Infinity,
  Zap,
  Timer,
  ChevronLeft,
  Image as ImageIcon,
} from "lucide-react"
import { testimonials } from "@/data/cars"
import { useCar, useCars } from "@/hooks/useCars"
import { MobileNav } from "@/components/MobileNav"
import { DatePicker } from "@/components/DatePicker"
import { useToast } from "@/components/Toast"
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
  const [ville, setVille] = useState("Marrakech - Centre-ville")
  const [reserving, setReserving] = useState(false)
  const [reserveError, setReserveError] = useState("")
  const [reserved, setReserved] = useState(false)
  const [galIdx, setGalIdx] = useState(0)
  const { open: openAuth } = useAuthModal()
  const { toast } = useToast()
  const galleryRef = useRef<HTMLDivElement>(null)

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
      ville,
      status: "confirmed",
    })
    setReserving(false)
    if (error) { setReserveError(error.message); return }
    setReserved(true)
    toast(t("detail.reservationConfirmee"), "success")
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

  const whiteGlove = [
    { icon: Headphones, title: t("detail.conciergerie"), desc: t("detail.conciergerieDesc") },
    { icon: Shield, title: t("detail.assuranceTousRisques"), desc: t("detail.assuranceDesc") },
    { icon: Sparkles, title: t("detail.propreteGarantie"), desc: t("detail.propreteDesc") },
    { icon: Infinity, title: t("detail.kilometrageInclus"), desc: t("detail.kilometrageDesc") },
  ]

  const techSpecs = [
    { label: t("detail.chassis"), value: t("detail.chassisDesc") },
    { label: t("detail.drivetrain"), value: t("detail.drivetrainDesc") },
    { label: t("detail.securite"), value: t("detail.securiteDesc") },
  ]

  const hasMultipleImages = car.images.length > 1

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-border/40 bg-background/80 px-6 py-3 shadow-xs backdrop-blur-md sm:px-8">
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
        <MobileNav links={[
          { key: "accueil", href: "/" },
          { key: "vehicules", href: "/vehicules" },
          { key: "testimonials", href: "/#testimonials" },
          { key: "contact", href: "/#contact" },
        ]} />
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

      <section className="relative h-[75vh] min-h-[500px] w-full overflow-hidden">
        <img
          src={car.images[0]}
          alt={car.name}
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary/70 to-transparent p-8 sm:p-12">
          <div className="mx-auto max-w-7xl">
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              {car.badge}
            </p>
            <h1 className="max-w-2xl text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              {car.name}
            </h1>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
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

      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-8">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Timer, value: car.acceleration ?? "5.2s", label: "0-100 km/h" },
                  { icon: Zap, value: `${car.range_km ?? 600}km`, label: t("detail.autonomie") },
                  { icon: Gauge, value: car.top_speed ?? "220km/h", label: t("detail.vitesseMax") },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center justify-center rounded-xl border border-border/40 bg-card p-6 text-center shadow-sm">
                    <item.icon className="mb-2 text-2xl text-primary" />
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-xs uppercase text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight">{t("detail.description")}</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Découvrez la {car.name}, un véhicule {car.badge.toLowerCase()}{" "}
                  idéal pour vos déplacements. Avec ses {car.seats} places et sa
                  motorisation {car.fuel.toLowerCase()}, elle allie confort et
                  performance. Profitez de l'assurance tous risques incluse et
                  d'un service client disponible 24/7.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight">{t("detail.whiteGlove")}</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {whiteGlove.map((item) => (
                    <div key={item.title} className="flex gap-4 rounded-xl border border-border/40 bg-card p-5 shadow-sm transition-all hover:shadow-md">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {hasMultipleImages && (
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{t("detail.galerie")}</h2>
                  <div ref={galleryRef} className="mt-6 grid grid-cols-12 gap-3" style={{ height: 420 }}>
                    <div className="relative col-span-8 h-full overflow-hidden rounded-xl">
                      <img
                        src={car.images[galIdx]}
                        alt={`${car.name} - ${t("gallery.photo", { index: galIdx + 1 })}`}
                        className="h-full w-full object-cover transition-all duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="col-span-4 flex h-full flex-col gap-3">
                      {[1, 2].filter((i) => car.images[i]).map((i) => (
                        <button
                          key={i}
                          onClick={() => setGalIdx(i)}
                          className={`relative h-1/2 overflow-hidden rounded-xl transition-all hover:ring-2 hover:ring-primary/50 ${
                            galIdx === i ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={car.images[i]}
                            alt={`${car.name} - ${t("gallery.photo", { index: i + 1 })}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {car.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGalIdx(idx)}
                          className={`rounded-full transition-all ${
                            idx === galIdx ? "h-2 w-6 bg-primary" : "h-2 w-2 bg-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ImageIcon className="h-3.5 w-3.5" />
                      {galIdx + 1}/{car.images.length}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm">
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
                      <div className="mb-4 flex items-end justify-between">
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">{t("detail.aPartirDe")}</p>
                          <p className="text-3xl font-bold">{car.price}DH</p>
                          <p className="text-sm text-muted-foreground">{t("vehicules.parJour")}</p>
                        </div>
                        <Badge className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {t("detail.disponible")}
                        </Badge>
                      </div>
                      <Separator className="mb-4 bg-border/30" />
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">{t("hero.search.lieu")}</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <select
                              value={ville}
                              onChange={(e) => setVille(e.target.value)}
                              className="w-full rounded-lg border border-border/50 bg-background py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                              <option>Marrakech - Centre-ville</option>
                              <option>Casablanca - Quartier des affaires</option>
                              <option>Rabat - Centre administratif</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">{t("hero.search.debut")}</label>
                            <DatePicker value={startDate} onChange={setStartDate} placeholder={t("hero.search.debut")} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">{t("hero.search.fin")}</label>
                            <DatePicker value={endDate} onChange={setEndDate} placeholder={t("hero.search.fin")} />
                          </div>
                        </div>
                      </div>
                      <Separator className="my-4 bg-border/30" />
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">{t("detail.telephone")}</label>
                          <Input
                            type="tel"
                            placeholder={t("detail.telephonePlaceholder")}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="h-10 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">{t("detail.emailOptionnel")}</label>
                          <Input
                            type="email"
                            placeholder={t("detail.emailPlaceholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-10 rounded-lg"
                          />
                        </div>
                      </div>
                      {days > 0 && (
                        <div className="mt-4 rounded-lg bg-muted/50 p-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {car.price}DH × {days}{" "}
                              {days > 1
                                ? t("dashboard.reservations.jours")
                                : t("dashboard.reservations.jour")}
                            </span>
                            <span>{car.price * days}DH</span>
                          </div>
                          <Separator className="my-2 bg-border/30" />
                          <div className="flex justify-between font-semibold">
                            <span>{t("detail.total")}</span>
                            <span className="text-lg">{total}DH</span>
                          </div>
                        </div>
                      )}
                      {reserveError && (
                        <p className="mt-2 text-xs text-destructive">{reserveError}</p>
                      )}
                      <Button
                        className="mt-4 w-full rounded-lg bg-primary text-sm font-semibold shadow-sm transition-all hover:bg-primary/90"
                        size="lg"
                        disabled={!startDate || !endDate || days <= 0 || reserving}
                        onClick={handleReserve}
                      >
                        {reserving
                          ? t("detail.reservationEnCours")
                          : t("detail.reserverMaintenant")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5" />
                          {t("detail.pasFraisCaches")}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="rounded-xl border border-border/40 bg-card p-5 shadow-sm text-center">
                  <p className="mb-3 text-xs uppercase text-muted-foreground">{t("detail.partenaires")}</p>
                  <div className="flex items-center justify-around gap-4 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                    <span className="text-lg font-bold">TESLA</span>
                    <span className="text-lg font-bold">BMW</span>
                    <span className="text-lg font-bold">MERCEDES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t("detail.excellenceTechnique")}</h2>
              <p className="mt-3 text-white/60">{t("detail.excellenceDesc")}</p>
              <div className="mt-8 space-y-6 border-l-2 border-secondary pl-8">
                {techSpecs.map((spec) => (
                  <div key={spec.label}>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary">{spec.label}</h4>
                    <p className="mt-1 text-white/80">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[350px] overflow-hidden rounded-xl">
              <img
                src={car.images[Math.min(1, car.images.length - 1)]}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm">
                  <p className="text-3xl font-bold">15 min</p>
                  <p className="text-xs uppercase text-white/70">{t("detail.recharge")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">{t("detail.ceQueDisentClients")}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {testimonials.slice(0, 2).map((item) => (
              <Card key={item.name} className="rounded-xl border-border/40 shadow-sm transition-all hover:shadow-md">
                <CardContent className="p-6">
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
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{item.text}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
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
      </section>

      {related.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight">{t("detail.autresVehicules")}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} to={`/vehicules/${r.slug}`}>
                  <Card className="group overflow-hidden rounded-xl border-border/40 pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                    <CardContent className="p-0">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={r.images[0]}
                          alt={r.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="space-y-2 p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{r.name}</h3>
                          <span className="text-lg font-bold tracking-tight">{r.price}DH</span>
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
