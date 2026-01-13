import { Home, Users, Building2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"
import logoImage from "@/assets/amphr-logo.png"

const menuItems = [
  { id: "panel", label: "Panel", icon: Home, path: "/" },
  { id: "pracownicy", label: "Pracownicy", icon: Users, path: "/pracownicy" },
  { id: "dzialy", label: "Działy", icon: Building2, path: "/dzialy" },
  { id: "ustawienia", label: "Ustawienia", icon: Settings, path: "/ustawienia" },
]

interface SidebarContentProps {
  onNavigate?: () => void
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex items-center justify-center w-8 h-8">
          <img src={logoImage} alt="AmpHR Logo" className="w-8 h-8 object-contain filter brightness-0 invert" />
        </div>
        <div>
          <div className="font-semibold text-lg leading-tight">AmpHR</div>
          <div className="text-sm text-white/80">Demo</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    )
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 text-xs text-white/70">
        AmpHR - Wszystkie dane
        <br />
        zastrzeżone.
      </div>
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-[#8963e4] text-white">
      <SidebarContent />
    </aside>
  )
}
