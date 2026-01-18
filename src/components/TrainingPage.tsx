import { useState } from "react"
import { 
  GraduationCap, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  FileText,
  Download,
  ArrowLeft,
  ChevronRight
} from "lucide-react"

// Types
type TrainingStatus = 
  | "available" 
  | "checking-seats" 
  | "waiting-list" 
  | "checking-budget" 
  | "budget-rejected"
  | "pending-approval"
  | "manager-rejected"
  | "approved"
  | "registered"
  | "completed"
  | "feedback-pending"
  | "certificate-ready"

interface Training {
  id: string
  name: string
  description: string
  date: string
  duration: string
  availableSeats: number
  totalSeats: number
}

interface EnrollmentState {
  trainingId: string | null
  status: TrainingStatus
  rejectionReason?: string
  hasBudget?: boolean
  hasSeats?: boolean
  feedbackCompleted?: boolean
  certificateUrl?: string
}

// Mock trainings data
const mockTrainings: Training[] = [
  {
    id: "1",
    name: "Zarządzanie projektami - metodyki Agile",
    description: "Kompleksowe szkolenie z metodyk Agile, Scrum i Kanban dla menedżerów projektów.",
    date: "15-17 lutego 2026",
    duration: "3 dni",
    availableSeats: 5,
    totalSeats: 12
  },
  {
    id: "2",
    name: "Komunikacja w zespole",
    description: "Rozwijanie umiejętności komunikacyjnych i współpracy w środowisku korporacyjnym.",
    date: "22-23 lutego 2026",
    duration: "2 dni",
    availableSeats: 0,
    totalSeats: 8
  },
  {
    id: "3",
    name: "Excel dla zaawansowanych",
    description: "Zaawansowane funkcje Excel: makra, pivot tables, analiza danych i wizualizacje.",
    date: "1-2 marca 2026",
    duration: "2 dni",
    availableSeats: 3,
    totalSeats: 10
  },
  {
    id: "4",
    name: "Cyberbezpieczeństwo w firmie",
    description: "Podstawy bezpieczeństwa IT, ochrona danych i najlepsze praktyki w organizacji.",
    date: "10-11 marca 2026",
    duration: "2 dni",
    availableSeats: 8,
    totalSeats: 15
  }
]

