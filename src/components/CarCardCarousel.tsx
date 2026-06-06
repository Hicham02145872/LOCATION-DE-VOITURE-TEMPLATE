import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarCardCarouselProps {
  images: string[]
  gradient: string
  className?: string
}

export function CarCardCarousel({ images, gradient, className }: CarCardCarouselProps) {
  const { t } = useTranslation()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selected, setSelected] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi, onSelect])

  return (
    <div className={cn("group relative overflow-hidden", className)} ref={emblaRef}>
      <div className="flex h-full">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="min-w-0 shrink-0 grow-0 basis-full"
          >
            <div
              className={`bg-gradient-to-br ${gradient} h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105`}
              style={{ backgroundImage: `url(${img})` }}
            />
          </div>
        ))}
      </div>
      {canScrollPrev && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); emblaApi?.scrollPrev() }}
          aria-label={t("carCard.photoPrecedente")}
          className="absolute top-1/2 left-2 hidden -translate-y-1/2 cursor-pointer rounded-full bg-background/70 p-1 text-foreground shadow-xs backdrop-blur-sm transition-opacity hover:bg-background/90 group-hover:block"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      )}
      {canScrollNext && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); emblaApi?.scrollNext() }}
          aria-label={t("carCard.photoSuivante")}
          className="absolute top-1/2 right-2 hidden -translate-y-1/2 cursor-pointer rounded-full bg-background/70 p-1 text-foreground shadow-xs backdrop-blur-sm transition-opacity hover:bg-background/90 group-hover:block"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5" role="tablist" aria-label={t("carCard.selectionPhoto")}>
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); emblaApi?.scrollTo(idx) }}
            role="tab"
            aria-selected={selected === idx}
            aria-label={t("carCard.photo", { index: idx + 1 })}
            className={`cursor-pointer rounded-full transition-all ${
              selected === idx
                ? "w-3 bg-white"
                : "size-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
