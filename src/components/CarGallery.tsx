import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CarGalleryProps {
  images: string[]
  name: string
  badge: string
  fuel: string
  price: number
}

export function CarGallery({ images, name, badge, fuel, price }: CarGalleryProps) {
  const { t } = useTranslation()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selected, setSelected] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi, onSelect])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((img, idx) => (
            <div key={idx} className="min-w-0 shrink-0 grow-0 basis-full">
              <div
                className="h-[55vh] min-h-[420px] bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />

      <button
        onClick={(e) => { e.stopPropagation(); emblaApi?.scrollPrev() }}
        aria-label={t("gallery.photoPrecedente")}
        className="pointer-events-auto absolute top-1/2 left-4 hidden -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground shadow-xs backdrop-blur-sm transition-all hover:bg-background/90 hover:scale-110 md:block"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); emblaApi?.scrollNext() }}
        aria-label={t("gallery.photoSuivante")}
        className="pointer-events-auto absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground shadow-xs backdrop-blur-sm transition-all hover:bg-background/90 hover:scale-110 md:block"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <div className="pointer-events-auto mx-auto max-w-7xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-white/30 bg-white/10 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {badge}
                </Badge>
                <Badge className="rounded-full bg-primary text-xs font-medium">
                  {fuel}
                </Badge>
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

      <div className="absolute right-6 top-24 flex gap-1.5 sm:right-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); emblaApi?.scrollTo(idx) }}
            aria-label={t("gallery.photo", { index: idx + 1 })}
            className={`pointer-events-auto rounded-full transition-all ${
              selected === idx
                ? "h-1.5 w-6 bg-white"
                : "h-1.5 w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
