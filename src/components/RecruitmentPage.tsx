import { useState } from "react"
import { 
  Briefcase, Users, CheckCircle, XCircle, Clock, Plus, Search, Filter, 
  Calendar, Mail, Phone, FileText, Video, Download, Archive,
  AlertCircle, Eye, Edit, UserCheck, UserX,
  Bell, CheckSquare, ChevronRight, ChevronDown, ExternalLink
} from "lucide-react"

// Types
type JobStatus = "pending_approval" | "published" | "technical_interviews" | "closed"
type CandidateStatus = "applied" | "hr_screening" | "technical_interview" | "approved" | "rejected"
type InterviewDecision = "positive" | "negative" | "pending"

interface JobOpening {
  id: string
  title: string
  department: string
  status: JobStatus
  applicationsCount: number
  rejectedCount: number
  shortlistedCount: number
  interviewedCount: number
  budgetApproved: boolean
  createdDate: string
  publishedDate?: string
}

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  jobId: string
  status: CandidateStatus
  appliedDate: string
  cvUrl: string
  hrDecision?: "approved" | "rejected"
  managerDecision?: "approved" | "rejected"
  technicalDecision?: InterviewDecision
  interviewDate?: string
}

interface AutomationEvent {
  id: string
  type: "email" | "sms" | "notification" | "document" | "archive"
  description: string
  timestamp: string
  status: "completed" | "pending" | "failed"
}

// Mock Data
const mockJobs: JobOpening[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "IT",
    status: "technical_interviews",
    applicationsCount: 24,
    rejectedCount: 8,
    shortlistedCount: 12,
    interviewedCount: 4,
    budgetApproved: true,
    createdDate: "2026-01-10",
    publishedDate: "2026-01-12"
  },
  {
    id: "2",
    title: "HR Manager",
    department: "HR",
    status: "published",
    applicationsCount: 15,
    rejectedCount: 3,
    shortlistedCount: 8,
    interviewedCount: 0,
    budgetApproved: true,
    createdDate: "2026-01-15",
    publishedDate: "2026-01-16"
  },
  {
    id: "3",
    title: "Marketing Specialist",
    department: "Marketing",
    status: "pending_approval",
    applicationsCount: 0,
    rejectedCount: 0,
    shortlistedCount: 0,
    interviewedCount: 0,
    budgetApproved: false,
    createdDate: "2026-01-17"
  },
  {
    id: "4",
    title: "Backend Developer",
    department: "IT",
    status: "closed",
    applicationsCount: 32,
    rejectedCount: 25,
    shortlistedCount: 5,
    interviewedCount: 2,
    budgetApproved: true,
    createdDate: "2025-12-20",
    publishedDate: "2025-12-22"
  }
]

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Anna Kowalska",
    email: "anna.kowalska@email.com",
    phone: "+48 123 456 789",
    jobId: "1",
    status: "technical_interview",
    appliedDate: "2026-01-13",
    cvUrl: "#",
    hrDecision: "approved",
    technicalDecision: "pending",
    interviewDate: "2026-01-20"
  },
  {
    id: "2",
    name: "Piotr Nowak",
    email: "piotr.nowak@email.com",
    phone: "+48 234 567 890",
    jobId: "1",
    status: "hr_screening",
    appliedDate: "2026-01-14",
    cvUrl: "#",
    hrDecision: "approved"
  },
  {
    id: "3",
    name: "Maria Wiśniewska",
    email: "maria.wisniewska@email.com",
    phone: "+48 345 678 901",
    jobId: "1",
    status: "rejected",
    appliedDate: "2026-01-12",
    cvUrl: "#",
    hrDecision: "rejected"
  },
  {
    id: "4",
    name: "Jan Kowalczyk",
    email: "jan.kowalczyk@email.com",
    phone: "+48 456 789 012",
    jobId: "1",
    status: "approved",
    appliedDate: "2026-01-11",
    cvUrl: "#",
    hrDecision: "approved",
    managerDecision: "approved",
    technicalDecision: "positive"
  }
]

