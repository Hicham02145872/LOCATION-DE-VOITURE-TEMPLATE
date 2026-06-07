import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react"

interface CarGalleryProps {
  images: string[]
  name: string
  badge: string
  fuel: string
  price: number
}

export function CarGallery({ images, name, badge, fuel, price }: CarGalleryProps) {
  const { t } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)

  const visibleThumbs = images.slice(0, 5)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * (dir === "left" ? -1 : 1)
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
  }

  return (
    <div className="relative">
      {/* Desktop: Grid layout */}
      <div className="hidden h-[460px] grid-cols-4 grid-rows-2 gap-2 lg:grid">
        <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
          <img
            src={images[0]}
            alt={`${name} - ${t("gallery.photo", { index: 1 })}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {visibleThumbs.slice(1, 5).map((img, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl"
          >
            <img
              src={img}
              alt={`${name} - ${t("gallery.photo", { index: idx + 2 })}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
          <Grid3X3 className="h-3.5 w-3.5" />
          {images.length} {t("gallery.photo", { index: "" }).trim()}
        </div>
      </div>

      {/* Mobile: Carousel */}
      <div className="relative lg:hidden">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="min-w-0 shrink-0 grow-0 basis-full snap-center"
            >
              <img
                src={img}
                alt={`${name} - ${t("gallery.photo", { index: idx + 1 })}`}
                className="h-[55vh] min-h-[420px] w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        <button
          onClick={() => scroll("left")}
          aria-label={t("gallery.photoPrecedente")}
          className="pointer-events-auto absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground shadow-xs backdrop-blur-sm transition-all hover:bg-background/90 hover:scale-110"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label={t("gallery.photoSuivante")}
          className="pointer-events-auto absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground shadow-xs backdrop-blur-sm transition-all hover:bg-background/90 hover:scale-110"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="pointer-events-auto mx-auto max-w-7xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/30 bg-white/10 px-3 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    {badge}
                  </span>
                  <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    {fuel}
                  </span>
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl">
                  {name}
                </h1>
              </div>
              <div className="mt-3 sm:mt-0 sm:text-right">
                <div className="text-3xl font-bold text-white drop-shadow-sm sm:text-4xl">
                  {price}DH
                </div>
                <div className="text-sm text-white/80">{t("gallery.parJour")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
