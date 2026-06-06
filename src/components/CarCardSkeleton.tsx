import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function CarCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden border-border/50 pt-0", className)}>
      <CardContent className="p-0">
        <div className="h-52 animate-pulse bg-muted sm:h-56" />
        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-4 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-7 w-16 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex gap-3">
            <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="h-px bg-border/50" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            <div className="h-7 w-24 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
