import { useState, useEffect, useRef, type DragEvent, type ChangeEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/Toast"
import {
  ArrowLeft,
  Upload,
  X,
  GripVertical,
  Car,
  Fuel,
  Users,
  Euro,
  FileText,
  Cog,
  Zap,
  Timer,
  Gauge,
  MapPin,
  Check,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { CitySelect } from "@/components/CitySelect"

interface ImageItem {
  id: string
  url: string
  name: string
  size: number
  isFile: boolean
  loading?: boolean
}

interface FormErrors {
  name?: string
  price?: string
  seats?: string
  fuel?: string
  badge?: string
  mainImage?: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function extractHexFromGradient(gradient: string): string {
  const match = gradient.match(/from-\[(#[\da-fA-F]{3,8})\]/)
  return match?.[1] ?? "#3b82f6"
}

function gradientFromHex(hex: string): string {
  return `from-[${hex}]/20 to-[${hex}]/10`
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function DashboardCarForm() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const isEdit = Boolean(slug)
  const navigate = useNavigate()
  const fuelOptions = [
    { value: "Essence", label: t("dashboard.carForm.essence") },
    { value: "Diesel", label: t("dashboard.carForm.diesel") },
    { value: "Électrique", label: t("dashboard.carForm.electrique") },
    { value: "Hybride", label: t("dashboard.carForm.hybride") },
    { value: "GPL", label: t("dashboard.carForm.gpl") },
    { value: "Hydrogène", label: t("dashboard.carForm.hydrogene") },
  ]
  const categoryOptions = [
    { value: "Populaire", label: t("dashboard.carForm.populaire") },
    { value: "Premium", label: t("dashboard.carForm.premium") },
    { value: "SUV", label: t("dashboard.carForm.suv") },
    { value: "Économique", label: t("dashboard.carForm.economique") },
    { value: "Sport", label: t("dashboard.carForm.sport") },
    { value: "Luxe", label: t("dashboard.carForm.luxe") },
  ]
  const transmissionOptions = [
    { value: "Automatique", label: t("dashboard.carForm.automatique") },
    { value: "Manuelle", label: t("dashboard.carForm.manuelle") },
  ]
  const [saving, setSaving] = useState(false)
  const [loadingData, setLoadingData] = useState(() => isEdit)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [mainDragOver, setMainDragOver] = useState(false)
  const [sliderDragOver, setSliderDragOver] = useState(false)
  const dragItemRef = useRef<number | null>(null)
  const dragOverItemRef = useRef<number | null>(null)

  const [form, setForm] = useState({
    name: "",
    price: "",
    seats: "5",
    fuel: "",
    badge: "",
    transmission: "Automatique",
    description: "",
    acceleration: "5.2s",
    range_km: "600",
    top_speed: "220km/h",
    ville: "Marrakech",
  })

  const [images, setImages] = useState<ImageItem[]>([])
  const [mainImage, setMainImage] = useState<ImageItem | null>(null)
  const [carColor, setCarColor] = useState("#3b82f6")
  const { toast } = useToast()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!slug || !supabase) return
    let cancelled = false
    setLoadingData(true)
    setError("")
    setSuccess("")
    ;(async () => {
      const { data, error: err } = await supabase.from("cars").select("*").eq("slug", slug).single()
      if (cancelled) return
      if (err || !data) { setError(t("dashboard.carForm.introuvable")); setLoadingData(false); return }
      setForm({
        name: data.name ?? "",
        price: String(data.price ?? ""),
        seats: String(data.seats ?? "5"),
        fuel: data.fuel ?? "",
        badge: data.badge ?? "",
        transmission: data.transmission ?? "Automatique",
        description: data.description ?? "",
        acceleration: data.acceleration ?? "5.2s",
        range_km: String(data.range_km ?? "600"),
        top_speed: data.top_speed ?? "220km/h",
        ville: data.ville ?? "Marrakech",
      })
      setCarColor(extractHexFromGradient(data.gradient))
      setMainImage({ id: crypto.randomUUID(), url: data.image, name: "", size: 0, isFile: false })
      if (Array.isArray(data.images)) {
        setImages(data.images.slice(1).map((url: string) => ({
          id: crypto.randomUUID(),
          url,
          name: "",
          size: 0,
          isFile: false,
        })))
      }
      setLoadingData(false)
    })()
    return () => { cancelled = true }
  }, [slug])

  const addImageFiles = async (files: FileList) => {
    const results = await Promise.all(
      Array.from(files).map(async (file) => ({
        id: crypto.randomUUID(),
        url: await fileToBase64(file),
        name: file.name,
        size: file.size,
        isFile: true,
      }))
    )
    setImages((prev) => [...prev, ...results])
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id))
  }

  const handleDragStart = (index: number) => {
    dragItemRef.current = index
  }

  const handleDragEnter = (index: number) => {
    dragOverItemRef.current = index
  }

  const handleDragEnd = () => {
    if (dragItemRef.current === null || dragOverItemRef.current === null) {
      dragItemRef.current = null
      dragOverItemRef.current = null
      return
    }
    setImages((prev) => {
      const copy = [...prev]
      const dragged = copy.splice(dragItemRef.current!, 1)[0]
      copy.splice(dragOverItemRef.current!, 0, dragged)
      return copy
    })
    dragItemRef.current = null
    dragOverItemRef.current = null
  }

  const handleDropZone = (e: DragEvent) => {
    e.preventDefault()
    setSliderDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      addImageFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addImageFiles(e.target.files)
      e.target.value = ""
    }
  }

  const setMainImageFromFile = async (file: File) => {
    setMainImage({
      id: crypto.randomUUID(),
      url: await fileToBase64(file),
      name: file.name,
      size: file.size,
      isFile: true,
    })
  }

  const autoSlug = slugify(form.name)

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = t("dashboard.carForm.nomRequis")
    if (!form.price || Number(form.price) <= 0) errs.price = t("dashboard.carForm.prixRequis")
    if (!form.seats || Number(form.seats) < 1) errs.seats = t("dashboard.carForm.placesRequis")
    if (!form.fuel) errs.fuel = t("dashboard.carForm.carburantRequis")
    if (!form.badge) errs.badge = t("dashboard.carForm.categorieRequis")
    if (!mainImage) errs.mainImage = t("dashboard.carForm.imagePrincipaleRequis")
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (!supabase) {
      setError(t("dashboard.carForm.supabaseError"))
      return
    }
    setSaving(true)
    setError("")

    try {
      const imageUrls = [mainImage!.url, ...images.map((img) => img.url)]

      const payload: Record<string, unknown> = {
        slug: autoSlug,
        name: form.name,
        price: Number(form.price) || 0,
        seats: Number(form.seats) || 1,
        fuel: form.fuel,
        badge: form.badge,
        gradient: gradientFromHex(carColor),
        image: mainImage!.url,
        images: imageUrls,
        transmission: form.transmission,
        description: form.description,
        acceleration: form.acceleration,
        range_km: Number(form.range_km) || 600,
        top_speed: form.top_speed,
        ville: form.ville,
      }

      if (isEdit) {
        const { slug: _omitSlug, ...editPayload } = payload
        const { error: err } = await supabase.from("cars").update(editPayload).eq("slug", slug)
        if (err) { setError(err.message); toast(err.message, "error"); setSaving(false); return }
        setSuccess(t("dashboard.carForm.modifieSucces") || "Véhicule modifié avec succès")
        toast(t("dashboard.carForm.modifieSucces") || "Véhicule modifié avec succès", "success")
        setSaving(false)
        setTimeout(() => navigate("/dashboard/cars"), 1200)
      } else {
        const { error: err } = await supabase.from("cars").insert(payload)
        if (err) { setError(err.message); toast(err.message, "error"); setSaving(false); return }
        toast("Véhicule ajouté avec succès", "success")
        navigate("/dashboard/cars")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      toast(err instanceof Error ? err.message : "Une erreur est survenue", "error")
    }
    setSaving(false)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/dashboard/cars")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? t("dashboard.carForm.modifier") : t("dashboard.carForm.ajouter")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEdit ? t("dashboard.carForm.modifierDesc") : t("dashboard.carForm.ajouterDesc")}
          </p>
        </div>
      </div>

      {loadingData ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : (
      <>
        {/* Step Indicator */}
        <div className="flex items-center gap-2 sm:gap-4">
          {[
            t("dashboard.carForm.infosGenerales"),
            t("dashboard.carForm.descriptionSection"),
            t("dashboard.carForm.imagePrincipale"),
            t("dashboard.carForm.imagesSlider"),
          ].map((label, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (i < step) setStep(i)
              }}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                i === step
                  ? "text-primary"
                  : i < step
                    ? "text-emerald-600 cursor-pointer hover:text-emerald-500"
                    : "text-muted-foreground/40 cursor-default"
              }`}
            >
              <span className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-muted text-muted-foreground/40"
              }`}>
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {success && (
                  <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
                    {success}
                  </div>
                )}
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className={step === 0 ? "space-y-4" : "hidden"}>
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Car className="h-4 w-4" />
                    {t("dashboard.carForm.infosGenerales")}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="name" className="text-sm font-medium">{t("dashboard.carForm.nom")}</label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }) }}
                        className={errors.name ? "border-destructive" : ""}
                        placeholder={t("dashboard.carForm.nomPlaceholder")}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                      <div className="flex items-center justify-between">
                        {form.name && (
                          <p className="text-xs text-muted-foreground">
                            {t("dashboard.carForm.slug")} <code className="rounded bg-muted px-1">{autoSlug}</code>
                          </p>
                        )}
                        <span className="text-xs text-muted-foreground">{form.name.length}/60</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="price" className="text-sm font-medium">{t("dashboard.carForm.prixParJour")}</label>
                      <div className="relative">
                        <Euro className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          min={0}
                          step={5}
                          value={form.price}
                          onChange={(e) => { setForm({ ...form, price: e.target.value }); setErrors({ ...errors, price: undefined }) }}
                          className={`pl-8 ${errors.price ? "border-destructive" : ""}`}
                          placeholder="89"
                        />
                      </div>
                      {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="seats" className="text-sm font-medium">{t("dashboard.carForm.places")}</label>
                      <div className="relative">
                        <Users className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="seats"
                          type="number"
                          min={1}
                          max={9}
                          value={form.seats}
                          onChange={(e) => { setForm({ ...form, seats: e.target.value }); setErrors({ ...errors, seats: undefined }) }}
                          className={`pl-8 ${errors.seats ? "border-destructive" : ""}`}
                        />
                      </div>
                      {errors.seats && <p className="text-xs text-destructive">{errors.seats}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("dashboard.carForm.carburant")}</label>
                      <Select
                        value={form.fuel}
                        onValueChange={(v) => { setForm({ ...form, fuel: v ?? "" }); setErrors({ ...errors, fuel: undefined }) }}
                      >
                        <SelectTrigger className={`h-8 rounded-lg ${errors.fuel ? "border-destructive" : ""}`}>
                          <SelectValue placeholder={t("dashboard.carForm.carburantPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {fuelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.fuel && <p className="text-xs text-destructive">{errors.fuel}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("dashboard.carForm.categorie")}</label>
                      <Select
                        value={form.badge}
                        onValueChange={(v) => { setForm({ ...form, badge: v ?? "" }); setErrors({ ...errors, badge: undefined }) }}
                      >
                        <SelectTrigger className={`h-8 rounded-lg ${errors.badge ? "border-destructive" : ""}`}>
                          <SelectValue placeholder={t("dashboard.carForm.categoriePlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.badge && <p className="text-xs text-destructive">{errors.badge}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("dashboard.carForm.transmission")}</label>
                      <Select
                        value={form.transmission}
                        onValueChange={(v) => setForm({ ...form, transmission: v ?? "Automatique" })}
                      >
                        <SelectTrigger className="h-8 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {transmissionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                        {t("dashboard.carForm.acceleration")}
                      </label>
                      <Input
                        value={form.acceleration}
                        onChange={(e) => setForm({ ...form, acceleration: e.target.value })}
                        placeholder="3.1s"
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                        {t("dashboard.carForm.rangeKm")}
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={form.range_km}
                        onChange={(e) => setForm({ ...form, range_km: e.target.value })}
                        placeholder="600"
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                        {t("dashboard.carForm.topSpeed")}
                      </label>
                      <Input
                        value={form.top_speed}
                        onChange={(e) => setForm({ ...form, top_speed: e.target.value })}
                        placeholder="220km/h"
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {t("dashboard.carForm.ville")}
                      </label>
                      <CitySelect
                        value={form.ville}
                        onChange={(v) => setForm({ ...form, ville: v ?? "Marrakech" })}
                      />
                    </div>
                  </div>
                </div>

                <div className={step === 1 ? "space-y-4" : "hidden"}>
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    {t("dashboard.carForm.descriptionSection")}
                  </h2>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder={t("dashboard.carForm.descriptionPlaceholder")}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>

                <div className={step === 2 ? "space-y-4" : "hidden"}>
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    {t("dashboard.carForm.imagePrincipale")}
                  </h2>
                  {mainImage ? (
                    <div className="group relative aspect-video overflow-hidden rounded-lg border bg-muted">
                      <img
                        src={mainImage.url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-xs"
                          className="absolute right-2 top-2 size-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => setMainImage(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      {mainImage.size > 0 && (
                        <div className="absolute right-2 bottom-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">
                          {mainImage.name} · {formatSize(mainImage.size)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setMainDragOver(true) }}
                      onDragLeave={() => setMainDragOver(false)}
                      onDrop={async (e) => {
                        e.preventDefault()
                        setMainDragOver(false)
                        if (e.dataTransfer.files.length > 0) {
                          await setMainImageFromFile(e.dataTransfer.files[0])
                        }
                      }}
                      className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                        mainDragOver
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-muted-foreground/40"
                      } ${errors.mainImage ? "border-destructive" : ""}`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            await setMainImageFromFile(e.target.files[0])
                            e.target.value = ""
                          }
                        }}
                      />
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{t("dashboard.carForm.deposezImage")}</p>
                        <p className="text-xs text-muted-foreground">{t("dashboard.carForm.ouCliquez")}</p>
                      </div>
                    </div>
                  )}
                  {errors.mainImage && <p className="text-xs text-destructive">{errors.mainImage}</p>}
                </div>

                <div className={step === 3 ? "space-y-4" : "hidden"}>
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    {t("dashboard.carForm.imagesSlider")}
                    {images.length > 0 && (
                      <span className="ml-auto text-xs font-normal text-muted-foreground">
                        {images.length} image{images.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </h2>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setSliderDragOver(true) }}
                    onDragLeave={() => setSliderDragOver(false)}
                    onDrop={handleDropZone}
                    className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                      sliderDragOver
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-muted-foreground/40"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={handleFileSelect}
                    />
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{t("dashboard.carForm.deposezImages")}</p>
                      <p className="text-xs text-muted-foreground">{t("dashboard.carForm.ouCliquez")}</p>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {images.map((img, index) => (
                        <div
                          key={img.id}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragEnter={() => handleDragEnter(index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => e.preventDefault()}
                          className="group relative aspect-video cursor-grab rounded-lg border bg-muted active:cursor-grabbing"
                        >
                          <img
                            src={img.url}
                            alt=""
                            loading="lazy"
                            className="h-full w-full rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none"
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover:bg-black/20">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon-xs"
                              className="absolute right-1 top-1 size-5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={() => removeImage(img.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <GripVertical className="absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 text-white/0 transition-colors group-hover:text-white/80" />
                          </div>
                          {img.size > 0 && (
                            <div className="absolute right-1 bottom-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                              {formatSize(img.size)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between gap-3 pt-2">
                  <div>
                    {step > 0 && (
                      <Button type="button" variant="ghost" className="rounded-lg" onClick={() => setStep(step - 1)}>
                        ← {t("carCard.photoPrecedente")}
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="rounded-lg" onClick={() => navigate("/dashboard/cars")}>
                      {t("dashboard.carForm.annuler")}
                    </Button>
                    {step < 3 ? (
                      <Button type="button" className="rounded-lg" onClick={() => setStep(step + 1)}>
                        {t("gallery.photoSuivante")} →
                      </Button>
                    ) : (
                      <Button type="submit" className="rounded-lg" disabled={saving}>
                        {saving ? t("dashboard.carForm.enregistrement") : isEdit ? t("dashboard.carForm.enregistrer") : t("dashboard.carForm.ajouterBtn")}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="sticky top-6 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground">{t("dashboard.carForm.apercu")}</h2>
            <Card className="overflow-hidden border-border/50 pt-0">
              <CardContent className="p-0">
                <div
                  className={`bg-gradient-to-br ${gradientFromHex(carColor)} bg-cover bg-center h-40`}
                  style={mainImage ? { backgroundImage: `url(${mainImage.url})` } : undefined}
                >
                  <div className="flex h-full items-end p-4 bg-gradient-to-t from-black/40 to-transparent">
                    {form.badge && (
                      <span className="rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-medium text-white">
                        {form.badge}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold leading-tight">
                      {form.name || t("dashboard.carForm.nomVehicule")}
                    </h3>
                    <span className="text-lg font-bold">
                      {form.price ? `${form.price}DH` : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {form.seats || "?"} {t("vehicules.places")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Fuel className="h-3 w-3" /> {form.fuel || "?"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Cog className="h-3 w-3" /> {form.transmission}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1">
                    <span>{form.acceleration || "—"}</span>
                    <span>{form.range_km ? `${form.range_km}km` : "—"}</span>
                    <span>{form.top_speed || "—"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  )
}

export default DashboardCarForm
