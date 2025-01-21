"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { LogIn, LogOut } from "lucide-react"

const employees = [
  { id: 1, name: "Max Mustermann", code: "1234" },
  { id: 2, name: "Anna Schmidt", code: "5678" },
  { id: 3, name: "Tom Müller", code: "9012" },
]

export default function KioskMode() {
  const [presentEmployees, setPresentEmployees] = useState<number[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [employeeCode, setEmployeeCode] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleClockInOut = (action: "in" | "out") => {
    const employee = employees.find((e) => e.code === employeeCode)
    if (employee) {
      if (action === "in" && !presentEmployees.includes(employee.id)) {
        setPresentEmployees((prev) => [...prev, employee.id])
        toast({
          title: `${employee.name} hat sich eingestempelt`,
          description: `Zeit: ${currentTime.toLocaleTimeString()}`,
        })
      } else if (action === "out" && presentEmployees.includes(employee.id)) {
        setPresentEmployees((prev) => prev.filter((id) => id !== employee.id))
        toast({
          title: `${employee.name} hat sich ausgestempelt`,
          description: `Zeit: ${currentTime.toLocaleTimeString()}`,
        })
      }
      setEmployeeCode("")
    } else {
      toast({
        title: "Fehler",
        description: "Ungültiger Mitarbeitercode",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Kiosk-Modus - Zeiterfassung</CardTitle>
        <div className="text-xl font-bold">{currentTime.toLocaleTimeString()}</div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Input
            type="password"
            placeholder="Mitarbeitercode eingeben"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex space-x-4">
          <Button onClick={() => handleClockInOut("in")} className="flex-1 bg-green-500 hover:bg-green-600">
            <LogIn className="mr-2 h-4 w-4" /> Kommen
          </Button>
          <Button onClick={() => handleClockInOut("out")} className="flex-1 bg-red-500 hover:bg-red-600">
            <LogOut className="mr-2 h-4 w-4" /> Gehen
          </Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Anwesende Mitarbeiter:</h3>
          <ul className="space-y-1">
            {employees
              .filter((employee) => presentEmployees.includes(employee.id))
              .map((employee) => (
                <li key={employee.id} className="bg-gray-200 p-2 rounded">
                  {employee.name}
                </li>
              ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

