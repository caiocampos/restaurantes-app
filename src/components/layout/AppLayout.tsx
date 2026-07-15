import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { LogOut, UtensilsCrossed } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const TABS = [
  { label: "Pratos", to: "/dishes" },
  { label: "Restaurantes", to: "/restaurants" },
  { label: "Usuários", to: "/users" },
]

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 text-lg font-semibold select-none">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <span>Restaurantes</span>
          </div>

          <nav className="flex items-center gap-1">
            {TABS.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user?.name}{" "}
              <span className="text-xs opacity-60">({user?.role})</span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