// Status Badge Component
function StatusBadge({ status }: { status: JobStatus | CandidateStatus }) {
  const statusConfig = {
    pending_approval: { label: "Oczekuje zatwierdzenia", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    published: { label: "Opublikowana", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    technical_interviews: { label: "Rozmowy techniczne", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
    closed: { label: "Zamknięta", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },
    applied: { label: "Aplikacja złożona", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    hr_screening: { label: "Screening HR", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" },
    technical_interview: { label: "Rozmowa techniczna", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
    approved: { label: "Zaakceptowany", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    rejected: { label: "Odrzucony", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" }
  }

  const config = statusConfig[status]
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

// Automation Indicator Component
function AutomationIndicator({ events }: { events: AutomationEvent[] }) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div className="bg-gradient-to-r from-[#8963e4]/10 to-[#a87ef5]/10 dark:from-[#8963e4]/20 dark:to-[#a87ef5]/20 rounded-lg p-4 border border-[#8963e4]/20">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#8963e4] rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Automatyzacje systemowe aktywne
          </span>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </div>
      
      {expanded && (
        <div className="mt-4 space-y-2">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-3 text-sm">
              <div className="mt-1">
                {event.type === "email" && <Mail className="w-4 h-4 text-[#8963e4]" />}
                {event.type === "sms" && <Phone className="w-4 h-4 text-[#8963e4]" />}
                {event.type === "notification" && <Bell className="w-4 h-4 text-[#8963e4]" />}
                {event.type === "document" && <FileText className="w-4 h-4 text-[#8963e4]" />}
                {event.type === "archive" && <Archive className="w-4 h-4 text-[#8963e4]" />}
              </div>
              <div className="flex-1">
                <p className="text-gray-700 dark:text-gray-300">{event.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.timestamp}</p>
              </div>
              {event.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
              {event.status === "pending" && <Clock className="w-4 h-4 text-yellow-500" />}
              {event.status === "failed" && <XCircle className="w-4 h-4 text-red-500" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Main Dashboard View
function DashboardView({ onViewJob, onCreateJob }: { onViewJob: (id: string) => void, onCreateJob: () => void }) {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel Rekrutacji</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Zarządzaj procesami rekrutacyjnymi i kandydatami</p>
        </div>
        <button 
          onClick={onCreateJob}
          className="flex items-center gap-2 bg-[#8963e4] hover:bg-[#7952d3] text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Utwórz ogłoszenie
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aktywne ogłoszenia</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">3</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kandydaci ogółem</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">39</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12 w tym tygodniu</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rozmowy techniczne</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">4</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Zaplanowane</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Zaakceptowani</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">1</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Oczekuje na umowę</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Job Openings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Aktywne ogłoszenia</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stanowisko
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aplikacje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Odrzuceni
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Shortlista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rozmowy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Budżet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {mockJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{job.department}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 dark:text-white font-medium">{job.applicationsCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-red-600 dark:text-red-400">{job.rejectedCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-blue-600 dark:text-blue-400">{job.shortlistedCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-purple-600 dark:text-purple-400">{job.interviewedCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    {job.budgetApproved ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onViewJob(job.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                        title="Zobacz szczegóły"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors" title="Edytuj">
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Automations */}
      <AutomationIndicator events={[
        { id: "1", type: "notification", description: "Powiadomienie do HR o nowej aplikacji", timestamp: "5 min temu", status: "completed" },
        { id: "2", type: "email", description: "Email z zaproszeniem na rozmowę wysłany do Anna Kowalska", timestamp: "1 godz. temu", status: "completed" },
        { id: "3", type: "sms", description: "SMS przypomnienie o rozmowie technicznej", timestamp: "2 godz. temu", status: "completed" },
        { id: "4", type: "document", description: "Generowanie umowy PDF dla Jan Kowalczyk", timestamp: "Zaplanowane na jutro", status: "pending" }
      ]} />
    </div>
  )
}

// Job Opening Detail View
function JobOpeningView({ jobId, onBack, onViewCandidate }: { jobId: string, onBack: () => void, onViewCandidate: (id: string) => void }) {
  const job = mockJobs.find(j => j.id === jobId)
  const candidates = mockCandidates.filter(c => c.jobId === jobId)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  if (!job) return null

  const filteredCandidates = filterStatus === "all" 
    ? candidates 
    : candidates.filter(c => c.status === filterStatus)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{job.department}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Job Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Opis stanowiska</h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Wymagania:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>5+ lat doświadczenia w rozwoju aplikacji frontendowych</li>
                  <li>Zaawansowana znajomość React, TypeScript, i nowoczesnych narzędzi</li>
                  <li>Doświadczenie z systemami projektowania i komponentami UI</li>
                  <li>Znajomość testowania (Jest, React Testing Library)</li>
                  <li>Umiejętność pracy w zespole Agile/Scrum</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Oferujemy:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Konkurencyjne wynagrodzenie (15,000 - 20,000 PLN brutto)</li>
                  <li>Praca zdalna lub hybrydowa</li>
                  <li>Pakiet benefitów (prywatna opieka medyczna, karta sportowa)</li>
                  <li>Budżet na rozwój i szkolenia</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Oś czasu procesu</h3>
            <div className="space-y-4">
              {[
                { label: "Utworzenie ogłoszenia", date: job.createdDate, status: "completed" },
                { label: "Publikacja oferty", date: job.publishedDate || "—", status: job.publishedDate ? "completed" : "pending" },
                { label: "Napływające aplikacje", date: "W trakcie", status: job.applicationsCount > 0 ? "active" : "pending" },
                { label: "Screening HR", date: "W trakcie", status: "active" },
                { label: "Rozmowy techniczne", date: "W trakcie", status: job.interviewedCount > 0 ? "active" : "pending" },
                { label: "Decyzja finalna", date: "Oczekuje", status: "pending" }
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === "completed" ? "bg-green-500" :
                      step.status === "active" ? "bg-blue-500 animate-pulse" :
                      "bg-gray-300 dark:bg-gray-600"
                    }`}>
                      {step.status === "completed" && <CheckCircle className="w-5 h-5 text-white" />}
                      {step.status === "active" && <Clock className="w-5 h-5 text-white" />}
                      {step.status === "pending" && <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                    {index < 5 && (
                      <div className={`w-0.5 h-8 ${
                        step.status === "completed" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-gray-900 dark:text-white">{step.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Budget Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status budżetu</h3>
            <div className={`flex items-center gap-3 p-4 rounded-lg ${
              job.budgetApproved 
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
            }`}>
              {job.budgetApproved ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-300">Zatwierdzony</p>
                    <p className="text-sm text-green-700 dark:text-green-400">Budżet został zaakceptowany</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-300">Oczekuje</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">Wymaga zatwierdzenia</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statystyki</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Aplikacje</span>
                <span className="font-semibold text-gray-900 dark:text-white">{job.applicationsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Shortlista</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{job.shortlistedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rozmowy</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{job.interviewedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Odrzuceni</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{job.rejectedCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Szybkie akcje</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-[#8963e4] hover:bg-[#7952d3] text-white rounded-lg transition-colors">
                <Calendar className="w-4 h-4" />
                Zaplanuj rozmowę
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Eksportuj dane
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
                Edytuj ogłoszenie
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kandydaci</h3>
            <div className="flex items-center gap-2">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">Wszyscy</option>
                <option value="applied">Aplikacja złożona</option>
                <option value="hr_screening">Screening HR</option>
                <option value="technical_interview">Rozmowa techniczna</option>
                <option value="approved">Zaakceptowani</option>
                <option value="rejected">Odrzuceni</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kandydat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data aplikacji
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Decyzja HR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Decyzja techniczna
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={candidate.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{candidate.appliedDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    {candidate.hrDecision === "approved" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {candidate.hrDecision === "rejected" && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    {!candidate.hrDecision && (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {candidate.technicalDecision === "positive" && (
                      <span className="text-green-600 dark:text-green-400 font-medium">Pozytywna</span>
                    )}
                    {candidate.technicalDecision === "negative" && (
                      <span className="text-red-600 dark:text-red-400 font-medium">Negatywna</span>
                    )}
                    {candidate.technicalDecision === "pending" && (
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">Oczekuje</span>
                    )}
                    {!candidate.technicalDecision && (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onViewCandidate(candidate.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Zobacz profil"
                    >
                      <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Candidate Detail View
function CandidateView({ candidateId, onBack, onScheduleInterview }: { 
  candidateId: string, 
  onBack: () => void,
  onScheduleInterview: (candidateId: string) => void 
}) {
  const candidate = mockCandidates.find(c => c.id === candidateId)
  const job = candidate ? mockJobs.find(j => j.id === candidate.jobId) : null

  if (!candidate || !job) return null

  const eventHistory = [
    { id: "1", type: "email", description: "Potwierdzenie otrzymania aplikacji", timestamp: "2026-01-13 10:30", status: "completed" },
    { id: "2", type: "notification", description: "Powiadomienie HR o nowej aplikacji", timestamp: "2026-01-13 10:31", status: "completed" },
    { id: "3", type: "email", description: "Zaproszenie na rozmowę wstępną", timestamp: "2026-01-15 14:00", status: "completed" },
    { id: "4", type: "sms", description: "SMS przypomnienie o rozmowie", timestamp: "2026-01-19 09:00", status: "completed" },
    { id: "5", type: "email", description: "Zaproszenie na rozmowę techniczną", timestamp: "2026-01-20 10:00", status: candidate.interviewDate ? "completed" : "pending" }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{candidate.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Aplikacja na: {job.title}</p>
        </div>
        <StatusBadge status={candidate.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dane osobowe</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {candidate.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {candidate.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Data aplikacji</p>
                <p className="font-medium text-gray-900 dark:text-white">{candidate.appliedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">CV</p>
                <a 
                  href={candidate.cvUrl} 
                  className="font-medium text-[#8963e4] hover:text-[#7952d3] flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Pobierz CV
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Decisions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Decyzje</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Decyzja HR</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Screening wstępny</p>
                </div>
                {candidate.hrDecision === "approved" && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Zaakceptowany</span>
                  </div>
                )}
                {candidate.hrDecision === "rejected" && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Odrzucony</span>
                  </div>
                )}
                {!candidate.hrDecision && (
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Oczekuje</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Decyzja Managera</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Akceptacja do procesu</p>
                </div>
                {candidate.managerDecision === "approved" && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Zaakceptowany</span>
                  </div>
                )}
                {candidate.managerDecision === "rejected" && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Odrzucony</span>
                  </div>
                )}
                {!candidate.managerDecision && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Oczekuje</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Rozmowa techniczna</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ocena umiejętności technicznych</p>
                </div>
                {candidate.technicalDecision === "positive" && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Pozytywna</span>
                  </div>
                )}
                {candidate.technicalDecision === "negative" && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Negatywna</span>
                  </div>
                )}
                {candidate.technicalDecision === "pending" && (
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Zaplanowana</span>
                  </div>
                )}
                {!candidate.technicalDecision && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Nie zaplanowana</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Event History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Historia zdarzeń</h3>
            <div className="space-y-4">
              {eventHistory.map((event, index) => (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                    }`}>
                      {event.type === "email" && <Mail className="w-4 h-4 text-white" />}
                      {event.type === "sms" && <Phone className="w-4 h-4 text-white" />}
                      {event.type === "notification" && <Bell className="w-4 h-4 text-white" />}
                    </div>
                    {index < eventHistory.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-gray-900 dark:text-white">{event.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.timestamp}</p>
                  </div>
                  {event.status === "completed" && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Interview Info */}
          {candidate.interviewDate && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-300">Rozmowa techniczna</h3>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-400 mb-2">
                Zaplanowana na:
              </p>
              <p className="font-medium text-purple-900 dark:text-purple-300">{candidate.interviewDate}</p>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Akcje</h3>
            <div className="space-y-2">
              {candidate.status !== "rejected" && (
                <>
                  <button className="w-full flex items-center gap-2 px-4 py-2 bg-[#8963e4] hover:bg-[#7952d3] text-white rounded-lg transition-colors">
                    <UserCheck className="w-4 h-4" />
                    Zatwierdź kandydata
                  </button>
                  <button 
                    onClick={() => onScheduleInterview(candidate.id)}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    Zaplanuj rozmowę
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                    <Mail className="w-4 h-4" />
                    Wyślij wiadomość
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors">
                    <UserX className="w-4 h-4" />
                    Odrzuć kandydata
                  </button>
                </>
              )}
              {candidate.status === "approved" && (
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  Generuj umowę
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notatki</h3>
            <textarea 
              className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
              placeholder="Dodaj notatki o kandydacie..."
            />
            <button className="mt-2 w-full px-4 py-2 bg-[#8963e4] hover:bg-[#7952d3] text-white rounded-lg transition-colors text-sm">
              Zapisz notatkę
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Technical Interview View
function TechnicalInterviewView({ candidateId, onBack, onSaveDecision }: { 
  candidateId: string, 
  onBack: () => void,
  onSaveDecision: (decision: InterviewDecision, notes: string) => void 
}) {
  const candidate = mockCandidates.find(c => c.id === candidateId)
  const [decision, setDecision] = useState<InterviewDecision>("pending")
  const [notes, setNotes] = useState("")
  const [skillRatings, setSkillRatings] = useState({
    technical: 0,
    communication: 0,
    problemSolving: 0,
    teamwork: 0
  })

  if (!candidate) return null

  const handleSave = () => {
    onSaveDecision(decision, notes)
    onBack()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rozmowa techniczna</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{candidate.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Participants */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Uczestnicy</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 bg-[#8963e4] rounded-full flex items-center justify-center text-white font-semibold">
                  M
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Manager</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Połączony
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {candidate.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Połączony
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Evaluation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ocena techniczna</h3>
            <div className="space-y-4">
              {[
                { key: "technical", label: "Umiejętności techniczne", description: "Znajomość technologii i narzędzi" },
                { key: "communication", label: "Komunikacja", description: "Jasność przekazu i wyrażania myśli" },
                { key: "problemSolving", label: "Rozwiązywanie problemów", description: "Podejście do wyzwań technicznych" },
                { key: "teamwork", label: "Praca zespołowa", description: "Współpraca i kultura pracy" }
              ].map((skill) => (
                <div key={skill.key}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{skill.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{skill.description}</p>
                    </div>
                    <span className="text-lg font-bold text-[#8963e4]">
                      {skillRatings[skill.key as keyof typeof skillRatings]}/5
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSkillRatings({ ...skillRatings, [skill.key]: rating })}
                        className={`flex-1 h-10 rounded-lg border-2 transition-colors ${
                          skillRatings[skill.key as keyof typeof skillRatings] >= rating
                            ? "bg-[#8963e4] border-[#8963e4] text-white"
                            : "border-gray-300 dark:border-gray-600 hover:border-[#8963e4]"
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Komentarze i notatki</h3>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Dodaj szczegółowe notatki z rozmowy technicznej..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Decision */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Decyzja</h3>
            <div className="space-y-3">
              <button
                onClick={() => setDecision("positive")}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  decision === "positive"
                    ? "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600"
                    : "border-gray-300 dark:border-gray-600 hover:border-green-500"
                }`}
              >
                <CheckCircle className={`w-6 h-6 ${
                  decision === "positive" ? "text-green-600 dark:text-green-400" : "text-gray-400"
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Pozytywna</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rekomendacja zatrudnienia</p>
                </div>
              </button>

              <button
                onClick={() => setDecision("negative")}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  decision === "negative"
                    ? "bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-600"
                    : "border-gray-300 dark:border-gray-600 hover:border-red-500"
                }`}
              >
                <XCircle className={`w-6 h-6 ${
                  decision === "negative" ? "text-red-600 dark:text-red-400" : "text-gray-400"
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Negatywna</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Nie rekomenduje zatrudnienia</p>
                </div>
              </button>

              <button
                onClick={() => setDecision("pending")}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  decision === "pending"
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-600"
                    : "border-gray-300 dark:border-gray-600 hover:border-yellow-500"
                }`}
              >
                <Clock className={`w-6 h-6 ${
                  decision === "pending" ? "text-yellow-600 dark:text-yellow-400" : "text-gray-400"
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Wymaga dyskusji</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Potrzebna dodatkowa ocena</p>
                </div>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#8963e4] hover:bg-[#7952d3] text-white rounded-lg transition-colors font-medium"
          >
            <CheckSquare className="w-5 h-5" />
            Zapisz decyzję
          </button>

          {/* Interview Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Informacje o rozmowie</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Data</span>
                <span className="text-gray-900 dark:text-white">{candidate.interviewDate || "Dziś"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Czas trwania</span>
                <span className="text-gray-900 dark:text-white">45 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Format</span>
                <span className="text-gray-900 dark:text-white">Online</span>
              </div>
            </div>
          </div>

          {/* Automation Notice */}
          <div className="bg-gradient-to-r from-[#8963e4]/10 to-[#a87ef5]/10 dark:from-[#8963e4]/20 dark:to-[#a87ef5]/20 rounded-lg p-4 border border-[#8963e4]/20">
            <div className="flex items-start gap-2">
              <Bell className="w-5 h-5 text-[#8963e4] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Automatyzacja aktywna</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Po zapisaniu decyzji system automatycznie wyśle powiadomienia do HR i kandydata.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Component
export function RecruitmentPage() {
  const [currentView, setCurrentView] = useState<"dashboard" | "job" | "candidate" | "interview">("dashboard")
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)

  const handleViewJob = (jobId: string) => {
    setSelectedJobId(jobId)
    setCurrentView("job")
  }

  const handleViewCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId)
    setCurrentView("candidate")
  }

  const handleScheduleInterview = (candidateId: string) => {
    setSelectedCandidateId(candidateId)
    setCurrentView("interview")
  }

  const handleSaveDecision = (decision: InterviewDecision, notes: string) => {
    console.log("Decision saved:", decision, notes)
    // In a real app, this would save to backend
  }

  const handleBack = () => {
    if (currentView === "interview" || currentView === "candidate") {
      setCurrentView("job")
    } else if (currentView === "job") {
      setCurrentView("dashboard")
      setSelectedJobId(null)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {currentView === "dashboard" && (
          <DashboardView 
            onViewJob={handleViewJob}
            onCreateJob={() => alert("Funkcja tworzenia ogłoszenia - do implementacji")}
          />
        )}
        
        {currentView === "job" && selectedJobId && (
          <JobOpeningView 
            jobId={selectedJobId}
            onBack={handleBack}
            onViewCandidate={handleViewCandidate}
          />
        )}
        
        {currentView === "candidate" && selectedCandidateId && (
          <CandidateView 
            candidateId={selectedCandidateId}
            onBack={handleBack}
            onScheduleInterview={handleScheduleInterview}
          />
        )}
        
        {currentView === "interview" && selectedCandidateId && (
          <TechnicalInterviewView 
            candidateId={selectedCandidateId}
            onBack={handleBack}
            onSaveDecision={handleSaveDecision}
          />
        )}
      </div>
    </div>
  )
}
