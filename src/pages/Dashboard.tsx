import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Car,
  LayoutDashboard,
  CalendarCheck,
  LogOut,
  Search,
  ChevronDown,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "dashboard.sidebar.tableauDeBord" },
  { to: "/dashboard/reservations", icon: CalendarCheck, label: "dashboard.sidebar.reservations" },
  { to: "/dashboard/cars", icon: Car, label: "dashboard.sidebar.vehicules" },
]

function Dashboard() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate("/")
  }

  const initials = user?.email?.charAt(0).toUpperCase() ?? "A"
  const activeLabel = navItems.find(
    (item) => item.to === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.to)
  )?.label ?? "dashboard.sidebar.tableauDeBord"

  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="hidden w-64 flex-col border-r border-border/50 bg-background md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border/50 px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Car className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight">{t("app.name")}</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = item.to === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {t(item.label)}
              </Link>
            )
          })}
        </nav>
        <Separator />
        <div className="p-3">
          <div className="mb-2 truncate px-3 text-xs text-muted-foreground">
            {user?.email}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 rounded-lg text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            {t("dashboard.sidebar.deconnexion")}
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border/50 bg-background px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 md:hidden">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
                <Car className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            </Link>
            <h1 className="text-base font-semibold md:text-lg">{t(activeLabel)}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden h-8 w-8 rounded-lg p-0 md:flex lg:w-48 lg:justify-start lg:gap-2 lg:px-2.5"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="hidden text-xs text-muted-foreground lg:inline">
                {t("dashboard.sidebar.rechercher")}
              </span>
              <kbd className="pointer-events-none ml-auto hidden h-5 items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground select-none lg:inline-flex">
                <span className="text-[9px]">&#8984;</span>K
              </kbd>
            </Button>

            <LanguageSwitcher />

            <a
              href="/"
              className="hidden text-xs text-muted-foreground hover:text-foreground md:inline"
            >
              {t("dashboard.sidebar.site")}
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg px-1.5"
                >
                  <Avatar className="size-6">
                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-xs font-medium md:inline">
                    {user?.email?.split("@")[0] ?? "Admin"}
                  </span>
                  <ChevronDown className="hidden h-3 w-3 text-muted-foreground md:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">
                      {user?.email?.split("@")[0] ?? "Admin"}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/")}>
                  {t("dashboard.sidebar.voirLeSite")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("dashboard.sidebar.deconnexion")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
