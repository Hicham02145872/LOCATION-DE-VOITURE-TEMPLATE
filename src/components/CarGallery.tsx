import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ChevronLeft, ChevronRight, Image } from "lucide-react"

interface CarGalleryProps {
  images: string[]
  name: string
  badge: string
  fuel: string
  price: number
}

export function CarGallery({ images, name, badge, fuel, price }: CarGalleryProps) {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)

  const prev = () => setActive((a) => (a === 0 ? images.length - 1 : a - 1))
  const next = () => setActive((a) => (a === images.length - 1 ? 0 : a + 1))

  return (
    <div className="mx-auto max-w-7xl px-0 sm:px-4">
      <div className="group relative overflow-hidden rounded-none sm:rounded-2xl">
        <img
          src={images[active]}
          alt={`${name} - ${t("gallery.photo", { index: active + 1 })}`}
          className="h-[50vh] w-full object-cover transition-all duration-500 sm:h-[65vh]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="pointer-events-auto">
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
              <div className="pointer-events-auto mt-3 sm:mt-0 sm:text-right">
                <div className="text-3xl font-bold text-white drop-shadow-sm sm:text-4xl">
                  {price}DH
                </div>
                <div className="text-sm text-white/80">{t("gallery.parJour")}</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={prev}
          aria-label={t("gallery.photoPrecedente")}
          className="pointer-events-auto absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground opacity-0 shadow-xs backdrop-blur-sm transition-all hover:bg-background/90 hover:scale-110 group-hover:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label={t("gallery.photoSuivante")}
          className="pointer-events-auto absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground opacity-0 shadow-xs backdrop-blur-sm transition-all hover:bg-background/90 hover:scale-110 group-hover:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="pointer-events-auto absolute top-4 right-4 flex items-center gap-1 rounded-lg bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm sm:top-6 sm:right-6">
          <Image className="h-3.5 w-3.5" />
          {active + 1}/{images.length}
        </div>
      </div>

      <div className="mt-3 hidden gap-2 overflow-x-auto sm:flex">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`relative shrink-0 overflow-hidden rounded-xl transition-all duration-200 hover:ring-2 hover:ring-primary/50 ${
              idx === active
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={img}
              alt={`${name} - ${t("gallery.photo", { index: idx + 1 })}`}
              className="h-16 w-24 object-cover sm:h-20 sm:w-28"
            />
          </button>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`rounded-full transition-all ${
              idx === active ? "h-2 w-6 bg-primary" : "h-2 w-2 bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
