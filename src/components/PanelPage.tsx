import { Users, Building2, TrendingUp, Clock, GraduationCap, DollarSign, UserMinus } from "lucide-react"
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

// Training Effectiveness Chart Component
function TrainingEffectivenessChart() {
  const data = [
    { month: "Sty", value: 65 },
    { month: "Lut", value: 72 },
    { month: "Mar", value: 78 },
    { month: "Kwi", value: 75 },
    { month: "Maj", value: 82 },
    { month: "Cze", value: 88 },
  ]
  
  const maxValue = 100
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <GraduationCap className="w-5 h-5 text-[#8963e4]" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Efektywność Szkoleń</h3>
      </div>
      <div className="h-48 flex items-end justify-between gap-3 mb-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full">
            <div className="w-full flex-1 relative flex items-end">
              <div 
                className="w-full bg-linear-to-t from-[#8963e4] to-[#a87ef5] rounded-t-lg transition-all duration-500 relative"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                  {item.value}%
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Średnia efektywność: <span className="font-semibold text-[#8963e4]">76.7%</span>
          <span className="text-green-600 dark:text-green-400 ml-2">↑ +15% vs Q1</span>
        </p>
      </div>
    </div>
  )
}

// Budget Chart Component
function BudgetChart() {
  const budgetData = [
    { category: "Wynagrodzenia", value: 450000, color: "#8963e4" },
    { category: "Szkolenia", value: 85000, color: "#a87ef5" },
    { category: "Rekrutacja", value: 65000, color: "#c9a9ff" },
    { category: "Benefity", value: 120000, color: "#e0d1ff" },
  ]
  
  const total = budgetData.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="w-5 h-5 text-[#8963e4]" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budżet HR</h3>
      </div>
      <div className="space-y-4">
        {budgetData.map((item, index) => {
          const percentage = (item.value / total) * 100
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.value.toLocaleString('pl-PL')} zł
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {percentage.toFixed(1)}% całkowitego budżetu
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Całkowity budżet:</span>
          <span className="text-lg font-bold text-[#8963e4]">{total.toLocaleString('pl-PL')} zł</span>
        </div>
      </div>
    </div>
  )
}

// Staff Turnover Chart Component
function StaffTurnoverChart() {
  const turnoverData = [
    { month: "Sty", joined: 2, left: 0 },
    { month: "Lut", joined: 3, left: 1 },
    { month: "Mar", joined: 1, left: 0 },
    { month: "Kwi", joined: 2, left: 2 },
    { month: "Maj", joined: 4, left: 1 },
    { month: "Cze", joined: 3, left: 1 },
  ]
  
  const maxValue = Math.max(...turnoverData.map(d => Math.max(d.joined, d.left))) + 1
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <UserMinus className="w-5 h-5 text-[#8963e4]" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rotacja Pracowników</h3>
      </div>
      <div className="h-48 flex items-end justify-between gap-4 mb-4">
        {turnoverData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full">
            <div className="w-full flex-1 flex items-end justify-center gap-1">
              <div className="flex-1 relative flex items-end h-full">
                <div 
                  className="w-full bg-green-500 rounded-t transition-all duration-500 relative"
                  style={{ height: `${(item.joined / maxValue) * 100}%` }}
                >
                  {item.joined > 0 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      +{item.joined}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 relative flex items-end h-full">
                <div 
                  className="w-full bg-red-500 rounded-t transition-all duration-500 relative"
                  style={{ height: `${(item.left / maxValue) * 100}%` }}
                >
                  {item.left > 0 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      -{item.left}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Przyjęcia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Odejścia</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Wskaźnik rotacji: <span className="font-semibold text-[#8963e4]">8.3%</span>
          <span className="text-green-600 dark:text-green-400 ml-2">↓ -2.1% vs Q1</span>
        </p>
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
      <div className="bg-linear-to-r from-[#8963e4] to-[#a87ef5] rounded-lg p-6 text-white">
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrainingEffectivenessChart />
        <BudgetChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StaffTurnoverChart />
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ostatnia aktywność</h3>
          <div className="space-y-4">
            {[
              { action: "Dodano nowego pracownika", user: "Klara Wiśniewska", time: "2 godz. temu" },
              { action: "Zaktualizowano dane", user: "Bartosz Nowak", time: "5 godz. temu" },
              { action: "Utworzono nowy dział", user: "Dział IT", time: "1 dzień temu" },
              { action: "Ukończono szkolenie", user: "Anna Kowalska", time: "2 dni temu" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 py-2">
                <div className="w-2 h-2 bg-[#8963e4] rounded-full mt-2 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{item.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.user}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
