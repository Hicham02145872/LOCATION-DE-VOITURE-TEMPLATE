import { createContext, useContext, useState, type ReactNode } from "react"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"

type AuthView = "login" | "signup" | null

interface AuthModalContextValue {
  open: (view?: AuthView) => void
  close: () => void
}

const AuthModalContext = createContext<AuthModalContextValue>({
  open: () => {},
  close: () => {},
})

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AuthView>(null)

  const close = () => setView(null)

  return (
    <AuthModalContext.Provider value={{ open: (view?: AuthView) => setView(view ?? null), close }}>
      {children}
      {view === "login" && (
        <Login
          onClose={close}
          onSwitch={() => setView("signup")}
        />
      )}
      {view === "signup" && (
        <Signup
          onClose={close}
          onSwitch={() => setView("login")}
        />
      )}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  return useContext(AuthModalContext)
}
