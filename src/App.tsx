import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Car,
  MapPin,
  Fuel,
  Users,
  Snowflake,
  Star,
  ArrowRight,
  Check,
  Search,
  ChevronDown,
  Phone,
  Mail,
  Clock,
} from "lucide-react"
import { howItWorks, features, testimonials } from "@/data/cars"
import { useCars } from "@/hooks/useCars"
import { CarCardCarousel } from "@/components/CarCardCarousel"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useAuthModal } from "@/lib/auth-modal"
import { useAuth } from "@/lib/auth"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { TypewriterText } from "@/hooks/useTypewriter"
import { useTranslation } from "react-i18next"
import { useDirection } from "@/hooks/useDirection"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ParticlesBackground } from "@/components/ParticlesBackground"
import { MobileNav } from "@/components/MobileNav"
import { CarCardSkeleton } from "@/components/CarCardSkeleton"
import { DatePicker } from "@/components/DatePicker"
import teslaLogo from "@/assets/brands/tesla.svg"
import bmwLogo from "@/assets/brands/bmw.svg"
import mercedesLogo from "@/assets/brands/mercedes.svg"
import audiLogo from "@/assets/brands/audi.svg"
import porscheLogo from "@/assets/brands/porsche.svg"
import toyotaLogo from "@/assets/brands/toyota.svg"
import hondaLogo from "@/assets/brands/honda.svg"
import volkswagenLogo from "@/assets/brands/volkswagen.svg"
import "./App.css"

const brands = [
  { name: "Tesla", logo: teslaLogo },
  { name: "BMW", logo: bmwLogo },
  { name: "Mercedes", logo: mercedesLogo },
  { name: "Audi", logo: audiLogo },
  { name: "Porsche", logo: porscheLogo },
  { name: "Toyota", logo: toyotaLogo },
  { name: "Honda", logo: hondaLogo },
  { name: "Volkswagen", logo: volkswagenLogo },
  { name: "Tesla", logo: teslaLogo },
  { name: "BMW", logo: bmwLogo },
  { name: "Mercedes", logo: mercedesLogo },
  { name: "Audi", logo: audiLogo },
  { name: "Porsche", logo: porscheLogo },
  { name: "Toyota", logo: toyotaLogo },
  { name: "Honda", logo: hondaLogo },
  { name: "Volkswagen", logo: volkswagenLogo },
]

const navLinks = [
  { key: "accueil", href: "/" },
  { key: "vehicules", href: "/vehicules" },
  { key: "testimonials", href: "/#testimonials" },
  { key: "contact", href: "/#contact" },
]

