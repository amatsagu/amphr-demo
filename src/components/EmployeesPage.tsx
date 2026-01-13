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

interface Employee {
  id: number
  name: string
  email: string
  position: string
}

const initialEmployees: Employee[] = [
  { id: 1, name: "Aleksandra Kowalska", email: "aleksandra.k@example.com", position: "Kierownik" },
  { id: 2, name: "Bartosz Nowak", email: "bartosz.n@example.com", position: "Programista" },
  { id: 3, name: "Klara Wiśniewska", email: "klara.w@example.com", position: "Projektant" },
]

export function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleClear = () => {
    setSearchQuery("")
  }

  const handleDelete = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
  }

  const uniqueDepartments = new Set(employees.map((emp) => emp.position)).size

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Search and Stats Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search Section */}
        <div className="flex items-center gap-3 w-full sm:flex-1 sm:max-w-xl bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <Input
            type="text"
            placeholder="Wyszukaj"
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
          <div className="bg-white dark:bg-gray-800 rounded-lg px-4 md:px-6 py-3 shadow-sm border border-gray-100 dark:border-gray-700 min-w-[80px] md:min-w-[100px]">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Łącznie</div>
            <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{employees.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg px-4 md:px-6 py-3 shadow-sm border border-gray-100 dark:border-gray-700 min-w-[80px] md:min-w-[100px]">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Działy</div>
            <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{uniqueDepartments}</div>
          </div>
        </div>
      </div>

      {/* Employees Table - Desktop */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 dark:border-gray-700">
              <TableHead className="w-16 font-semibold text-gray-900 dark:text-white">#</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Imię i nazwisko</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Email</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Stanowisko</TableHead>
              <TableHead className="w-24 font-semibold text-gray-900 dark:text-white">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee, index) => (
              <TableRow key={employee.id} className="border-b border-gray-50 dark:border-gray-700">
                <TableCell className="text-gray-600 dark:text-gray-400">{index + 1}</TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-white">{employee.name}</TableCell>
                <TableCell>
                  <a 
                    href={`mailto:${employee.email}`} 
                    className="text-[#8963e4] hover:underline"
                  >
                    {employee.email}
                  </a>
                </TableCell>
                <TableCell className="text-gray-900 dark:text-white">{employee.position}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(employee.id)}
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

      {/* Employees Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredEmployees.map((employee, index) => (
          <div key={employee.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(employee.id)}
                className="text-red-500 border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
              >
                Usuń
              </Button>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{employee.name}</h3>
            <div className="space-y-1 text-sm">
              <p>
                <a 
                  href={`mailto:${employee.email}`} 
                  className="text-[#8963e4] hover:underline"
                >
                  {employee.email}
                </a>
              </p>
              <p className="text-gray-500 dark:text-gray-400">{employee.position}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
