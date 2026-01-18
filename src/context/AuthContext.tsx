import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  email: string
  name: string
  role: string
}

interface PendingAuth {
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  pendingAuth: PendingAuth | null
  isAuthenticated: boolean
  isPending2FA: boolean
  login: (email: string, password: string) => Promise<boolean>
  verify2FA: (code: string) => Promise<boolean>
  cancel2FA: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })
  const [pendingAuth, setPendingAuth] = useState<PendingAuth | null>(null)

  const login = async (email: string, password: string): Promise<boolean> => {
    // In real app, validate password against API
    console.log("Login attempt with password length:", password.length)
    
    // Simulate successful first step - store pending auth for 2FA
    const pendingUser: PendingAuth = {
      email,
      name: "Aleksandra",
      role: "Administrator"
    }
    setPendingAuth(pendingUser)
    return true
  }

  const verify2FA = async (code: string): Promise<boolean> => {
    // In real app, verify the code against API
    console.log("2FA verification attempt with code:", code)
    
    // Accept any 6-digit code for demo purposes
    if (code.length === 6 && pendingAuth) {
      const authenticatedUser: User = {
        email: pendingAuth.email,
        name: pendingAuth.name,
        role: pendingAuth.role
      }
      setUser(authenticatedUser)
      localStorage.setItem("user", JSON.stringify(authenticatedUser))
      setPendingAuth(null)
      return true
    }
    return false
  }

  const cancel2FA = () => {
    setPendingAuth(null)
  }

  const logout = () => {
    setUser(null)
    setPendingAuth(null)
    
    // Preserve theme setting before clearing localStorage
    const theme = localStorage.getItem("theme")
    
    // Clear all localStorage data
    localStorage.clear()
    
    // Restore theme setting
    if (theme) {
      localStorage.setItem("theme", theme)
    }
    
    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + window.location.hostname
    })
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      pendingAuth,
      isAuthenticated: !!user, 
      isPending2FA: !!pendingAuth,
      login, 
      verify2FA,
      cancel2FA,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