const ease = [0.25, 0.4, 0.25, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

function App() {
  const { cars, loading } = useCars()
  const { user } = useAuth()
  const { open: openAuth } = useAuthModal()
  const navigate = useNavigate()
  const [searchLocation, setSearchLocation] = useState("")
  const [searchStart, setSearchStart] = useState("")
  const [searchEnd, setSearchEnd] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const reduced = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 120])

  const { hash, pathname } = useLocation()
  const { t } = useTranslation()
  useDirection()
  const isHome = pathname === "/"

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }
  }, [hash])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <header className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b px-6 py-3 shadow-xs backdrop-blur-xl transition-all duration-300 sm:px-8 ${
          isHome && !scrolled
            ? "border-transparent bg-transparent"
            : "border-border/40 bg-background/80"
        }`}>
          <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Car className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight">{t("app.name")}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = link.href.startsWith("/") && pathname.startsWith(link.href)
            return (
              <a
                key={link.key}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                }`}
              >
                {t(`nav.${link.key}`)}
              </a>
            )
          })}
        </nav>
        <MobileNav links={navLinks} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                {t("nav.dashboard")}
              </Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex"
              onClick={() => openAuth("login")}
            >
              {t("nav.connexion")}
            </Button>
          )}
          <Link to="/vehicules">
            <Button size="sm" className="rounded-lg">
              {t("nav.reserver")}
            </Button>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <section ref={heroRef} className="relative flex min-h-dvh items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=85)",
            y: reduced ? 0 : bgY,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute top-0 -left-1/4 h-[600px] w-[800px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[600px] rounded-full bg-primary/30 blur-[100px]" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-28 sm:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/80 backdrop-blur-sm">
              <span className="flex size-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
              {t("hero.badge")}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-black leading-[0.9] tracking-[-0.06em] text-[clamp(2.5rem,6vw,4.5rem)] text-white drop-shadow-lg"
            >
              <TypewriterText text={t("hero.title")} />
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-xl text-balance text-base sm:text-lg font-medium leading-relaxed text-white/80"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mx-auto mt-12 max-w-3xl"
              animate={reduced ? {} : { y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <Card className="group overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(185,28,28,0.15)]">
                <CardContent className="p-5 sm:p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                      <Input
                        className="rounded-xl border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50 transition-all duration-300 focus-visible:border-primary/60 focus-visible:ring-[3px] focus-visible:ring-primary/30"
                        placeholder={t("hero.search.lieuPlaceholder")}
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/60">{t("hero.search.debut")}</label>
                        <DatePicker value={searchStart} onChange={setSearchStart} placeholder={t("hero.search.debut")} className="border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 focus-visible:border-primary/60 focus-visible:ring-primary/30" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/60">{t("hero.search.fin")}</label>
                        <DatePicker value={searchEnd} onChange={setSearchEnd} placeholder={t("hero.search.fin")} className="border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 focus-visible:border-primary/60 focus-visible:ring-primary/30" />
                      </div>
                    </div>
                    <Button className="w-full rounded-xl shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98]" size="lg" onClick={() => navigate(`/vehicules?search=${encodeURIComponent(searchLocation)}&type=${searchType}`)}>
                      <Search className="mr-2 h-4 w-4" />
                      {t("hero.search.trouver")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4, ease }}
              className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
            >
              <span className="inline-flex items-center gap-1.5 text-white/80">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-white">{t("hero.stats.rating")}</span>
                <span className="text-white/60">{t("hero.stats.avis")}</span>
              </span>
              <span className="h-3 w-px bg-white/20" />
              <span className="text-white/60">{t("hero.stats.vehicules")}</span>
              <span className="h-3 w-px bg-white/20" />
              <span className="text-white/60">{t("hero.stats.annulation")}</span>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={reduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-col items-center gap-1"
          >
            <ChevronDown className="h-4 w-4 text-white/40" />
            <ChevronDown className="-mt-3 h-4 w-4 text-white/20" />
          </motion.div>
        </motion.div>
      </section>

      <section className="relative overflow-hidden border-t bg-background py-16">
        <div className="absolute -top-1/4 -right-1/4 h-80 w-80 rounded-full bg-primary/[0.03] blur-[100px]" />
        <div className="absolute -bottom-1/4 -left-1/4 h-60 w-60 rounded-full bg-primary/[0.02] blur-[80px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("brands.title")}
          </p>
          <div className="marquee-wrapper relative overflow-hidden">
            <div className="marquee-track flex items-center gap-16">
              {brands.map((brand, i) => (
                <span
                  key={`${brand.name}-${i}`}
                  className="inline-flex items-center gap-3 text-lg font-bold tracking-tight text-muted-foreground/40"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    loading="lazy"
                    className="h-6 w-6"
                  />
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="vehicules" className="relative overflow-hidden border-t bg-background py-24">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-[80px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <Badge
              variant="secondary"
              className="mb-4 rounded-full px-4 py-1 text-xs font-medium"
            >
              {t("vehicules.badge")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("vehicules.title")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("vehicules.subtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            {["all", "Populaire", "SUV", "Premium", "Sport", "Luxe", "Économique"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSearchType(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
                  searchType === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "border border-border/50 bg-background/60 text-muted-foreground hover:border-border hover:bg-muted/50"
                }`}
              >
                {cat === "all" ? t("vehicules.tous") : cat}
              </button>
            ))}
          </motion.div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading && cars.length === 0
              ? Array.from({ length: 6 }).map((_, i) => <CarCardSkeleton key={i} />)
              : cars.filter((car) => searchType === "all" || car.badge === searchType).map((car, i) => (
              <motion.div
                key={car.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: reduced ? 0 : 0.5,
                  delay: reduced ? 0 : i * 0.08,
                  ease,
                }}
              >
                <Link to={`/vehicules/${car.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden rounded-2xl border border-border/20 bg-background/80 pt-0 shadow-sm backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_0_35px_rgba(185,28,28,0.08)] hover:shadow-xl hover:shadow-black/5">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <CarCardCarousel
                        images={car.images}
                        gradient={car.gradient}
                        className="h-52 sm:h-56"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
                        <span className="translate-y-2 rounded-full bg-white/20 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                          {t("vehicules.voirDetails")}
                        </span>
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="rounded-full border-white/10 bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                          {car.badge}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg">{car.name}</h3>
                        <div className="shrink-0 text-right">
                          <div className="text-xl font-bold tracking-tight">{car.price}</div>
                          <div className="text-[11px] text-muted-foreground">{t("vehicules.parJour")}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1.5">
                          <Users className="h-3.5 w-3.5" />
                          {car.seats} {t("vehicules.places")}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1.5">
                          <Fuel className="h-3.5 w-3.5" />
                          {car.fuel}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1.5">
                          <Snowflake className="h-3.5 w-3.5" />
                          {t("vehicules.climatisation")}
                        </span>
                      </div>
                      <Separator className="bg-border/30" />
                      <div className="flex items-center justify-between">
                        <Button size="sm" className="rounded-xl">
                          {t("vehicules.reserver")}
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Link to="/vehicules">
              <Button
                variant="outline"
                size="lg"
                className="group rounded-xl border-border/50 px-8 hover:border-primary/30 hover:bg-primary/[0.03]"
              >
                {t("vehicules.voirTout")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-background py-24">
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/[0.02] blur-[80px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <Badge
              variant="secondary"
              className="mb-4 rounded-full px-4 py-1 text-xs font-medium shadow-sm"
            >
              {t("commentCaMarche.badge")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("commentCaMarche.title")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("commentCaMarche.subtitle")}
            </p>
          </motion.div>
          <div className="relative mt-16 grid gap-8 sm:grid-cols-3">
            <div className="absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent sm:block" />
            {howItWorks.map((step, i) => {
              const stepKeys = [
                { title: "commentCaMarche.step1.title", desc: "commentCaMarche.step1.desc" },
                { title: "commentCaMarche.step2.title", desc: "commentCaMarche.step2.desc" },
                { title: "commentCaMarche.step3.title", desc: "commentCaMarche.step3.desc" },
              ]
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: reduced ? 0 : 0.5,
                    delay: reduced ? 0 : i * 0.15,
                    ease,
                  }}
                  className="relative text-center"
                >
                  <div className="relative mx-auto flex size-16 items-center justify-center rounded-2xl border border-border/40 bg-background shadow-sm shadow-black/5">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="mt-3 flex items-center justify-center">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{t(stepKeys[i].title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(stepKeys[i].desc)}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t bg-muted/30 py-24">
        <ParticlesBackground />
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/[0.03] blur-[80px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <Badge
              variant="secondary"
              className="mb-4 rounded-full px-4 py-1 text-xs font-medium shadow-sm"
            >
              {t("features.badge")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("features.title")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("features.subtitle")}
            </p>
          </motion.div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {features.map((feature, i) => {
              const featKeys: Record<string, { title: string; desc: string }> = {
                "Assurance tous risques": { title: "features.assurance.title", desc: "features.assurance.desc" },
                "Support 24/7": { title: "features.support.title", desc: "features.support.desc" },
                "Annulation gratuite": { title: "features.annulation.title", desc: "features.annulation.desc" },
                "Paiement sécurisé": { title: "features.paiement.title", desc: "features.paiement.desc" },
              }
              const keys = featKeys[feature.title] ?? { title: "", desc: "" }
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: reduced ? 0 : 0.4,
                    delay: reduced ? 0 : i * 0.08,
                    ease,
                  }}
                  className="group rounded-2xl border border-border/40 bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border/60 hover:shadow-lg hover:shadow-black/5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-sm ${feature.iconColor}`}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t(keys.title)}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {t(keys.desc)}
                      </p>
                    </div>
                  </div>
              </motion.div>
            )
          })}
          </div>
        </div>
      </section>

      <section id="testimonials" className="relative overflow-hidden bg-background py-24">
        <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-[100px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <Badge
              variant="secondary"
              className="mb-4 rounded-full px-4 py-1 text-xs font-medium shadow-sm"
            >
              {t("testimonials.badge")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("testimonials.title")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("testimonials.subtitle")}
            </p>
          </motion.div>
           <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {testimonials.map((item, i) => {
              const tKeys: Record<string, { name: string; role: string; text: string }> = {
                "Hicham Altit": { name: "testimonials.hicham.name", role: "testimonials.hicham.role", text: "testimonials.hicham.text" },
                "Anwar Moumen": { name: "testimonials.anwar.name", role: "testimonials.anwar.role", text: "testimonials.anwar.text" },
                "Rania Altit": { name: "testimonials.rania.name", role: "testimonials.rania.role", text: "testimonials.rania.text" },
              }
              const tk = tKeys[item.name] ?? { name: "", role: "", text: "" }
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: reduced ? 0 : 0.5,
                    delay: reduced ? 0 : i * 0.1,
                    ease,
                  }}
                >
                  <Card className="rounded-2xl border-border/40 bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
                    <CardContent className="p-6">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i2) => (
                          <Star
                            key={i2}
                            className={`h-4 w-4 ${
                              i2 < item.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="relative mt-4">
                        <span className="absolute -top-1 -left-1 text-3xl leading-none text-primary/20">
                          "
                        </span>
                        <p className="relative text-sm leading-relaxed text-muted-foreground">
                          {t(tk.text)}
                        </p>
                      </div>
                      <Separator className="my-4 bg-border/30" />
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary shadow-sm">
                            {item.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{t(tk.name)}</div>
                          <div className="text-xs text-muted-foreground">
                            {t(tk.role)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>



      <section className="relative overflow-hidden border-t bg-background py-24">
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/[0.02] blur-[80px]" />
        <div className="absolute bottom-0 left-0 h-[250px] w-[250px] rounded-full bg-primary/[0.02] blur-[80px]" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <Badge
              variant="secondary"
              className="mb-4 rounded-full px-4 py-1 text-xs font-medium shadow-sm"
            >
              {t("faq.badge")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("faq.title")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("faq.subtitle")}
            </p>
          </motion.div>
          <div className="mt-12 space-y-3">
            {(t("faq.questions", { returnObjects: true }) as Array<{ q: string; a: string }>).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : i * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between rounded-2xl border border-border/40 bg-background/60 px-5 py-4 text-left shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-border/60 hover:shadow-lg hover:shadow-black/5"
                >
                  <span className="pr-4 text-sm font-medium">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="rounded-b-2xl border-x border-b border-border/40 bg-background/30 px-5 py-4 backdrop-blur-xl">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t bg-muted/30 py-24">
        <ParticlesBackground />
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/[0.03] blur-[80px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1 text-xs font-medium shadow-sm">
              {t("contact.badge")}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("contact.title")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("contact.subtitle")}
            </p>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: MapPin,
                titleKey: "contact.adresse.title",
                contentKey: "contact.adresse.content",
                subKey: "contact.adresse.sub",
              },
              {
                icon: Phone,
                titleKey: "contact.telephone.title",
                contentKey: "contact.telephone.content",
                subKey: "contact.telephone.sub",
              },
              {
                icon: Mail,
                titleKey: "contact.email.title",
                contentKey: "contact.email.content",
                subKey: "contact.email.sub",
              },
              {
                icon: Clock,
                titleKey: "contact.horaires.title",
                contentKey: "contact.horaires.content",
                subKey: "contact.horaires.sub",
              },
            ].map((item, i) => (
              <motion.div
                key={item.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : i * 0.08, ease }}
                className="group rounded-2xl border border-border/40 bg-background p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border/60 hover:shadow-lg hover:shadow-black/5"
              >
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{t(item.titleKey)}</h3>
                <p className="mt-1 text-sm font-medium text-foreground">{t(item.contentKey)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(item.subKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-background py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-primary/[0.02]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 0.6, ease }}
            className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/10 via-primary/[0.03] to-background px-8 py-20 text-center shadow-xl shadow-primary/5 sm:px-20"
          >
            <div className="absolute top-0 right-0 -z-10 h-80 w-80 translate-x-1/4 -translate-y-1/4 rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute bottom-0 left-0 -z-10 h-80 w-80 -translate-x-1/4 translate-y-1/4 rounded-full bg-primary/10 blur-[100px]" />
            <Badge variant="secondary" className="mb-5 rounded-full px-4 py-1.5 text-xs font-medium shadow-sm">
              {t("cta.badge")}
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {t("cta.subtitle")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/vehicules">
                <Button size="lg" className="w-full rounded-xl px-8 shadow-lg shadow-primary/20 sm:w-auto">
                  <Car className="mr-2 h-4 w-4" />
                  {t("cta.reserver")}
                </Button>
              </Link>
              <Link to="/vehicules">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-xl border-border/50 px-8 backdrop-blur-sm sm:w-auto"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {t("cta.voirOffres")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer id="contact" className="relative overflow-hidden border-t bg-muted/30">
        <ParticlesBackground />
        <div className="absolute top-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/[0.02] blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[250px] w-[250px] rounded-full bg-primary/[0.02] blur-[80px]" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
                  <Car className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="text-base font-bold">{t("app.name")}</span>
              </div>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {t("footer.description")}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {(t("footer.villes", { returnObjects: true }) as string[]).map((city: string) => (
                  <span
                    key={city}
                    className="rounded-full border border-border/50 bg-background px-3 py-1 text-xs text-muted-foreground"
                  >
                    {city}
                  </span>
                ))}
              </div>
              <div className="mt-6 overflow-hidden rounded-xl border border-border/50">
                <iframe
                  title="Agence Agadir"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110402.89831585699!2d-9.622284887441585!3d30.421104474346485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6f8d2b7e4ef%3A0x0!2zMzDCsDI1JzE2LjAiTiA5wrAzNycwMi4wIlc!5e0!3m2!1sfr!2sma!4v1"
                  width="100%"
                  height="180"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                />
              </div>
            </div>
            {[
              {
                key: "vehicules",
                links: [
                  { label: "Citadines", tKey: "footer.links.citadines" },
                  { label: "Berlines", tKey: "footer.links.berlines" },
                  { label: "SUV", tKey: "footer.links.suv" },
                  { label: "Luxe", tKey: "footer.links.luxe" },
                  { label: "Utilitaires", tKey: "footer.links.utilitaires" },
                ],
              },
              {
                key: "company",
                links: [
                  { label: "À propos", tKey: "footer.links.aPropos" },
                  { label: "Agences", tKey: "footer.links.agences" },
                  { label: "Carrières", tKey: "footer.links.carrieres" },
                  { label: "Presse", tKey: "footer.links.presse" },
                ],
              },
              {
                key: "assistance",
                links: [
                  { label: "Centre d'aide", tKey: "footer.links.centreAide" },
                  { label: "Contact", tKey: "footer.links.contact" },
                  { label: "CGV", tKey: "footer.links.cgv" },
                  { label: "Confidentialité", tKey: "footer.links.confidentialite" },
                ],
              },
            ].map((col) => (
              <div key={col.key}>
                <h4 className="text-sm font-semibold">{t(`footer.columns.${col.key}`)}</h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.tKey}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {t(link.tKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator className="my-10 bg-border/50" />
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {t("app.name")}. {t("footer.droits")}
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a
                href="#"
                className="transition-colors hover:text-foreground"
              >
                {t("footer.mentionsLegales")}
              </a>
              <a
                href="#"
                className="transition-colors hover:text-foreground"
              >
                {t("footer.cgu")}
              </a>
              <a
                href="#"
                className="transition-colors hover:text-foreground"
              >
                {t("footer.cookies")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
