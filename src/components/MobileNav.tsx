import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { useAuthModal } from "@/lib/auth-modal"
import { Menu, X, Car } from "lucide-react"

interface MobileNavProps {
  links: { key: string; href: string }[]
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { user } = useAuth()
  const { open: openAuth } = useAuthModal()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex size-9 items-center justify-center rounded-lg md:hidden"
        aria-label={t("nav.menu")}
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 flex w-72 flex-col border-l bg-background shadow-xl md:hidden"
            >
              <div className="flex items-center justify-between border-b p-4">
                <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                    <Car className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-base font-bold">{t("app.name")}</span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="flex size-8 items-center justify-center rounded-lg"
                  aria-label={t("nav.fermer")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 p-4">
                {links.map((link) => {
                  const isActive = link.href.startsWith("/") && pathname.startsWith(link.href)
                  return (
                    <Link
                      key={link.key}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {t(`nav.${link.key}`)}
                    </Link>
                  )
                })}
              </nav>

              <div className="border-t p-4 space-y-2">
                {user ? (
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="block">
                    <Button className="w-full rounded-lg">
                      <Car className="mr-2 h-4 w-4" />
                      {t("nav.dashboard")}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full rounded-lg"
                    onClick={() => { setOpen(false); openAuth("login") }}
                  >
                    {t("nav.connexion")}
                  </Button>
                )}
                <Link to="/vehicules" onClick={() => setOpen(false)}>
                  <Button className="w-full rounded-lg">
                    {t("nav.reserver")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
