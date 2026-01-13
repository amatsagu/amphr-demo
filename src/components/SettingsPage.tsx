import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Bell, Shield, Palette } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"

interface SettingsSection {
  id: string
  title: string
  icon: React.ReactNode
  description: string
}

const sections: SettingsSection[] = [
  { id: "profile", title: "Profil", icon: <User className="w-5 h-5" />, description: "Zarządzaj danymi konta" },
  { id: "notifications", title: "Powiadomienia", icon: <Bell className="w-5 h-5" />, description: "Ustawienia powiadomień" },
  { id: "security", title: "Bezpieczeństwo", icon: <Shield className="w-5 h-5" />, description: "Hasło i autoryzacja" },
  { id: "appearance", title: "Wygląd", icon: <Palette className="w-5 h-5" />, description: "Motyw i personalizacja" },
]

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")
  const { theme, setTheme } = useTheme()
  const [formData, setFormData] = useState({
    firstName: "Aleksandra",
    lastName: "Kowalska",
    email: "aleksandra.k@example.com",
    phone: "+48 123 456 789",
    company: "AmpHR Demo",
    role: "Administrator",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === section.id
                  ? "bg-[#8963e4] text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700"
              }`}
            >
              {section.icon}
              <div>
                <div className="font-medium">{section.title}</div>
                <div className={`text-xs ${activeSection === section.id ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
                  {section.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Dane profilu</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Zaktualizuj swoje dane osobowe</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imię</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nazwisko</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefon</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Firma</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rola</label>
                  <Input
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#8963e4] hover:bg-[#7852d4] text-white">
                  Zapisz zmiany
                </Button>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Powiadomienia</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Zarządzaj preferencjami powiadomień</p>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: "Powiadomienia email", desc: "Otrzymuj powiadomienia na email", checked: true },
                  { label: "Nowi pracownicy", desc: "Powiadom gdy dodano nowego pracownika", checked: true },
                  { label: "Zmiany w działach", desc: "Powiadom o zmianach w strukturze", checked: false },
                  { label: "Raporty tygodniowe", desc: "Wysyłaj podsumowanie co tydzień", checked: true },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8963e4]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8963e4]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Bezpieczeństwo</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Zarządzaj ustawieniami bezpieczeństwa</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Obecne hasło</label>
                  <Input type="password" placeholder="••••••••" className="border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nowe hasło</label>
                  <Input type="password" placeholder="••••••••" className="border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Potwierdź nowe hasło</label>
                  <Input type="password" placeholder="••••••••" className="border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#8963e4] hover:bg-[#7852d4] text-white">
                  Zmień hasło
                </Button>
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Wygląd</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Personalizuj wygląd aplikacji</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Motyw</label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setTheme("light")}
                      className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                        theme === "light" 
                          ? "border-2 border-[#8963e4] bg-white" 
                          : "border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                      }`}
                    >
                      <div className="w-16 h-12 bg-gray-100 rounded mb-2 flex items-center justify-center">
                        <div className="w-4 h-4 bg-[#8963e4] rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Jasny</span>
                    </button>
                    <button 
                      onClick={() => setTheme("dark")}
                      className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                        theme === "dark" 
                          ? "border-2 border-[#8963e4] bg-white dark:bg-gray-700" 
                          : "border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                      }`}
                    >
                      <div className="w-16 h-12 bg-gray-800 rounded mb-2 flex items-center justify-center">
                        <div className="w-4 h-4 bg-[#8963e4] rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Ciemny</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
