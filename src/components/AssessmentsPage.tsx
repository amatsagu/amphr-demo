import { useState } from "react"
import { 
  ClipboardList, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Send,
  Edit,
  Lock,
  Calendar,
  Users,
  Archive,
  X,
  Check,
  Loader2,
  Mail,
  UserCheck,
  Shield
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

// Types
type AssessmentStatus = 
  | "new-cycle"
  | "waiting-self-assessment"
  | "waiting-manager-approval"
  | "in-meeting"
  | "completed"
  | "archived"
  | "under-hr-review"

interface AssessmentCycle {
  id: string
  name: string
  period: string
  createdDate: string
  status: AssessmentStatus
  employeeId: string
  employeeName: string
  managerId: string
  managerName: string
  selfAssessment?: SelfAssessment
  managerEvaluation?: ManagerEvaluation
  meeting?: Meeting
  finalScore?: number
  hrReview?: HRReview
  isLocked: boolean
  hasObjection: boolean
}

interface SelfAssessment {
  goals: string
  achievements: string
  challenges: string
  development: string
  selfScore: number
  submittedDate?: string
}

interface ManagerEvaluation {
  performance: string
  strengths: string
  improvements: string
  goals: string
  managerScore: number
  submittedDate?: string
}

interface Meeting {
  scheduledDate: string
  notes: string
  status: "scheduled" | "completed"
  employeeObjection?: string
}

interface HRReview {
  mediatorName: string
  decision: string
  adjustedScore?: number
  notes: string
}

// Mock data - showing various states for demo
const mockCycles: AssessmentCycle[] = [
  {
    id: "1",
    name: "Q4 2025 Performance Review",
    period: "Oct - Dec 2025",
    createdDate: "2025-12-15",
    status: "completed",
    employeeId: "emp1",
    employeeName: "Jan Kowalski",
    managerId: "mgr1",
    managerName: "Anna Nowak",
    isLocked: true,
    hasObjection: false,
    selfAssessment: {
      goals: "Complete migration project",
      achievements: "Successfully migrated 80% of services",
      challenges: "Resource constraints",
      development: "Cloud architecture certification",
      selfScore: 4,
      submittedDate: "2025-12-20"
    },
    managerEvaluation: {
      performance: "Excellent work on migration",
      strengths: "Technical expertise, problem-solving",
      improvements: "Communication with stakeholders",
      goals: "Lead next major project",
      managerScore: 4,
      submittedDate: "2025-12-22"
    },
    meeting: {
      scheduledDate: "2025-12-28",
      notes: "Productive discussion about career growth",
      status: "completed"
    },
    finalScore: 4
  },
  {
    id: "2",
    name: "Q3 2025 Performance Review",
    period: "Jul - Sep 2025",
    createdDate: "2025-09-15",
    status: "waiting-self-assessment",
    employeeId: "emp2",
    employeeName: "Maria Kowalczyk",
    managerId: "mgr1",
    managerName: "Anna Nowak",
    isLocked: false,
    hasObjection: false
  },
  {
    id: "3",
    name: "Q2 2025 Performance Review",
    period: "Apr - Jun 2025",
    createdDate: "2025-06-15",
    status: "waiting-manager-approval",
    employeeId: "emp3",
    employeeName: "Piotr Nowicki",
    managerId: "mgr2",
    managerName: "Tomasz Wiśniewski",
    isLocked: false,
    hasObjection: false,
    selfAssessment: {
      goals: "Improve team collaboration and deliver Q2 features",
      achievements: "Led 3 major feature releases, mentored 2 junior developers",
      challenges: "Balancing multiple priorities and tight deadlines",
      development: "Leadership skills and project management",
      selfScore: 3.5,
      submittedDate: "2025-06-20"
    }
  },
  {
    id: "4",
    name: "Q1 2025 Performance Review",
    period: "Jan - Mar 2025",
    createdDate: "2025-03-15",
    status: "in-meeting",
    employeeId: "emp4",
    employeeName: "Katarzyna Lewandowska",
    managerId: "mgr1",
    managerName: "Anna Nowak",
    isLocked: true,
    hasObjection: false,
    selfAssessment: {
      goals: "Streamline customer support processes",
      achievements: "Reduced response time by 40%, implemented new ticketing system",
      challenges: "High volume of support requests during peak season",
      development: "Advanced customer service techniques",
      selfScore: 4.5,
      submittedDate: "2025-03-18"
    },
    managerEvaluation: {
      performance: "Outstanding performance in customer support",
      strengths: "Excellent communication, problem-solving, customer focus",
      improvements: "Could delegate more routine tasks",
      goals: "Take on team lead responsibilities",
      managerScore: 4.5,
      submittedDate: "2025-03-22"
    },
    meeting: {
      scheduledDate: "2025-03-28",
      notes: "",
      status: "scheduled"
    }
  },
  {
    id: "5",
    name: "Q4 2024 Performance Review",
    period: "Oct - Dec 2024",
    createdDate: "2024-12-15",
    status: "under-hr-review",
    employeeId: "emp5",
    employeeName: "Andrzej Zieliński",
    managerId: "mgr2",
    managerName: "Tomasz Wiśniewski",
    isLocked: true,
    hasObjection: true,
    selfAssessment: {
      goals: "Deliver backend infrastructure improvements",
      achievements: "Completed API redesign, improved system performance by 30%",
      challenges: "Limited resources and changing requirements",
      development: "System architecture and scalability",
      selfScore: 4,
      submittedDate: "2024-12-18"
    },
    managerEvaluation: {
      performance: "Good technical work but needs improvement in communication",
      strengths: "Strong technical skills, attention to detail",
      improvements: "Communication with team, meeting deadlines",
      goals: "Improve project planning and stakeholder updates",
      managerScore: 3,
      submittedDate: "2024-12-20"
    },
    meeting: {
      scheduledDate: "2024-12-28",
      notes: "Employee disagrees with manager's assessment of communication",
      status: "completed",
      employeeObjection: "I believe my communication was adequate. The changing requirements made it difficult to provide consistent updates. I maintained regular stand-ups and documented all decisions."
    }
  },
  {
    id: "6",
    name: "Q3 2024 Performance Review",
    period: "Jul - Sep 2024",
    createdDate: "2024-09-15",
    status: "new-cycle",
    employeeId: "emp6",
    employeeName: "Magdalena Dąbrowska",
    managerId: "mgr1",
    managerName: "Anna Nowak",
    isLocked: false,
    hasObjection: false
  }
]

// Status Badge Component
function StatusBadge({ status }: { status: AssessmentStatus }) {
  const config = {
    "new-cycle": { 
      label: "Nowy Cykl", 
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      icon: Plus
    },
    "waiting-self-assessment": { 
      label: "Oczekiwanie na Samoocenę", 
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      icon: FileText
    },
    "waiting-manager-approval": { 
      label: "Oczekiwanie na Akceptację Menedżera", 
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      icon: UserCheck
    },
    "in-meeting": { 
      label: "W Trakcie Spotkania", 
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: Users
    },
    "completed": { 
      label: "Zakończone", 
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      icon: CheckCircle2
    },
    "archived": { 
      label: "Zarchiwizowane", 
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      icon: Archive
    },
    "under-hr-review": { 
      label: "W Trakcie Przeglądu HR", 
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      icon: Shield
    }
  }

  const { label, color, icon: Icon } = config[status]

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}

// Progress Timeline Component
function ProgressTimeline({ status }: { status: AssessmentStatus }) {
  const steps = [
    { key: "new-cycle", label: "Utworzono" },
    { key: "waiting-self-assessment", label: "Samoocena" },
    { key: "waiting-manager-approval", label: "Przegląd Menedżera" },
    { key: "in-meeting", label: "Spotkanie" },
    { key: "completed", label: "Zakończone" }
  ]

  const statusOrder = {
    "new-cycle": 0,
    "waiting-self-assessment": 1,
    "waiting-manager-approval": 2,
    "in-meeting": 3,
    "completed": 4,
    "archived": 4,
    "under-hr-review": 3
  }

  const currentStep = statusOrder[status]

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        // @ts-ignore
        const isUpcoming = index > currentStep

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                isCompleted 
                  ? "bg-green-500 border-green-500 text-white" 
                  : isCurrent 
                    ? "bg-[#8963e4] border-[#8963e4] text-white"
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400"
              }`}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>
              <span className={`text-xs mt-1 whitespace-nowrap ${
                isCurrent ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mb-5 mx-1 ${
                isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Score Display Component
function ScoreDisplay({ score, label }: { score: number, label: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600 dark:text-green-400"
    if (score >= 3.5) return "text-blue-600 dark:text-blue-400"
    if (score >= 2.5) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
      <span className={`text-lg font-bold ${getScoreColor(score)}`}>
        {score.toFixed(1)}/5.0
      </span>
    </div>
  )
}

export function AssessmentsPage() {
  const { user } = useAuth()
  // For demo purposes, enable all features for any logged-in user
  const isManager = true
  const isHR = true
  
  const [cycles, setCycles] = useState<AssessmentCycle[]>(mockCycles)
  const [selectedCycle, setSelectedCycle] = useState<AssessmentCycle | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSelfAssessmentForm, setShowSelfAssessmentForm] = useState(false)
  const [showManagerForm, setShowManagerForm] = useState(false)
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [showHRModal, setShowHRModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")

  // Form states
  const [selfAssessmentData, setSelfAssessmentData] = useState<SelfAssessment>({
    goals: "",
    achievements: "",
    challenges: "",
    development: "",
    selfScore: 3
  })

  const [managerEvaluationData, setManagerEvaluationData] = useState<ManagerEvaluation>({
    performance: "",
    strengths: "",
    improvements: "",
    goals: "",
    managerScore: 3
  })

  const [meetingData, setMeetingData] = useState({
    scheduledDate: "",
    notes: "",
    hasObjection: false,
    objectionText: ""
  })

  const [hrReviewData, setHRReviewData] = useState({
    decision: "",
    adjustedScore: 0,
    notes: ""
  })

  // Show notification
  const showNotification = (message: string) => {
    setNotificationMessage(message)
    setTimeout(() => setNotificationMessage(""), 3000)
  }

  // Create new assessment cycle
  const handleCreateCycle = () => {
    setIsProcessing(true)
    
    setTimeout(() => {
      const newCycle: AssessmentCycle = {
        id: `cycle-${Date.now()}`,
        name: `Q1 2026 Performance Review`,
        period: "Jan - Mar 2026",
        createdDate: new Date().toISOString().split('T')[0],
        status: "new-cycle",
        // @ts-ignore Not enough time to fully implement this feature
        employeeId: user?.id || "emp1",

        employeeName: user?.name || "Current User",
        managerId: "mgr1",
        managerName: "Anna Nowak",
        isLocked: false,
        hasObjection: false
      }

      setCycles([newCycle, ...cycles])
      setShowCreateModal(false)
      setIsProcessing(false)
      showNotification("✓ Cykl ocen utworzony i powiadomienia wysłane!")

      // Auto-transition to waiting for self-assessment
      setTimeout(() => {
        setCycles(prev => prev.map(c => 
          c.id === newCycle.id 
            ? { ...c, status: "waiting-self-assessment" }
            : c
        ))
        showNotification("📧 Formularz samooceny wysłany do pracownika")
      }, 2000)
    }, 1500)
  }

  // Submit self-assessment
  const handleSubmitSelfAssessment = () => {
    // Validation
    if (!selfAssessmentData.goals.trim() || 
        !selfAssessmentData.achievements.trim() || 
        !selfAssessmentData.challenges.trim() || 
        !selfAssessmentData.development.trim()) {
      setValidationError("Wszystkie pola są wymagane. Proszę wypełnić cały formularz.")
      return
    }

    setValidationError("")
    setIsProcessing(true)

    setTimeout(() => {
      if (selectedCycle) {
        setCycles(prev => prev.map(c => 
          c.id === selectedCycle.id
            ? {
                ...c,
                selfAssessment: {
                  ...selfAssessmentData,
                  submittedDate: new Date().toISOString().split('T')[0]
                },
                status: "waiting-manager-approval"
              }
            : c
        ))
        
        setShowSelfAssessmentForm(false)
        setSelectedCycle(null)
        setIsProcessing(false)
        showNotification("✓ Samoocena przesłana! Menedżer został powiadomiony.")
        
        // Reset form
        setSelfAssessmentData({
          goals: "",
          achievements: "",
          challenges: "",
          development: "",
          selfScore: 3
        })
      }
    }, 1500)
  }

  // Submit manager evaluation
  const handleSubmitManagerEvaluation = () => {
    // Validation
    if (!managerEvaluationData.performance.trim() || 
        !managerEvaluationData.strengths.trim() || 
        !managerEvaluationData.improvements.trim() || 
        !managerEvaluationData.goals.trim()) {
      setValidationError("Wszystkie pola są wymagane. Proszę uzupełnić ewaluację.")
      return
    }

    setValidationError("")
    setIsProcessing(true)

    setTimeout(() => {
      if (selectedCycle) {
        setCycles(prev => prev.map(c => 
          c.id === selectedCycle.id
            ? {
                ...c,
                managerEvaluation: {
                  ...managerEvaluationData,
                  submittedDate: new Date().toISOString().split('T')[0]
                }
              }
            : c
        ))
        
        setShowManagerForm(false)
        setIsProcessing(false)
        showNotification("✓ Ewaluacja menedżera zapisana!")
        
        // Reset form
        setManagerEvaluationData({
          performance: "",
          strengths: "",
          improvements: "",
          goals: "",
          managerScore: 3
        })
      }
    }, 1000)
  }

  // Approve assessment for meeting
  const handleApproveForMeeting = (cycle: AssessmentCycle) => {
    setIsProcessing(true)
    
    setTimeout(() => {
      setCycles(prev => prev.map(c => 
        c.id === cycle.id
          ? {
              ...c,
              status: "in-meeting",
              isLocked: true,
              meeting: {
                scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                notes: "",
                status: "scheduled"
              }
            }
          : c
      ))
      
      setIsProcessing(false)
      showNotification("✓ Ocena zatwierdzona! Zaproszenie na spotkanie wysłane.")
    }, 1500)
  }

  // Complete meeting
  const handleCompleteMeeting = () => {
    if (!meetingData.scheduledDate || !meetingData.notes.trim()) {
      setValidationError("Proszę podać datę spotkania i notatki.")
      return
    }

    setValidationError("")
    setIsProcessing(true)

    setTimeout(() => {
      if (selectedCycle) {
        const avgScore = selectedCycle.selfAssessment && selectedCycle.managerEvaluation
          ? (selectedCycle.selfAssessment.selfScore + selectedCycle.managerEvaluation.managerScore) / 2
          : 3

        setCycles(prev => prev.map(c => 
          c.id === selectedCycle.id
            ? {
                ...c,
                meeting: {
                  scheduledDate: meetingData.scheduledDate,
                  notes: meetingData.notes,
                  status: "completed",
                  employeeObjection: meetingData.hasObjection ? meetingData.objectionText : undefined
                },
                status: meetingData.hasObjection ? "under-hr-review" : "completed",
                hasObjection: meetingData.hasObjection,
                finalScore: meetingData.hasObjection ? undefined : avgScore
              }
            : c
        ))
        
        setShowMeetingModal(false)
        setSelectedCycle(null)
        setIsProcessing(false)
        
        if (meetingData.hasObjection) {
          showNotification("⚠ Zgłoszono zastrzeżenie. Sprawa przekazana do HR.")
        } else {
          showNotification("✓ Spotkanie zakończone! Ocena sfinalizowana.")
        }
        
        // Reset form
        setMeetingData({
          scheduledDate: "",
          notes: "",
          hasObjection: false,
          objectionText: ""
        })
      }
    }, 1500)
  }

  // HR Review
  const handleHRReview = () => {
    if (!hrReviewData.decision.trim() || !hrReviewData.notes.trim()) {
      setValidationError("Proszę podać decyzję i notatki.")
      return
    }

    setValidationError("")
    setIsProcessing(true)

    setTimeout(() => {
      if (selectedCycle) {
        const finalScore = hrReviewData.adjustedScore > 0 
          ? hrReviewData.adjustedScore 
          : selectedCycle.selfAssessment && selectedCycle.managerEvaluation
            ? (selectedCycle.selfAssessment.selfScore + selectedCycle.managerEvaluation.managerScore) / 2
            : 3

        setCycles(prev => prev.map(c => 
          c.id === selectedCycle.id
            ? {
                ...c,
                hrReview: {
                  mediatorName: "HR Team",
                  decision: hrReviewData.decision,
                  adjustedScore: hrReviewData.adjustedScore > 0 ? hrReviewData.adjustedScore : undefined,
                  notes: hrReviewData.notes
                },
                status: "completed",
                finalScore: finalScore
              }
            : c
        ))
        
        setShowHRModal(false)
        setSelectedCycle(null)
        setIsProcessing(false)
        showNotification("✓ HR review completed! Assessment finalized.")
        
        // Reset form
        setHRReviewData({
          decision: "",
          adjustedScore: 0,
          notes: ""
        })
      }
    }, 1500)
  }

  // Archive assessment
  const handleArchive = (cycle: AssessmentCycle) => {
    setCycles(prev => prev.map(c => 
      c.id === cycle.id
        ? { ...c, status: "archived" }
        : c
    ))
    showNotification("✓ Ocena zarchiwizowana")
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Oceny Pracowników
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Zarządzaj okresowymi ocenami i ewaluacjami pracowników
            </p>
          </div>
          {isManager && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#8963e4] hover:bg-[#7851d4] text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Utwórz Nowy Cykl Ocen
            </button>
          )}
        </div>

        {/* Notification Toast */}
        {notificationMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top">
            <CheckCircle2 className="w-5 h-5" />
            {notificationMessage}
          </div>
        )}

        {/* Assessment Cycles List */}
        <div className="space-y-4">
          {cycles.map((cycle) => (
            <div
              key={cycle.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Cycle Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {cycle.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {cycle.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {cycle.employeeName}
                      </span>
                      {cycle.isLocked && (
                        <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                          <Lock className="w-4 h-4" />
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={cycle.status} />
                </div>

                {/* Progress Timeline */}
                <ProgressTimeline status={cycle.status} />
              </div>

              {/* Cycle Content */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
                {/* New Cycle State */}
                {cycle.status === "new-cycle" && (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Cykl ocen utworzony. Przygotowywanie formularzy i powiadomień...
                    </p>
                  </div>
                )}

                {/* Waiting for Self-Assessment */}
                {cycle.status === "waiting-self-assessment" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          Wymagana Samoocena
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Proszę wypełnić formularz samooceny
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCycle(cycle)
                          setShowSelfAssessmentForm(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Wypełnij Formularz
                      </button>
                    </div>
                  </div>
                )}

                {/* Waiting for Manager Approval */}
                {cycle.status === "waiting-manager-approval" && cycle.selfAssessment && (
                  <div className="space-y-4">
                    {/* Self-Assessment Summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Samoocena Przesłana
                        </h4>
                        <ScoreDisplay score={cycle.selfAssessment.selfScore} label="Samoocena" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Cele:</span>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">{cycle.selfAssessment.goals}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Osiągnięcia:</span>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">{cycle.selfAssessment.achievements}</p>
                        </div>
                      </div>
                    </div>

                    {/* Manager Actions */}
                    {isManager && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedCycle(cycle)
                            setShowManagerForm(true)
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          {cycle.managerEvaluation ? "Edytuj Ewaluację" : "Dodaj Ewaluację Menedżera"}
                        </button>
                        {cycle.managerEvaluation && (
                          <button
                            onClick={() => handleApproveForMeeting(cycle)}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                            Zatwierdź do Spotkania
                          </button>
                        )}
                      </div>
                    )}

                    {/* Manager Evaluation Summary */}
                    {cycle.managerEvaluation && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <UserCheck className="w-4 h-4" />
                            Ewaluacja Menedżera
                          </h4>
                          <ScoreDisplay score={cycle.managerEvaluation.managerScore} label="Ocena Menedżera" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Wydajność:</span>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{cycle.managerEvaluation.performance}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Mocne Strony:</span>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{cycle.managerEvaluation.strengths}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* In Meeting */}
                {cycle.status === "in-meeting" && cycle.meeting && (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <div>
                          <p className="font-medium text-yellow-900 dark:text-yellow-100">
                            Spotkanie Oceniające {cycle.meeting.status === "scheduled" ? "Zaplanowane" : "Zakończone"}
                          </p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Data: {new Date(cycle.meeting.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {isManager && cycle.meeting.status === "scheduled" && (
                        <button
                          onClick={() => {
                            setSelectedCycle(cycle)
                            setShowMeetingModal(true)
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Zakończ Spotkanie
                        </button>
                      )}
                    </div>

                    {/* Show scores */}
                    <div className="flex gap-4">
                      {cycle.selfAssessment && (
                        <ScoreDisplay score={cycle.selfAssessment.selfScore} label="Samoocena" />
                      )}
                      {cycle.managerEvaluation && (
                        <ScoreDisplay score={cycle.managerEvaluation.managerScore} label="Ocena Menedżera" />
                      )}
                    </div>
                  </div>
                )}

                {/* Under HR Review */}
                {cycle.status === "under-hr-review" && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <div>
                          <p className="font-medium text-orange-900 dark:text-orange-100">
                            Sprawa w Przeglądzie HR
                          </p>
                          <p className="text-sm text-orange-700 dark:text-orange-300">
                            Pracownik zgłosił zastrzeżenie podczas spotkania oceniającego
                          </p>
                        </div>
                      </div>
                      {cycle.meeting?.employeeObjection && (
                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-orange-200 dark:border-orange-700">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zastrzeżenie Pracownika:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cycle.meeting.employeeObjection}</p>
                        </div>
                      )}
                      {isHR && (
                        <button
                          onClick={() => {
                            setSelectedCycle(cycle)
                            setShowHRModal(true)
                          }}
                          className="mt-3 flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Przejrzyj Sprawę
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Completed */}
                {cycle.status === "completed" && cycle.finalScore && (
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                      <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                      <p className="font-semibold text-green-900 dark:text-green-100 text-lg mb-2">
                        Ocena Zakończona
                      </p>
                      <div className="flex items-center justify-center gap-6 mb-4">
                        {cycle.selfAssessment && (
                          <ScoreDisplay score={cycle.selfAssessment.selfScore} label="Samoocena" />
                        )}
                        {cycle.managerEvaluation && (
                          <ScoreDisplay score={cycle.managerEvaluation.managerScore} label="Ocena Menedżera" />
                        )}
                        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
                        <ScoreDisplay score={cycle.finalScore} label="Ocena Końcowa" />
                      </div>
                      {cycle.hrReview && (
                        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-green-200 dark:border-green-700 text-left">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Przegląd HR:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cycle.hrReview.decision}</p>
                        </div>
                      )}
                      {isManager && cycle.status === "completed" && (
                        <button
                          onClick={() => handleArchive(cycle)}
                          className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors mx-auto"
                        >
                          <Archive className="w-4 h-4" />
                          Zarchiwizuj Ocenę
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Archived */}
                {cycle.status === "archived" && (
                  <div className="text-center py-8">
                    <Archive className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Ta ocena została zarchiwizowana i jest tylko do odczytu
                    </p>
                    {cycle.finalScore && (
                      <div className="mt-4">
                        <ScoreDisplay score={cycle.finalScore} label="Ocena Końcowa" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {cycles.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Brak Cykli Ocen
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Utwórz swój pierwszy cykl ocen, aby rozpocząć
              </p>
              {isManager && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#8963e4] hover:bg-[#7851d4] text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Utwórz Cykl Ocen
                </button>
              )}
            </div>
          )}
        </div>

        {/* Create Cycle Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Utwórz Nowy Cykl Ocen
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  To utworzy nowy cykl ocen Q1 2026 i automatycznie:
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Wygeneruje formularze ocen
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Wyśle powiadomienia e-mail do pracowników
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Zainicjuje system śledzenia
                  </li>
                </ul>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleCreateCycle}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-[#8963e4] hover:bg-[#7851d4] text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Tworzenie...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Utwórz Cykl
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Self-Assessment Form Modal */}
        {showSelfAssessmentForm && selectedCycle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Formularz Samooceny
                </h3>
                <button
                  onClick={() => {
                    setShowSelfAssessmentForm(false)
                    setValidationError("")
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {validationError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{validationError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cele na ten okres *
                  </label>
                  <textarea
                    value={selfAssessmentData.goals}
                    onChange={(e) => setSelfAssessmentData({ ...selfAssessmentData, goals: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Jakie były Twoje główne cele?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kluczowe Osiągnięcia *
                  </label>
                  <textarea
                    value={selfAssessmentData.achievements}
                    onChange={(e) => setSelfAssessmentData({ ...selfAssessmentData, achievements: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Co udało Ci się osiągnąć?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Napotkane Wyzwania *
                  </label>
                  <textarea
                    value={selfAssessmentData.challenges}
                    onChange={(e) => setSelfAssessmentData({ ...selfAssessmentData, challenges: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Jakie przeszkody napotkałeś?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Obszary Rozwoju *
                  </label>
                  <textarea
                    value={selfAssessmentData.development}
                    onChange={(e) => setSelfAssessmentData({ ...selfAssessmentData, development: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Jakie umiejętności chcesz rozwijać?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Samoocena: {selfAssessmentData.selfScore}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={selfAssessmentData.selfScore}
                    onChange={(e) => setSelfAssessmentData({ ...selfAssessmentData, selfScore: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Wymaga Poprawy</span>
                    <span>Doskonale</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowSelfAssessmentForm(false)
                      setValidationError("")
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleSubmitSelfAssessment}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-[#8963e4] hover:bg-[#7851d4] text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Przesyłanie...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Prześlij Ocenę
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manager Evaluation Form Modal */}
        {showManagerForm && selectedCycle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Formularz Ewaluacji Menedżera
                </h3>
                <button
                  onClick={() => {
                    setShowManagerForm(false)
                    setValidationError("")
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {validationError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{validationError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Podsumowanie Wydajności *
                  </label>
                  <textarea
                    value={managerEvaluationData.performance}
                    onChange={(e) => setManagerEvaluationData({ ...managerEvaluationData, performance: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Ogólna ocena wydajności"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kluczowe Mocne Strony *
                  </label>
                  <textarea
                    value={managerEvaluationData.strengths}
                    onChange={(e) => setManagerEvaluationData({ ...managerEvaluationData, strengths: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Jakie są główne mocne strony?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Obszary do Poprawy *
                  </label>
                  <textarea
                    value={managerEvaluationData.improvements}
                    onChange={(e) => setManagerEvaluationData({ ...managerEvaluationData, improvements: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Co można poprawić?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cele na Następny Okres *
                  </label>
                  <textarea
                    value={managerEvaluationData.goals}
                    onChange={(e) => setManagerEvaluationData({ ...managerEvaluationData, goals: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Na czym powinni się skupić?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ocena Menedżera: {managerEvaluationData.managerScore}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={managerEvaluationData.managerScore}
                    onChange={(e) => setManagerEvaluationData({ ...managerEvaluationData, managerScore: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Wymaga Poprawy</span>
                    <span>Doskonale</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowManagerForm(false)
                      setValidationError("")
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleSubmitManagerEvaluation}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-[#8963e4] hover:bg-[#7851d4] text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Zapisywanie...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Zapisz Ewaluację
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meeting Modal */}
        {showMeetingModal && selectedCycle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Zakończ Spotkanie Oceniające
                </h3>
                <button
                  onClick={() => {
                    setShowMeetingModal(false)
                    setValidationError("")
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {validationError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{validationError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Spotkania *
                  </label>
                  <input
                    type="date"
                    value={meetingData.scheduledDate}
                    onChange={(e) => setMeetingData({ ...meetingData, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notatki ze Spotkania *
                  </label>
                  <textarea
                    value={meetingData.notes}
                    onChange={(e) => setMeetingData({ ...meetingData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={4}
                    placeholder="Podsumowanie dyskusji, uzgodnień i działań"
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={meetingData.hasObjection}
                      onChange={(e) => setMeetingData({ ...meetingData, hasObjection: e.target.checked })}
                      className="w-4 h-4 text-[#8963e4] border-gray-300 rounded focus:ring-[#8963e4]"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pracownik zgłosił zastrzeżenie do oceny
                    </span>
                  </label>
                </div>

                {meetingData.hasObjection && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Szczegóły Zastrzeżenia
                    </label>
                    <textarea
                      value={meetingData.objectionText}
                      onChange={(e) => setMeetingData({ ...meetingData, objectionText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      rows={3}
                      placeholder="Opisz obawy lub zastrzeżenia pracownika"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowMeetingModal(false)
                      setValidationError("")
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleCompleteMeeting}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-[#8963e4] hover:bg-[#7851d4] text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Przetwarzanie...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Zakończ Spotkanie
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HR Review Modal */}
        {showHRModal && selectedCycle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Przegląd Mediacyjny HR
                </h3>
                <button
                  onClick={() => {
                    setShowHRModal(false)
                    setValidationError("")
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {validationError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{validationError}</span>
                  </div>
                )}

                {/* Show original scores */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Oryginalne Oceny</h4>
                  <div className="flex gap-4">
                    {selectedCycle.selfAssessment && (
                      <ScoreDisplay score={selectedCycle.selfAssessment.selfScore} label="Samoocena" />
                    )}
                    {selectedCycle.managerEvaluation && (
                      <ScoreDisplay score={selectedCycle.managerEvaluation.managerScore} label="Ocena Menedżera" />
                    )}
                  </div>
                  {selectedCycle.meeting?.employeeObjection && (
                    <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zastrzeżenie Pracownika:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCycle.meeting.employeeObjection}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Decyzja HR *
                  </label>
                  <textarea
                    value={hrReviewData.decision}
                    onChange={(e) => setHRReviewData({ ...hrReviewData, decision: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Decyzja i uzasadnienie HR"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skorygowana Ocena (opcjonalnie)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.5"
                    value={hrReviewData.adjustedScore || ""}
                    onChange={(e) => setHRReviewData({ ...hrReviewData, adjustedScore: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Pozostaw puste, aby zachować średnią ocenę"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Jeśli pozostanie puste, zostanie użyta średnia z samooceny i oceny menedżera
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notatki z Przeglądu *
                  </label>
                  <textarea
                    value={hrReviewData.notes}
                    onChange={(e) => setHRReviewData({ ...hrReviewData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    rows={4}
                    placeholder="Szczegółowe notatki dotyczące procesu mediacji i wyniku"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowHRModal(false)
                      setValidationError("")
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleHRReview}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-[#8963e4] hover:bg-[#7851d4] text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Przetwarzanie...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Sfinalizuj Przegląd
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
