import { useEffect, useState, useId } from "react"
import { Particles } from "@tsparticles/react"
import { tsParticles } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"
import type { ISourceOptions } from "@tsparticles/engine"

let loaded = false

const particlesOptions: ISourceOptions = {
  fpsLimit: 60,
  fullScreen: false,
  particles: {
    color: {
      value: ["#fbbf24", "#f59e0b", "#d97706", "#fcd34d"],
    },
    move: {
      direction: "none",
      drift: 1.5,
      enable: true,
      gravity: { enable: true, maxSpeed: 0.8 },
      outModes: { default: "bounce" },
      speed: 0.8,
    },
    number: {
      density: { enable: true, width: 1920, height: 1080 },
      value: 30,
    },
    opacity: {
      value: { min: 0.06, max: 0.3 },
      animation: { enable: true, speed: 0.4, sync: false },
    },
    shape: { type: "circle" },
    size: {
      value: { min: 1, max: 3 },
      animation: { enable: true, speed: 0.6, sync: false },
    },
    wobble: {
      enable: true,
      distance: 10,
      speed: 2,
    },
  },
  detectRetina: true,
}

export function ParticlesBackground() {
  const uid = useId()
  const [ready, setReady] = useState(loaded)

  useEffect(() => {
    if (loaded) return
    loaded = true
    loadSlim(tsParticles)
      .then(() => setReady(true))
      .catch(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <Particles
      id={`particles-${uid}`}
      className="pointer-events-none absolute inset-0 z-0"
      options={particlesOptions}
    />
  )
}
