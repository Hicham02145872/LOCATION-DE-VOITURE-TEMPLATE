import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Car,
  Search,
  ArrowRight,
  Users,
  Fuel,
  Snowflake,
  SlidersHorizontal,
  Info,
  MapPin,
} from "lucide-react"
import { useCars } from "@/hooks/useCars"
import { CarCardSkeleton } from "@/components/CarCardSkeleton"
import { MobileNav } from "@/components/MobileNav"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useAuthModal } from "@/lib/auth-modal"

function Vehicules() {
  const { cars, loading } = useCars()
  const { open: openAuth } = useAuthModal()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [type, setType] = useState(searchParams.get("type") ?? "all")

  const filtered = cars.filter((c) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.badge.toLowerCase().includes(q) ||
      c.fuel.toLowerCase().includes(q) ||
      (c.ville && c.ville.toLowerCase().includes(q))
    const matchesType = type === "all" || c.badge === type
    return matchesSearch && matchesType
  })

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
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${
                link.key === "vehicules"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
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

      <main className="min-h-screen">
        <section className="relative flex h-[340px] items-center overflow-hidden bg-primary/90 sm:h-[400px]">
          <div className="absolute inset-0 opacity-30">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070"
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("vehicules.tousNosVehicules")}
            </h1>
            <p className="mt-2 max-w-2xl text-lg text-white/70">
              {t("vehicules.disponibles")} — {cars.length} {t("stats.vehicules")}
            </p>
          </div>
        </section>

        <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-10 rounded-xl border border-border/30 bg-background/80 p-4 shadow-lg backdrop-blur-xl sm:p-6">
            <div className="grid items-end gap-4 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("vehicules.rechercher")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="rounded-lg pl-9"
                    placeholder={t("vehicules.rechercher")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("hero.search.type")}
                </label>
                <Select value={type} onValueChange={(v) => setType(v ?? "all")}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder={t("hero.search.tousTypes")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("hero.search.tousTypes")}</SelectItem>
                    <SelectItem value="Populaire">{t("hero.search.populaire")}</SelectItem>
                    <SelectItem value="Premium">{t("vehicules.badge")}</SelectItem>
                    <SelectItem value="SUV">{t("hero.search.suv")}</SelectItem>
                    <SelectItem value="Sport">{t("hero.search.sport")}</SelectItem>
                    <SelectItem value="Économique">{t("hero.search.economique")}</SelectItem>
                    <SelectItem value="Luxe">{t("hero.search.luxe")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-3">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("hero.search.localisation")}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="rounded-lg pl-9"
                    placeholder={t("hero.search.lieuPlaceholder")}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Button className="w-full rounded-lg bg-primary text-sm font-semibold shadow-sm transition-all hover:bg-primary/90">
                  <Search className="mr-1.5 h-4 w-4" />
                  {t("hero.search.rechercher")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border/30 pb-4 sm:flex-row sm:items-baseline">
            <h2 className="text-2xl font-bold tracking-tight">
              {t("vehicules.vehiculesDisponibles")}
            </h2>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="gap-2 text-xs">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                SORT BY
              </Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Car className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">
                {t("vehicules.aucunResultat")} "{search}"
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading && filtered.length === 0
                ? Array.from({ length: 6 }).map((_, i) => <CarCardSkeleton key={i} />)
                : filtered.map((car) => (
                <Link key={car.name} to={`/vehicules/${car.slug}`}>
                  <div className="group flex flex-col overflow-hidden rounded-xl border border-border/30 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={car.images[0]}
                        alt={car.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="rounded-md bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
                          {car.badge}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="min-w-0">
                          <h3 className="text-xl font-bold leading-tight">{car.name}</h3>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">
                            {car.fuel}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-xl font-bold">{car.price}DH</span>
                          <span className="block text-[10px] uppercase text-muted-foreground">
                            {t("vehicules.parJour")}
                          </span>
                        </div>
                      </div>
                      <div className="mb-6 grid grid-cols-3 gap-2 border-y border-border/20 py-4">
                        <div className="text-center">
                          <Users className="mx-auto mb-1 h-4 w-4 text-primary" />
                          <span className="block text-[10px] uppercase text-muted-foreground">
                            {t("vehicules.places")}
                          </span>
                          <span className="text-xs font-semibold">{car.seats}</span>
                        </div>
                        <div className="border-x border-border/20 text-center">
                          <Fuel className="mx-auto mb-1 h-4 w-4 text-primary" />
                          <span className="block text-[10px] uppercase text-muted-foreground">
                            {t("vehicules.carburant")}
                          </span>
                          <span className="text-xs font-semibold">{car.fuel}</span>
                        </div>
                        <div className="text-center">
                          <Snowflake className="mx-auto mb-1 h-4 w-4 text-primary" />
                          <span className="block text-[10px] uppercase text-muted-foreground">
                            {t("vehicules.climatisation")}
                          </span>
                          <span className="text-xs font-semibold">{t("vehicules.inclus")}</span>
                        </div>
                      </div>
                      <div className="mt-auto flex gap-2">
                        <Button size="sm" className="flex-1 rounded-lg">
                          {t("vehicules.reserver")}
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                        <div className="flex size-9 items-center justify-center rounded-lg border border-border/50 transition-colors hover:bg-muted">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-col items-center">
            <p className="mb-4 text-xs text-muted-foreground">
              {t("vehicules.affichage")} {filtered.length} {t("vehicules.sur")} {cars.length} {t("vehicules.vehicules")}
            </p>
          </div>
        </section>

        <section className="border-y border-border/20 bg-muted/50 py-14">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">
                {t("footer.resterInforme")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("footer.newsletterDesc")}
              </p>
            </div>
            <div className="flex gap-3">
              <Input
                className="flex-1 rounded-lg"
                placeholder={t("footer.emailPlaceholder")}
                type="email"
              />
              <Button className="rounded-lg">
                {t("footer.sabonner")}
              </Button>
            </div>
          </div>
        </section>
      </main>

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

export default Vehicules
