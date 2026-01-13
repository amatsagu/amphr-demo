import { Users, Building2, TrendingUp, Clock } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
}

function StatCard({ title, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-[#8963e4]/10 dark:bg-[#8963e4]/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  )
}

export function PanelPage() {
  const { user } = useAuth()
  const userName = user?.name || "Użytkownik"

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#8963e4] to-[#a87ef5] rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Witaj, {userName}! 👋</h2>
        <p className="text-white/80">
          Oto podsumowanie Twojej firmy na dziś.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pracownicy"
          value={3}
          icon={<Users className="w-6 h-6 text-[#8963e4]" />}
          trend="+2 w tym miesiącu"
          trendUp={true}
        />
        <StatCard
          title="Działy"
          value={3}
          icon={<Building2 className="w-6 h-6 text-[#8963e4]" />}
        />
        <StatCard
          title="Aktywność"
          value="94%"
          icon={<TrendingUp className="w-6 h-6 text-[#8963e4]" />}
          trend="+5% vs ostatni tydzień"
          trendUp={true}
        />
        <StatCard
          title="Średni staż"
          value="2.5 lat"
          icon={<Clock className="w-6 h-6 text-[#8963e4]" />}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ostatnia aktywność</h3>
        <div className="space-y-4">
          {[
            { action: "Dodano nowego pracownika", user: "Klara Wiśniewska", time: "2 godziny temu" },
            { action: "Zaktualizowano dane", user: "Bartosz Nowak", time: "5 godzin temu" },
            { action: "Utworzono nowy dział", user: "Dział IT", time: "1 dzień temu" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.action}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.user}</p>
              </div>
              <span className="text-sm text-gray-400 dark:text-gray-500">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
