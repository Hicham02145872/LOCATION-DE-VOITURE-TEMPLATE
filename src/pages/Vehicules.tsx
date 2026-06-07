import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Car,
  Search,
  ArrowRight,
  Users,
  Fuel,
  Snowflake,
  SlidersHorizontal,
} from "lucide-react"
import { useCars } from "@/hooks/useCars"
import { CarCardCarousel } from "@/components/CarCardCarousel"
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
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.badge.toLowerCase().includes(search.toLowerCase()) ||
      c.fuel.toLowerCase().includes(search.toLowerCase())
    const matchesType = type === "all" || c.badge === type
    return matchesSearch && matchesType
  })

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

      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("vehicules.tousNosVehicules")}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {cars.length} {t("vehicules.disponibles")}
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm" className="rounded-lg">
                {t("vehicules.retourAccueil")}
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="rounded-lg pl-9"
                placeholder={t("vehicules.rechercher")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={type} onValueChange={(v) => setType(v ?? "all")}>
                <SelectTrigger className="w-40 rounded-lg">
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
              <Button variant="outline" size="icon" className="rounded-lg">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="my-8 bg-border/50" />

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
                  <Card className="group overflow-hidden border-border/50 pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                  <CardContent className="p-0">
                    <CarCardCarousel
                      images={car.images}
                      gradient={car.gradient}
                      className="h-52 sm:h-56"
                    />
                    <div className="space-y-3 p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge
                            variant="outline"
                            className="mb-2 rounded-full border-border/50 text-[11px] font-medium"
                          >
                            {car.badge}
                          </Badge>
                          <h3 className="font-semibold">{car.name}</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">{car.price}DH</span>
                          <span className="text-sm text-muted-foreground">
                            {t("vehicules.parJour")}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1">
                          <Users className="h-3.5 w-3.5" />
                          {car.seats} {t("vehicules.places")}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1">
                          <Fuel className="h-3.5 w-3.5" />
                          {car.fuel}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1">
                          <Snowflake className="h-3.5 w-3.5" />
                          {t("vehicules.climatisation")}
                        </span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {t("vehicules.aPartirDe")} <strong>{car.price * 7}DH</strong> {t("vehicules.septJours")}
                        </span>
                        <Button size="sm" className="rounded-lg">
                          {t("vehicules.reserver")}
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
