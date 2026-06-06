import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { cars as staticCars, type Car } from "@/data/cars"

export function useCars() {
  const [cars, setCars] = useState<Car[]>(staticCars)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return
    setLoading(true)

    supabase
      .from("cars")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setCars(data as unknown as Car[])
        }
        setLoading(false)
      })
  }, [])

  return { cars, loading }
}

export function useCar(slug: string | undefined) {
  const [car, setCar] = useState<Car | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) { setLoading(false); return }

    const found = staticCars.find((c) => c.slug === slug)
    if (found) {
      setCar(found)
      setLoading(false)
    }

    if (!supabase) return
    setLoading(true)
    supabase
      .from("cars")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data }) => {
        if (data) setCar(data as unknown as Car)
        setLoading(false)
      })
  }, [slug])

  return { car, loading }
}
