export function ParticlesBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute -top-1/4 -left-1/4 h-96 w-96 animate-pulse rounded-full opacity-15 blur-[120px]"
        style={{ backgroundColor: "var(--primary)" }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 h-80 w-80 animate-pulse rounded-full opacity-10 blur-[100px]"
        style={{ animationDelay: "2s", backgroundColor: "var(--primary)" }}
      />
    </div>
  )
}
