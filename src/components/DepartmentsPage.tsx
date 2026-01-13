import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users } from "lucide-react"

interface Department {
  id: number
  name: string
  manager: string
  employeesCount: number
  description: string
}

const initialDepartments: Department[] = [
  { id: 1, name: "Zarząd", manager: "Aleksandra Kowalska", employeesCount: 1, description: "Kierownictwo firmy" },
  { id: 2, name: "IT", manager: "Bartosz Nowak", employeesCount: 1, description: "Rozwój oprogramowania" },
  { id: 3, name: "Design", manager: "Klara Wiśniewska", employeesCount: 1, description: "Projektowanie UX/UI" },
]

export function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.manager.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleClear = () => {
    setSearchQuery("")
  }

  const handleDelete = (id: number) => {
    setDepartments(departments.filter((dept) => dept.id !== id))
  }

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeesCount, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Search and Stats Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search Section */}
        <div className="flex items-center gap-3 w-full sm:flex-1 sm:max-w-xl bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <Input
            type="text"
            placeholder="Wyszukaj dział"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <Button
            onClick={handleClear}
            className="bg-[#8963e4] hover:bg-[#7852d4] text-white"
          >
            Wyczyść
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-sm border border-gray-100 dark:border-gray-700 min-w-[100px]">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Działy</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{departments.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-sm border border-gray-100 dark:border-gray-700 min-w-[100px]">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pracownicy</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalEmployees}</div>
          </div>
        </div>
      </div>

      {/* Departments Table - Desktop */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 dark:border-gray-700">
              <TableHead className="w-16 font-semibold text-gray-900 dark:text-white">#</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Nazwa działu</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Kierownik</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Pracownicy</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Opis</TableHead>
              <TableHead className="w-24 font-semibold text-gray-900 dark:text-white">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDepartments.map((department, index) => (
              <TableRow key={department.id} className="border-b border-gray-50 dark:border-gray-700">
                <TableCell className="text-gray-600 dark:text-gray-400">{index + 1}</TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-white">{department.name}</TableCell>
                <TableCell className="text-gray-900 dark:text-white">{department.manager}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{department.employeesCount}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 dark:text-gray-400">{department.description}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(department.id)}
                    className="text-red-500 border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  >
                    Usuń
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Departments Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredDepartments.map((department, index) => (
          <div key={department.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(department.id)}
                className="text-red-500 border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
              >
                Usuń
              </Button>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{department.name}</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500 dark:text-gray-400">Kierownik:</span> <span className="text-gray-900 dark:text-white">{department.manager}</span></p>
              <p className="flex items-center gap-1">
                <span className="text-gray-500 dark:text-gray-400">Pracownicy:</span>
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white">{department.employeesCount}</span>
              </p>
              <p className="text-gray-500 dark:text-gray-400">{department.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
