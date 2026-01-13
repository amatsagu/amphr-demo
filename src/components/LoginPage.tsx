import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import logoImage from "@/assets/amphr-logo.png"
import loginBgImage from "@/assets/login-background.png"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const success = await login(email, password)
    if (success) {
      navigate("/verify-2fa")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <img src={logoImage} alt="AmpHR Logo" className="h-16 w-auto" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Witaj ponownie!
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Adres email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-gray-300 focus:border-[#8963e4] focus:ring-[#8963e4]"
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-gray-300 focus:border-[#8963e4] focus:ring-[#8963e4]"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#8963e4] bg-gray-100 border-gray-300 rounded focus:ring-[#8963e4] focus:ring-2"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Zapamiętaj
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#8963e4] hover:bg-[#7852d4] text-white font-medium rounded-full"
            >
              {isLoading ? "Logowanie..." : "Zaloguj"}
            </Button>
          </form>

          {/* Forgot Password */}
          <div className="text-center">
            <a href="#" className="text-sm text-[#8963e4] hover:underline">
              Zapomniałeś hasła?
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Background Image */}
      <div 
        className="hidden lg:block lg:flex-1 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBgImage})` }}
      />
    </div>
  )
}
