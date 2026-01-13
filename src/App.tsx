import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { PanelPage } from "@/components/PanelPage"
import { EmployeesPage } from "@/components/EmployeesPage"
import { DepartmentsPage } from "@/components/DepartmentsPage"
import { SettingsPage } from "@/components/SettingsPage"
import { LoginPage } from "@/components/LoginPage"
import { TwoFactorPage } from "@/components/TwoFactorPage"
import { ThemeProvider } from "@/context/ThemeContext"
import { AuthProvider, useAuth } from "@/context/AuthContext"

const pageTitles: Record<string, string> = {
  "/": "Panel",
  "/pracownicy": "Pracownicy",
  "/dzialy": "Działy",
  "/ustawienia": "Ustawienia",
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function AppLayout() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || "Panel"

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<PanelPage />} />
            <Route path="/pracownicy" element={<EmployeesPage />} />
            <Route path="/dzialy" element={<DepartmentsPage />} />
            <Route path="/ustawienia" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { isAuthenticated, isPending2FA } = useAuth()
  
  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : 
        isPending2FA ? <Navigate to="/verify-2fa" replace /> : 
        <LoginPage />
      } />
      <Route path="/verify-2fa" element={
        isAuthenticated ? <Navigate to="/" replace /> : 
        !isPending2FA ? <Navigate to="/login" replace /> : 
        <TwoFactorPage />
      } />
      <Route path="/*" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
