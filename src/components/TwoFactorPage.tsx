import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import logoImage from "@/assets/amphr-logo.png"
import loginBgImage from "@/assets/login-background.png"
import { ArrowLeft, Shield } from "lucide-react"

export function TwoFactorPage() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { verify2FA, cancel2FA, pendingAuth } = useAuth()
  const navigate = useNavigate()

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Redirect if no pending auth
  useEffect(() => {
    if (!pendingAuth) {
      navigate("/login")
    }
  }, [pendingAuth, navigate])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newCode = [...code]
      pastedData.split("").forEach((char, i) => {
        if (i < 6) newCode[i] = char
      })
      setCode(newCode)
      // Focus the next empty input or the last one
      const nextEmptyIndex = newCode.findIndex(c => !c)
      inputRefs.current[nextEmptyIndex === -1 ? 5 : nextEmptyIndex]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join("")
    
    if (fullCode.length !== 6) {
      setError("Wprowadź pełny 6-cyfrowy kod")
      return
    }

    setIsLoading(true)
    setError("")

    const success = await verify2FA(fullCode)
    if (success) {
      navigate("/")
    } else {
      setError("Nieprawidłowy kod weryfikacyjny")
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }

    setIsLoading(false)
  }

  const handleBack = () => {
    cancel2FA()
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - 2FA Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Powrót do logowania</span>
          </button>

          {/* Logo */}
          <div className="flex justify-center">
            <img src={logoImage} alt="AmpHR Logo" className="h-16 w-auto" />
          </div>

          {/* Icon & Title */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-[#8963e4]/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#8963e4]" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Weryfikacja dwuetapowa
            </h1>
            <p className="text-gray-500 text-sm">
              Wprowadź 6-cyfrowy kod z aplikacji uwierzytelniającej
            </p>
            {pendingAuth && (
              <p className="text-gray-400 text-xs">
                Logujesz się jako: {pendingAuth.email}
              </p>
            )}
          </div>

          {/* Code Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg transition-colors
                    focus:outline-none focus:border-[#8963e4] focus:ring-2 focus:ring-[#8963e4]/20
                    ${error ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}
                  `}
                />
              ))}
            </div>

            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading || code.some(d => !d)}
              className="w-full h-12 bg-[#8963e4] hover:bg-[#7852d4] text-white font-medium rounded-full disabled:opacity-50"
            >
              {isLoading ? "Weryfikacja..." : "Zweryfikuj"}
            </Button>
          </form>

          {/* Help Text */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              Nie masz dostępu do kodu?
            </p>
            <a href="#" className="text-sm text-[#8963e4] hover:underline">
              Użyj kodu zapasowego
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