// Status Badge Component
function StatusBadge({ status }: { status: TrainingStatus }) {
  const config = {
    "available": { label: "Dostępne", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    "checking-seats": { label: "Sprawdzanie miejsc", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    "waiting-list": { label: "Lista oczekujących", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    "checking-budget": { label: "Weryfikacja budżetu", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    "budget-rejected": { label: "Odrzucone - brak budżetu", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    "pending-approval": { label: "Oczekuje na akceptację", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
    "manager-rejected": { label: "Odrzucone przez managera", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    "approved": { label: "Zaakceptowane", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    "registered": { label: "Zarejestrowane", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    "completed": { label: "Ukończone", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" },
    "feedback-pending": { label: "Oczekuje na ankietę", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
    "certificate-ready": { label: "Certyfikat gotowy", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" }
  }

  const { label, color } = config[status]
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {label}
    </span>
  )
}

// Progress Timeline Component
function ProgressTimeline({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: "Wysłano", icon: CheckCircle2 },
    { label: "Weryfikacja managera", icon: Clock },
    { label: "Decyzja", icon: AlertCircle }
  ]

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isPending = index > currentStep

        return (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center mb-2
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${isCurrent ? 'bg-[#8963e4] text-white' : ''}
                ${isPending ? 'bg-gray-200 dark:bg-gray-700 text-gray-400' : ''}
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs text-center ${
                isCompleted || isCurrent ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 ${
                isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Training Card Component
function TrainingCard({ 
  training, 
  onSelect 
}: { 
  training: Training
  onSelect: (id: string) => void 
}) {
  const seatsAvailable = training.availableSeats > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {training.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {training.description}
          </p>
        </div>
        <GraduationCap className="w-8 h-8 text-[#8963e4] shrink-0 ml-4" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4" />
          <span>{training.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4" />
          <span>{training.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4" />
          <span className={seatsAvailable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
            {training.availableSeats > 0 
              ? `${training.availableSeats} wolnych miejsc` 
              : "Brak wolnych miejsc"
            } ({training.availableSeats}/{training.totalSeats})
          </span>
        </div>
      </div>

      <button
        onClick={() => onSelect(training.id)}
        className="w-full bg-[#8963e4] hover:bg-[#7952d3] text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        Wybierz szkolenie
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// Enrollment Flow Component
function EnrollmentFlow({ 
  training, 
  enrollmentState,
  onBack,
  onContinue
}: { 
  training: Training
  enrollmentState: EnrollmentState
  onBack: () => void
  onContinue: (nextStatus: TrainingStatus) => void
}) {
  const [isProcessing, setIsProcessing] = useState(false)

  const simulateProcess = (nextStatus: TrainingStatus, delay: number = 2000) => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onContinue(nextStatus)
    }, delay)
  }

  // Checking seats
  if (enrollmentState.status === "checking-seats") {
    const hasSeats = training.availableSeats > 0
    
    if (isProcessing) {
      return (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-[#8963e4] animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Sprawdzanie dostępności miejsc...
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Proszę czekać
          </p>
        </div>
      )
    }

    if (!hasSeats) {
      return (
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Brak dostępnych miejsc
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Niestety, wszystkie miejsca na to szkolenie zostały zajęte.<br />
            Zostałeś dodany do listy oczekujących.
          </p>
          <StatusBadge status="waiting-list" />
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Powiadomimy Cię, gdy zwolni się miejsce lub gdy rekrutacja zostanie zamknięta.
            </p>
          </div>
        </div>
      )
    }

    // Has seats - auto continue to budget check
    setTimeout(() => simulateProcess("checking-budget"), 100)
    return null
  }

  // Checking budget
  if (enrollmentState.status === "checking-budget") {
    // Simulate: 70% chance of having budget
    const hasBudget = Math.random() > 0.3

    if (isProcessing) {
      return (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-[#8963e4] animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Weryfikacja budżetu działu...
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Sprawdzamy dostępność środków
          </p>
        </div>
      )
    }

    if (!hasBudget) {
      return (
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Wniosek odrzucony
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Brak dostępnego budżetu w dziale na to szkolenie.
          </p>
          <StatusBadge status="budget-rejected" />
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Skontaktuj się z działem HR lub swoim przełożonym w sprawie zwiększenia budżetu szkoleniowego.
            </p>
          </div>
        </div>
      )
    }

    // Has budget - auto continue to manager approval
    setTimeout(() => simulateProcess("pending-approval", 1500), 100)
    return null
  }

  // Pending manager approval
  if (enrollmentState.status === "pending-approval") {
    return (
      <div className="py-8">
        <div className="text-center mb-8">
          <Clock className="w-16 h-16 text-[#8963e4] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Wniosek wysłany do managera
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Twój wniosek oczekuje na akceptację przełożonego
          </p>
          <StatusBadge status="pending-approval" />
        </div>

        <div className="mb-8">
          <ProgressTimeline currentStep={1} />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Szczegóły wniosku:</h4>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Szkolenie:</span>
              <span className="font-medium">{training.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Termin:</span>
              <span className="font-medium">{training.date}</span>
            </div>
            <div className="flex justify-between">
              <span>Czas trwania:</span>
              <span className="font-medium">{training.duration}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              // Simulate: 75% approval rate
              const isApproved = Math.random() > 0.25
              simulateProcess(isApproved ? "approved" : "manager-rejected", 2500)
            }}
            disabled={isProcessing}
            className="flex-1 bg-[#8963e4] hover:bg-[#7952d3] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Przetwarzanie...
              </span>
            ) : (
              "Symuluj decyzję managera"
            )}
          </button>
        </div>
      </div>
    )
  }

  // Manager rejected
  if (enrollmentState.status === "manager-rejected") {
    const rejectionReasons = [
      "Brak możliwości zastąpienia pracownika w tym terminie",
      "Priorytet dla innych projektów w tym okresie",
      "Szkolenie nie jest zgodne z aktualnym planem rozwoju",
      "Zbyt duże obciążenie zespołu w planowanym terminie"
    ]
    const reason = rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)]

    return (
      <div className="text-center py-12">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Wniosek odrzucony przez managera
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Twój przełożony nie zatwierdził udziału w szkoleniu
        </p>
        <StatusBadge status="manager-rejected" />
        
        <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 max-w-2xl mx-auto">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-left">
            Powód odrzucenia:
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 text-left">
            {reason}
          </p>
        </div>

        <div className="mt-6">
          <ProgressTimeline currentStep={2} />
        </div>
      </div>
    )
  }

  // Approved
  if (enrollmentState.status === "approved") {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Wniosek zaakceptowany!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Twój przełożony zatwierdził udział w szkoleniu
        </p>
        <StatusBadge status="approved" />

        <div className="mt-8">
          <ProgressTimeline currentStep={2} />
        </div>

        <button
          onClick={() => simulateProcess("registered", 1000)}
          disabled={isProcessing}
          className="mt-8 bg-[#8963e4] hover:bg-[#7952d3] text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Rejestrowanie...
            </span>
          ) : (
            "Przejdź do rejestracji"
          )}
        </button>
      </div>
    )
  }

  // Registered
  if (enrollmentState.status === "registered") {
    return (
      <div className="py-8">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Rejestracja zakończona!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Zostałeś pomyślnie zarejestrowany na szkolenie
          </p>
          <StatusBadge status="registered" />
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800 max-w-2xl mx-auto mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Informacje o dostępie do szkolenia
          </h4>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
              <span>Nazwa szkolenia:</span>
              <span className="font-medium">{training.name}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
              <span>Termin:</span>
              <span className="font-medium">{training.date}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
              <span>Czas trwania:</span>
              <span className="font-medium">{training.duration}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
              <span>Miejsce:</span>
              <span className="font-medium">Sala konferencyjna A, piętro 3</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
              <span>Link do materiałów:</span>
              <a href="#" className="font-medium text-[#8963e4] hover:underline">
                training.company.com/materials
              </a>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Szczegóły szkolenia zostały wysłane na Twój email służbowy
          </p>
          <button
            onClick={() => simulateProcess("completed", 1000)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Symuluj ukończenie szkolenia
          </button>
        </div>
      </div>
    )
  }

  // Completed - waiting for feedback
  if (enrollmentState.status === "completed") {
    return (
      <div className="py-8">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Szkolenie ukończone!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Gratulacje! Pomyślnie ukończyłeś szkolenie
          </p>
          <StatusBadge status="completed" />
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800 max-w-2xl mx-auto mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Wymagana ankieta ewaluacyjna
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Aby otrzymać certyfikat i zaktualizować swój profil kompetencji, wypełnij ankietę zwrotną dotyczącą szkolenia.
          </p>
          <button
            onClick={() => simulateProcess("feedback-pending", 2000)}
            disabled={isProcessing}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Otwieranie ankiety...
              </span>
            ) : (
              "Wypełnij ankietę ewaluacyjną"
            )}
          </button>
        </div>
      </div>
    )
  }

  // Feedback pending (simulating filling out)
  if (enrollmentState.status === "feedback-pending") {
    if (isProcessing) {
      return (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-[#8963e4] animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Zapisywanie odpowiedzi...
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Przetwarzamy Twoją ankietę
          </p>
        </div>
      )
    }

    return (
      <div className="py-8">
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 text-[#8963e4] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ankieta ewaluacyjna
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Podziel się swoją opinią o szkoleniu
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Jak oceniasz jakość szkolenia? (1-5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-[#8963e4] hover:bg-[#8963e4]/10 transition-colors"
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Czy polecisz to szkolenie innym?
              </label>
              <div className="flex gap-4">
                <button className="flex-1 py-2 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-[#8963e4] hover:bg-[#8963e4]/10 transition-colors">
                  Tak
                </button>
                <button className="flex-1 py-2 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-[#8963e4] hover:bg-[#8963e4]/10 transition-colors">
                  Nie
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Dodatkowe uwagi (opcjonalnie)
              </label>
              <textarea
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={4}
                placeholder="Twoje uwagi i sugestie..."
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => simulateProcess("certificate-ready", 2000)}
            disabled={isProcessing}
            className="bg-[#8963e4] hover:bg-[#7952d3] text-white font-medium py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
          >
            Wyślij ankietę
          </button>
        </div>
      </div>
    )
  }

  // Certificate ready
  if (enrollmentState.status === "certificate-ready") {
    return (
      <div className="py-8">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Proces zakończony!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Dziękujemy za wypełnienie ankiety
          </p>
          <StatusBadge status="certificate-ready" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {/* Certificate */}
          <div className="bg-linear-to-br from-[#8963e4] to-[#a87ef5] rounded-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Certyfikat ukończenia</h4>
                <p className="text-sm text-white/80">Gotowy do pobrania</p>
              </div>
            </div>
            <div className="bg-white/10 rounded p-4 mb-4">
              <p className="text-sm mb-1">Szkolenie:</p>
              <p className="font-semibold text-sm">{training.name}</p>
              <p className="text-sm mt-2 text-white/80">Data ukończenia: 18.01.2026</p>
            </div>
            <button className="w-full bg-white text-[#8963e4] hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Pobierz certyfikat (PDF)
            </button>
          </div>

          {/* Competency Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#8963e4]/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#8963e4]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Profil zaktualizowany</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nowe kompetencje dodane</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Dodane kompetencje:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Zarządzanie projektami - Agile</li>
                  <li>• Metodyka Scrum</li>
                  <li>• Kanban</li>
                </ul>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Twój profil kompetencji został automatycznie zaktualizowany w systemie HR.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Powrót do listy szkoleń
          </button>
        </div>
      </div>
    )
  }

  return null
}

// Main Training Page Component
export function TrainingPage() {
  const [enrollmentState, setEnrollmentState] = useState<EnrollmentState>({
    trainingId: null,
    status: "available"
  })

  const selectedTraining = mockTrainings.find(t => t.id === enrollmentState.trainingId)

  const handleSelectTraining = (trainingId: string) => {
    setEnrollmentState({
      trainingId,
      status: "checking-seats"
    })
  }

  const handleBack = () => {
    setEnrollmentState({
      trainingId: null,
      status: "available"
    })
  }

  const handleContinue = (nextStatus: TrainingStatus) => {
    setEnrollmentState(prev => ({
      ...prev,
      status: nextStatus
    }))
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {enrollmentState.trainingId ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Powrót do listy szkoleń
            </button>
          ) : null}
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {enrollmentState.trainingId ? selectedTraining?.name : "Dostępne szkolenia"}
          </h1>
          {!enrollmentState.trainingId && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Wybierz szkolenie, aby rozpocząć proces rejestracji
            </p>
          )}
        </div>

        {/* Content */}
        {!enrollmentState.trainingId ? (
          // Training List
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockTrainings.map(training => (
              <TrainingCard
                key={training.id}
                training={training}
                onSelect={handleSelectTraining}
              />
            ))}
          </div>
        ) : (
          // Enrollment Flow
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            {selectedTraining && (
              <EnrollmentFlow
                training={selectedTraining}
                enrollmentState={enrollmentState}
                onBack={handleBack}
                onContinue={handleContinue}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
